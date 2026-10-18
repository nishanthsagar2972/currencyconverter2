export type RateSnapshot = {
  rates: Record<string, number>;
  updatedAt: number;
  rateDate: string;
  source: "live" | "cached";
};

const CACHE_KEY = "currencyx-rate-cache-v2";
const CACHE_DURATION = 15 * 60 * 1000;

function validRates(value: unknown): value is Record<string, number> {
  return typeof value === "object" && value !== null && !Array.isArray(value) &&
    Object.keys(value).length > 1 && Object.values(value).every((rate) => typeof rate === "number" && Number.isFinite(rate) && rate > 0);
}

function readCache(): RateSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) ?? "null") as RateSnapshot | null;
    if (cached && (cached.source === "live" || cached.source === "cached") && validRates(cached.rates) &&
      Number.isFinite(cached.updatedAt) && cached.updatedAt > 0 && cached.updatedAt <= Date.now() &&
      typeof cached.rateDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(cached.rateDate)) {
      return { ...cached, source: "cached" };
    }
  } catch {
    return null;
  }
  return null;
}

export async function fetchUsdRates(force = false): Promise<RateSnapshot> {
  const cached = readCache();
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    if (cached) return cached;
    throw new Error("You're offline. Connect to the internet to download exchange rates.");
  }
  if (!force && cached && Date.now() - cached.updatedAt < CACHE_DURATION) return cached;

  try {
    const response = await fetch("/api/public/rates", { cache: "no-store", signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error("Rate service unavailable");
    const data = (await response.json()) as { rates?: unknown; date?: unknown; base?: unknown };
    if (!validRates(data.rates) || data.base !== "USD" || typeof data.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) throw new Error("Invalid rate response");
    const snapshot: RateSnapshot = {
      rates: { ...data.rates, USD: 1 },
      updatedAt: Date.now(),
      rateDate: data.date,
      source: "live",
    };
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(snapshot)); } catch { /* Rates still work when storage is unavailable. */ }
    return snapshot;
  } catch {
    if (cached) return cached;
    throw new Error("Exchange rates are unavailable. Check your connection and try again.");
  }
}

export function convertAmount(amount: number, from: string, to: string, usdRates: Record<string, number>) {
  const fromRate = usdRates[from];
  const toRate = usdRates[to];
  if (!Number.isFinite(amount) || amount <= 0) throw new Error("Amount must be greater than zero.");
  if (typeof fromRate !== "number" || typeof toRate !== "number" || !Number.isFinite(fromRate) || !Number.isFinite(toRate) || fromRate <= 0 || toRate <= 0) throw new Error("A rate is not available for this currency pair.");
  const result = amount * (toRate / fromRate);
  if (!Number.isFinite(result)) throw new Error("This amount is too large to convert.");
  return result;
}

export function getPairRate(from: string, to: string, usdRates: Record<string, number>) {
  return convertAmount(1, from, to, usdRates);
}
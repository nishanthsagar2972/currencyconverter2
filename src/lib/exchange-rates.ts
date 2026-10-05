import { fallbackUsdRates } from "./currency";

export type RateSnapshot = {
  rates: Record<string, number>;
  updatedAt: number;
  source: "live" | "fallback";
};

const CACHE_KEY = "currencyx-rate-cache-v1";
const CACHE_DURATION = 15 * 60 * 1000;

function readCache(): RateSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) ?? "null") as RateSnapshot | null;
    if (cached && Date.now() - cached.updatedAt < CACHE_DURATION) return cached;
  } catch {
    return null;
  }
  return null;
}

export async function fetchUsdRates(force = false): Promise<RateSnapshot> {
  if (!force) {
    const cached = readCache();
    if (cached) return cached;
  }

  try {
    const response = await fetch("/api/public/rates");
    if (!response.ok) throw new Error("Rate service unavailable");
    const data = (await response.json()) as { rates?: Record<string, number> };
    if (!data.rates) throw new Error("Invalid rate response");
    const snapshot: RateSnapshot = {
      rates: { USD: 1, ...data.rates },
      updatedAt: Date.now(),
      source: "live",
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(snapshot));
    return snapshot;
  } catch {
    return { rates: fallbackUsdRates, updatedAt: Date.now(), source: "fallback" };
  }
}

export function convertAmount(amount: number, from: string, to: string, usdRates: Record<string, number>) {
  const fromRate = usdRates[from];
  const toRate = usdRates[to];
  if (!fromRate || !toRate) throw new Error("A rate is not available for this currency pair.");
  return amount * (toRate / fromRate);
}

export function getPairRate(from: string, to: string, usdRates: Record<string, number>) {
  return convertAmount(1, from, to, usdRates);
}
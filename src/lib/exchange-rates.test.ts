import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { convertAmount, fetchUsdRates } from "./exchange-rates";

const data = { base: "USD", date: "2026-10-16", rates: { INR: 83, EUR: 0.92 } };

describe("Real exchange rates", () => {
  beforeEach(() => { localStorage.clear(); vi.spyOn(navigator, "onLine", "get").mockReturnValue(true); });
  afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });
  it("does not display fabricated rates when offline without a cache", async () => {
    vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);
    const fetch = vi.fn(); vi.stubGlobal("fetch", fetch);
    await expect(fetchUsdRates()).rejects.toThrow("offline");
    expect(fetch).not.toHaveBeenCalled();
  });
  it("uses only downloaded rates offline, preserving the actual download and rate dates", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => data }));
    const live = await fetchUsdRates();
    vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);
    const cached = await fetchUsdRates(true);
    expect(cached.source).toBe("cached");
    expect(cached.updatedAt).toBe(live.updatedAt);
    expect(cached.rateDate).toBe("2026-10-16");
    expect(convertAmount(100, "USD", "INR", cached.rates)).toBe(8300);
  });
  it("ignores legacy fabricated fallback caches", async () => {
    localStorage.setItem("currencyx-rate-cache-v1", JSON.stringify({ rates: { USD: 1, INR: 88.72 }, source: "fallback", updatedAt: Date.now() }));
    vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);
    await expect(fetchUsdRates()).rejects.toThrow("offline");
  });
  it("reports API failure instead of returning reference rates", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    await expect(fetchUsdRates()).rejects.toThrow("unavailable");
  });
  it("rejects malformed API rates", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ...data, rates: { INR: 0, EUR: -1 } }) }));
    await expect(fetchUsdRates()).rejects.toThrow("unavailable");
  });
  it("rejects invalid amounts and missing currency pairs", () => {
    for (const amount of [0, -10, NaN, Infinity]) expect(() => convertAmount(amount, "USD", "INR", { USD: 1, INR: 83 })).toThrow();
    expect(() => convertAmount(100, "USD", "AED", { USD: 1, INR: 83 })).toThrow("not available");
  });
});
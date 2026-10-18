import { describe, expect, it } from "vitest";
import { canRegisterAppWorker } from "./pwa";

describe("App worker safety", () => {
  const live = { production: true, framed: false, hostname: "currencyconverter2.lovable.app", search: "" };
  it("allows offline support on the published app", () => expect(canRegisterAppWorker(live)).toBe(true));
  it("never registers in development, frames, previews, or with the kill switch", () => {
    expect(canRegisterAppWorker({ ...live, production: false })).toBe(false);
    expect(canRegisterAppWorker({ ...live, framed: true })).toBe(false);
    expect(canRegisterAppWorker({ ...live, search: "?sw=off" })).toBe(false);
    for (const hostname of ["id-preview--abc.lovable.app", "preview--abc.lovable.app", "lovableproject.com", "abc.lovableproject.com", "lovableproject-dev.com", "abc.lovableproject-dev.com", "beta.lovable.dev", "abc.beta.lovable.dev"]) {
      expect(canRegisterAppWorker({ ...live, hostname })).toBe(false);
    }
  });
});
export type Currency = {
  code: string;
  name: string;
  symbol: string;
  flag: string;
};

export const currencies: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$", flag: "us" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "eu" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "gb" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "in" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "jp" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "au" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "ca" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", flag: "ae" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", flag: "ch" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "cn" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", flag: "sg" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$", flag: "nz" },
];

export const popularCurrencyCodes = ["USD", "EUR", "GBP", "INR", "JPY", "AUD", "CAD", "AED"];

export const fallbackUsdRates: Record<string, number> = {
  USD: 1,
  EUR: 0.86,
  GBP: 0.75,
  INR: 88.72,
  JPY: 147.2,
  AUD: 1.52,
  CAD: 1.39,
  AED: 3.6725,
  CHF: 0.8,
  CNY: 7.12,
  SGD: 1.29,
  NZD: 1.73,
};

export function getCurrency(code: string) {
  return currencies.find((currency) => currency.code === code) ?? { code: "USD", name: "US Dollar", symbol: "$", flag: "us" };
}

export function formatMoney(value: number, code: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: code,
    minimumFractionDigits: code === "JPY" ? 0 : 2,
    maximumFractionDigits: code === "JPY" ? 0 : 2,
  }).format(value);
}

export function formatRate(value: number) {
  if (value >= 100) return value.toFixed(2);
  if (value >= 1) return value.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
  return value.toFixed(6).replace(/0+$/, "").replace(/\.$/, "");
}
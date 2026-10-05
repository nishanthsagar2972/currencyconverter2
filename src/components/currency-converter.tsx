import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRightLeft,
  Check,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  LoaderCircle,
  Moon,
  RefreshCw,
  Search,
  Settings,
  Sparkles,
  Sun,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { currencies, formatMoney, formatRate, getCurrency, popularCurrencyCodes } from "@/lib/currency";
import { convertAmount, fetchUsdRates, getPairRate, type RateSnapshot } from "@/lib/exchange-rates";

type Conversion = {
  id: string;
  amount: number;
  from: string;
  to: string;
  result: number;
  createdAt: number;
};

const HISTORY_KEY = "currencyx-history-v1";

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("currencyx-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextDark = stored ? stored === "dark" : prefersDark;
    setDark(nextDark);
    document.documentElement.classList.toggle("dark", nextDark);
  }, []);

  const toggle = () => {
    const nextDark = !dark;
    setDark(nextDark);
    document.documentElement.classList.toggle("dark", nextDark);
    localStorage.setItem("currencyx-theme", nextDark ? "dark" : "light");
  };

  return (
    <Button variant="ghost" className="size-10 px-0" onClick={toggle} aria-label={`Switch to ${dark ? "light" : "dark"} mode`}>
      {dark ? <Sun size={19} /> : <Moon size={19} />}
    </Button>
  );
}

function Header() {
  return (
    <header className="border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 sm:h-18 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-action">
            <CircleDollarSign size={21} strokeWidth={2.4} />
          </div>
          <span className="truncate text-lg font-bold">Currency<span className="text-primary">X</span></span>
        </div>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
          <a className="text-sm font-semibold text-primary" href="#converter">Converter</a>
          <a className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" href="#rates">Rates</a>
          <a className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" href="#history">History</a>
        </nav>
        <div className="flex shrink-0 items-center gap-1">
          <ThemeToggle />
          <Button variant="ghost" className="size-10 px-0" aria-label="Settings"><Settings size={19} /></Button>
        </div>
      </div>
    </header>
  );
}

function AmountInput({ value, onChange, error }: { value: string; onChange: (value: string) => void; error?: string }) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-xs font-bold uppercase text-muted-foreground">Amount</span>
      <div className={cn("flex h-16 items-center rounded-lg border bg-surface px-4 transition-colors focus-within:ring-2 focus-within:ring-ring/30", error ? "border-destructive" : "border-border focus-within:border-primary")}>
        <span className="mr-3 text-lg font-semibold text-muted-foreground">{getCurrency("USD").symbol}</span>
        <input
          aria-label="Amount"
          aria-invalid={Boolean(error)}
          inputMode="decimal"
          placeholder="100"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-xl font-bold text-foreground outline-none placeholder:text-muted-foreground/60"
        />
      </div>
      {error && <span className="mt-2 block text-xs font-medium text-destructive">{error}</span>}
    </label>
  );
}

function CurrencySelector({ label, value, onChange }: { label: string; value: string; onChange: (code: string) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const selected = getCurrency(value);
  const filtered = currencies.filter((currency) => `${currency.code} ${currency.name}`.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative min-w-0" ref={containerRef}>
      <span className="mb-2 block text-xs font-bold uppercase text-muted-foreground">{label}</span>
      <Button
        variant="secondary"
        aria-haspopup="listbox"
        aria-expanded={open}
        className="h-16 w-full justify-between px-4 text-left"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="text-2xl" aria-hidden="true">{selected.flag}</span>
          <span className="min-w-0">
            <span className="block text-sm font-bold text-foreground">{selected.code}</span>
            <span className="block truncate text-xs font-normal text-muted-foreground">{selected.name}</span>
          </span>
        </span>
        <ChevronDown size={17} className={cn("shrink-0 transition-transform", open && "rotate-180")} />
      </Button>
      {open && (
        <div className="absolute top-full z-30 mt-2 w-full min-w-64 overflow-hidden rounded-lg border border-border bg-popover p-2 shadow-float">
          <div className="flex items-center gap-2 border-b border-border px-2 pb-2">
            <Search size={16} className="shrink-0 text-muted-foreground" />
            <input autoFocus aria-label="Search currencies" placeholder="Search currency" value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground" />
            {query && <Button variant="ghost" className="size-8 px-0" onClick={() => setQuery("")} aria-label="Clear search"><X size={15} /></Button>}
          </div>
          <div className="mt-1 max-h-64 overflow-y-auto" role="listbox">
            {filtered.map((currency) => (
              <Button key={currency.code} variant="ghost" role="option" aria-selected={currency.code === value} className="h-auto w-full justify-start px-2 py-2.5 text-left" onClick={() => { onChange(currency.code); setOpen(false); setQuery(""); }}>
                <span className="text-xl">{currency.flag}</span>
                <span className="min-w-0 flex-1"><span className="font-bold text-foreground">{currency.code}</span><span className="ml-2 truncate font-normal text-muted-foreground">{currency.name}</span></span>
                {currency.code === value && <Check size={16} className="text-primary" />}
              </Button>
            ))}
            {filtered.length === 0 && <p className="px-3 py-6 text-center text-sm text-muted-foreground">No currencies found</p>}
          </div>
        </div>
      )}
    </div>
  );
}

function SwapButton({ onClick, swapped }: { onClick: () => void; swapped: boolean }) {
  return (
    <Button variant="icon" onClick={onClick} aria-label="Swap currencies" className="mx-auto size-11 rounded-full px-0 md:mt-7">
      <ArrowRightLeft size={18} className={cn("transition-transform duration-500 md:rotate-0", swapped && "rotate-180")} />
    </Button>
  );
}

function ConversionResult({ amount, from, to, result, rate }: { amount: number; from: string; to: string; result: number; rate: number }) {
  return (
    <div className="mt-6 border-t border-border pt-6 text-center" aria-live="polite">
      <p className="text-sm font-semibold text-muted-foreground">{formatMoney(amount, from)} {from}</p>
      <ArrowDown size={18} className="mx-auto my-2 text-primary" />
      <p className="text-3xl font-bold text-foreground sm:text-4xl">{formatMoney(result, to)} <span className="text-xl text-muted-foreground">{to}</span></p>
      <p className="mt-3 text-sm font-semibold text-primary">1 {from} = {formatRate(rate)} {to}</p>
    </div>
  );
}

function ConverterCard({ snapshot, onConverted }: { snapshot: RateSnapshot; onConverted: (item: Conversion) => void }) {
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");
  const [result, setResult] = useState<number | null>(() => convertAmount(100, "USD", "INR", snapshot.rates));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [swapped, setSwapped] = useState(false);

  const validate = () => {
    if (!amount.trim()) return "Enter an amount to convert.";
    const numeric = Number(amount);
    if (!Number.isFinite(numeric)) return "Enter a valid number.";
    if (numeric <= 0) return "Amount must be greater than zero.";
    return "";
  };

  const convert = () => {
    const validation = validate();
    if (validation) { setError(validation); return; }
    setError("");
    setLoading(true);
    window.setTimeout(() => {
      try {
        const numeric = Number(amount);
        const converted = convertAmount(numeric, from, to, snapshot.rates);
        setResult(converted);
        onConverted({ id: `${Date.now()}-${from}-${to}`, amount: numeric, from, to, result: converted, createdAt: Date.now() });
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Conversion failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }, 450);
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
    setSwapped((current) => !current);
    if (result !== null) {
      setAmount(result.toFixed(2));
      setResult(Number(amount));
    }
  };

  const rate = getPairRate(from, to, snapshot.rates);

  return (
    <section id="converter" className="mx-auto max-w-5xl scroll-mt-8 rounded-xl border border-border/80 bg-card p-5 shadow-card sm:p-8">
      <div className="grid items-start gap-3 md:grid-cols-[1fr_1fr_auto_1fr]">
        <AmountInput value={amount} onChange={(next) => { setAmount(next); setError(""); }} error={error} />
        <CurrencySelector label="From currency" value={from} onChange={setFrom} />
        <SwapButton onClick={swap} swapped={swapped} />
        <CurrencySelector label="To currency" value={to} onChange={setTo} />
      </div>
      <Button onClick={convert} disabled={loading} className="mt-5 h-13 w-full text-base">
        {loading ? <><LoaderCircle size={19} className="animate-spin" /> Calculating...</> : <><Sparkles size={18} /> Convert Currency</>}
      </Button>
      {result !== null && !error && <ConversionResult amount={Number(amount) || 0} from={from} to={to} result={result} rate={rate} />}
    </section>
  );
}

function PopularCurrencies({ snapshot, refreshing, onRefresh }: { snapshot: RateSnapshot; refreshing: boolean; onRefresh: () => void }) {
  return (
    <section id="rates" className="scroll-mt-8 py-12 sm:py-16">
      <div className="mb-5 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
        <div className="min-w-0"><p className="text-xs font-bold uppercase text-primary">Market snapshot</p><h2 className="mt-1 text-2xl font-bold">Popular currencies</h2></div>
        <Button variant="secondary" onClick={onRefresh} disabled={refreshing} className="px-3 sm:px-4" aria-label="Refresh exchange rates"><RefreshCw size={16} className={cn(refreshing && "animate-spin")} /><span className="hidden sm:inline">Refresh rates</span></Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {popularCurrencyCodes.map((code) => {
          const currency = getCurrency(code);
          return (
            <article key={code} className="rounded-lg border border-border bg-card p-4 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card">
              <div className="flex items-center justify-between"><span className="text-2xl">{currency.flag}</span><TrendingUp size={16} className="text-success" /></div>
              <div className="mt-4 flex items-end justify-between gap-2"><div className="min-w-0"><h3 className="font-bold">{currency.code}</h3><p className="truncate text-xs text-muted-foreground">{currency.name}</p></div><p className="shrink-0 text-sm font-bold">{formatRate(snapshot.rates[code] ?? 0)}</p></div>
            </article>
          );
        })}
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground"><Clock3 size={13} />Rates shown per 1 USD · {snapshot.source === "live" ? "Live market data" : "Last known reference rates"}</p>
    </section>
  );
}

function ConversionHistory({ items, onClear }: { items: Conversion[]; onClear: () => void }) {
  return (
    <section id="history" className="scroll-mt-8 pb-16">
      <div className="mb-5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3"><h2 className="truncate text-2xl font-bold">Recent conversions</h2><Button variant="ghost" onClick={onClear} disabled={items.length === 0} className="px-2 sm:px-3"><Trash2 size={16} /><span className="hidden sm:inline">Clear history</span></Button></div>
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-soft">
        {items.length === 0 ? (
          <div className="px-5 py-10 text-center"><Clock3 className="mx-auto text-muted-foreground" size={24} /><p className="mt-2 text-sm font-medium text-muted-foreground">Your conversions will appear here.</p></div>
        ) : (
          <div className="divide-y divide-border">
            <div className="hidden grid-cols-[1.2fr_.7fr_.7fr_1.4fr_1fr] gap-4 bg-muted/60 px-5 py-3 text-xs font-bold uppercase text-muted-foreground sm:grid"><span>Amount</span><span>From</span><span>To</span><span>Result</span><span>Date</span></div>
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-4 sm:grid-cols-[1.2fr_.7fr_.7fr_1.4fr_1fr] sm:px-5">
                <div className="min-w-0"><p className="truncate font-bold">{formatMoney(item.amount, item.from)}</p><p className="text-xs text-muted-foreground sm:hidden">{item.from} → {item.to}</p></div>
                <span className="hidden text-sm sm:block">{item.from}</span><span className="hidden text-sm sm:block">{item.to}</span>
                <p className="text-right font-bold text-primary sm:text-left">{formatMoney(item.result, item.to)}</p>
                <p className="col-span-2 text-xs text-muted-foreground sm:col-span-1">{new Date(item.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function CurrencyConverterApp() {
  const [snapshot, setSnapshot] = useState<RateSnapshot>({ rates: { USD: 1, EUR: 0.86, GBP: 0.75, INR: 88.72, JPY: 147.2, AUD: 1.52, CAD: 1.39, AED: 3.6725 }, updatedAt: Date.now(), source: "fallback" });
  const [refreshing, setRefreshing] = useState(false);
  const [history, setHistory] = useState<Conversion[]>([]);

  useEffect(() => {
    try { setHistory(JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]") as Conversion[]); } catch { setHistory([]); }
    void fetchUsdRates().then(setSnapshot);
  }, []);

  const addHistory = (item: Conversion) => {
    setHistory((current) => {
      const next = [item, ...current].slice(0, 8);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  };

  const clearHistory = () => { localStorage.removeItem(HISTORY_KEY); setHistory([]); };
  const refresh = async () => { setRefreshing(true); setSnapshot(await fetchUsdRates(true)); setRefreshing(false); };
  const timestamp = useMemo(() => Date.now() - snapshot.updatedAt < 60000 ? "just now" : new Date(snapshot.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), [snapshot.updatedAt]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <div className="bg-hero-wash px-4 pb-12 pt-12 sm:px-6 sm:pb-16 sm:pt-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-8 max-w-2xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary-soft px-3 py-1.5 text-xs font-bold text-primary"><span className="size-1.5 rounded-full bg-success" /> Live exchange rates</div>
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl">Convert currencies instantly</h1>
              <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">Fast, simple and accurate currency conversion at your fingertips.</p>
            </div>
            <ConverterCard snapshot={snapshot} onConverted={addHistory} />
            <p className="mt-3 text-center text-xs text-muted-foreground">Exchange rate updated {timestamp}</p>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PopularCurrencies snapshot={snapshot} refreshing={refreshing} onRefresh={refresh} />
          <ConversionHistory items={history} onClear={clearHistory} />
        </div>
      </main>
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">CurrencyX · Rates are indicative and may vary by provider.</footer>
    </div>
  );
}
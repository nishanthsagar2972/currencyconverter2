import { createFileRoute } from "@tanstack/react-router";
import { CurrencyConverterApp } from "@/components/currency-converter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CurrencyX — Fast, Accurate Currency Converter" },
      { name: "description", content: "Convert global currencies instantly with live exchange rates, searchable currencies, and private conversion history." },
      { property: "og:title", content: "CurrencyX — Fast, Accurate Currency Converter" },
      { property: "og:description", content: "Convert global currencies instantly with live exchange rates and a polished, easy-to-use experience." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <CurrencyConverterApp />;
}

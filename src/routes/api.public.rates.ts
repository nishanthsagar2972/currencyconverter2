import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/rates")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const response = await fetch("https://api.frankfurter.dev/v1/latest?base=USD", {
            headers: { Accept: "application/json" },
          });
          if (!response.ok) return Response.json({ error: "Rates unavailable" }, { status: 502 });
          const data = await response.json();
          return Response.json(data, { headers: { "Cache-Control": "public, max-age=900" } });
        } catch {
          return Response.json({ error: "Rates unavailable" }, { status: 502 });
        }
      },
    },
  },
});
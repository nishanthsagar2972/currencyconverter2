<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project architecture

- Keep exchange-rate fetching, caching, metadata, formatting, and calculations in `src/lib`; UI components only consume those functions so data providers can change independently.
- Persist only theme choice, cached public rates, and recent conversions in browser storage because CurrencyX requires no user account or shared server state.
- Generate the offline worker with vite-plugin-pwa into dist/client and register it only through src/lib/pwa.ts after hydration; block dev, preview, iframes, and sw=off so preview changes remain uncached.
- Cache only the public root navigation with NetworkFirst and static assets; never cache API or OAuth requests in the worker, so exchange-rate freshness stays owned by src/lib.
- Keep the install manifest in public/manifest.webmanifest and matching icons in public/icons; root head links them so Android can provide its native launch screen.

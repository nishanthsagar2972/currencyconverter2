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

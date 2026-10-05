# CurrencyX implementation plan

## Experience
- Replace the placeholder with a responsive, single-page fintech converter optimized for the current mobile viewport and larger screens.
- Establish a white/light theme with restrained blue and purple accents, plus a complete high-contrast dark theme and smooth transitions.
- Add a compact header, centered introduction, prominent converter, popular-rate cards, and a recent-conversions table that reflows safely on small screens.

## Components and interactions
- Create reusable Header, ThemeToggle, AmountInput, CurrencySelector, SwapButton, ConverterCard, ConversionResult, PopularCurrencies, and ConversionHistory components.
- Make currency selection searchable with keyboard-accessible dialogs, flags, symbols, codes, and full names.
- Validate empty, non-numeric, zero, and negative amounts; animate swapping; show conversion loading and errors; support manual rate refresh.
- Persist theme and recent successful conversions locally, with a working Clear History action.

## Rates and data
- Keep rate fetching, caching, currency metadata, formatting, and conversion calculations outside visual components.
- Use Frankfurter’s public exchange-rate API with a short local cache and reliable embedded fallback rates so conversion remains usable during network failures.
- Populate the requested popular currencies from the current base rate and show when rates were refreshed.

## Technical details
- Use the existing React, TypeScript, Tailwind v4, Radix/shadcn-compatible primitives, and Lucide setup.
- Define all visual values as semantic OKLCH tokens in the shared design system; load Inter through the document head.
- Add route-specific title, description, Open Graph, and Twitter metadata.
- Record the rate-source and local-persistence architecture in the project guidance, then verify build status and the live interface at mobile and desktop sizes.

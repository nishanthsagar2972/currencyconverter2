# Swift Currency

Build a modern, responsive Currency Converter web application UI with a clean fintech-style design.



Main Goal



Create a visually attractive currency converter that allows users to enter an amount, select a source currency and target currency, and instantly see the converted amount.



Design



- Modern fintech dashboard aesthetic

- Clean white/light background with subtle gradients

- Use a professional color palette with blue/purple accents

- Rounded cards with soft shadows

- Smooth hover and transition animations

- Fully responsive for mobile, tablet, and desktop

- Use clean typography such as Inter or Poppins

- Add currency flags and currency symbols wherever appropriate



Page Layout



1. Header



- App logo/icon with the name CurrencyX

- Navigation items:

  - Converter

  - Rates

  - History

- Right side:

  - Light/Dark mode toggle

  - Settings icon



2. Hero Section



Display:

"Convert currencies instantly"



Subtitle:

"Fast, simple and accurate currency conversion at your fingertips."



3. Currency Converter Card



Create a large centered converter card containing:



Amount



- Numeric input

- Example: "100"



From Currency



- Dropdown with searchable currencies

- Show flag + currency code + currency name

- Default: "USD – US Dollar"



Swap Button



- Circular button between the two currency selectors

- Animated rotation effect when clicked

- Swaps From and To currencies



To Currency



- Dropdown with searchable currencies

- Default: "INR – Indian Rupee"



Convert Button



- Large primary button

- Text: "Convert Currency"

- Add loading animation while calculating



4. Conversion Result



After conversion, display:



"$100.00 USD"



↓



"₹8,300.00 INR"



Also display:



"1 USD = 83.00 INR"



Add a small timestamp:

"Exchange rate updated just now"



Popular Currencies



Below the converter, create a section titled:



Popular Currencies



Display cards for:



- USD – US Dollar

- EUR – Euro

- GBP – British Pound

- INR – Indian Rupee

- JPY – Japanese Yen

- AUD – Australian Dollar

- CAD – Canadian Dollar

- AED – UAE Dirham



Each card should show the flag, currency code, currency name and current exchange rate.



Recent Conversions



Create a small table/card showing recent conversions:



Amount| From| To| Result| Date

$100| USD| INR| ₹8,300| Today

€50| EUR| USD| $54| Yesterday



Add a Clear History button.



Functionality



- Currency dropdown must be searchable.

- Swap currencies instantly.

- Validate empty, negative, and invalid amounts.

- Calculate conversion dynamically.

- Use a real exchange-rate API if available.

- Keep API logic separate from UI components.

- Show loading and error states.

- Cache the latest exchange rates where appropriate.

- Allow users to refresh rates.

- Persist recent conversions using localStorage.



Dark Mode



Add a complete dark mode:



- Dark background

- Dark cards

- High-contrast text

- Same professional fintech appearance

- Smooth theme transition



Responsive Design



On mobile:



- Stack all converter fields vertically.

- Keep the swap button clearly accessible.

- Make buttons full width.

- Ensure cards and tables fit small screens without horizontal overflow.



Technical Requirements



Use:



- React

- TypeScript

- Tailwind CSS

- shadcn/ui components

- Lucide React icons

- Component-based architecture



Create reusable components such as:



- Header

- CurrencySelector

- AmountInput

- SwapButton

- ConverterCard

- ConversionResult

- PopularCurrencies

- ConversionHistory

- ThemeToggle



Make the final UI polished enough for a real production website, with smooth animations, proper spacing, accessibility, clear error messages, and a professional fintech appearance.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://currencyconverter2.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/df3c8892-cd16-4284-8f29-226aba946fc9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

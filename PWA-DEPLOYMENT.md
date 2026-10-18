# CurrencyX deployment and Android installation

## Deploy
1. In Lovable, open **Publish** at the top right.
2. Select **Publish changes** (or **Update**, depending on the dialog), then wait for confirmation.
3. Open https://currencyconverter2.lovable.app in a new browser tab. The editor preview does not install or cache offline pages.

## Install on Android
1. Open the published address in Chrome on Android while connected to the internet.
2. Tap **Install app** in CurrencyX if offered. Otherwise open Chrome's three-dot menu and select **Install app** or **Add to Home screen**, then **Install**. Wording and availability vary by browser/version.
3. Confirm the prompt. Open CurrencyX from its home-screen/app-drawer icon; supported Android browsers launch it without browser controls and provide a splash screen using its icon and manifest colors.
4. Open the installed app online once and wait for rates to download before testing airplane mode. The first page opened before the worker takes control may need one online reload to cache its navigation.

## Offline behavior
- After an online visit has cached the app, its converter, selectors, theme, and recent history can open offline.
- Conversion uses only previously downloaded real rates, labeled **saved rates** with their download timestamp and rate date. Saved rates may be stale and are not live quotes.
- Without saved real rates, conversion is disabled. Embedded/fabricated reference rates are never used.
- Reconnecting triggers a new download. Missing currency pairs remain unavailable (Frankfurter does not supply every listed currency, including AED).
- API responses are not cached by the worker. The public-rate cache is managed separately by the app.
- Offline support and native install prompts cannot be verified in the Lovable editor preview: the worker is deliberately disabled there. Validate those on the published site on a real Android device.

## Update behavior
The generated worker checks for updates automatically. Close and reopen the installed app after publishing to load the new version; no forced-reload loop is used. Browser storage can be cleared or evicted, so offline access is not guaranteed after clearing browser data.

Implementation follows the built-in PWA skill.
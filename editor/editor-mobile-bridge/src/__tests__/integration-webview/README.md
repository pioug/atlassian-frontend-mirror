# Integration Testing on iOS and Android

The editor mobile bridge supports testing on real handheld devices (phones & tablets) within BrowserStack's device farm (App Automate).

> We rely on a combination of _unit_, _integration_, and _visual regression_ tests designed for desktop browsers to catch and prevent regressions within the editor related packages.
>
> While these are useful for covering the majority of scenarios, they can't capture the unique differences presented within a mobile WebView.

Examples:

1. Composition input is used on Soft Keyboards (virtual) which is treated very differently within the Prosemirror internals compared to regular keyboard events.
1. Functional differences between vendor Soft Keyboard implementations can often lead to unexpected input quirks.
1. We support two scrolling modes: Fixed height WebView uses body scrolling. Alternatively, we support resizing the WebView to match the content height, at which point native scrolling takes over.
1. Touch screen devices present their own challenges using a touch input instead of a mouse.
1. Orientation changes and how they impact the layout and any existing content on the page.

**These mobile integation tests are designed to compliment the desktop tests and cover the gaps.**

### Spoofed Testing vs Real Testing

Our use of App Automate is new, so for now we have pre-existing integration tests that run in the regular JSDom environment, alongside our new integration tests that run on real mobile devices.

For now, the legacy tests reside within the `src/__tests__/integration/` and `src/__tests__/integration/`, while our new ones live inside `src/__tests__/integration-hybrid/`.

> These will all be ported across to use App Automate in the near future.

### How to run a test

For local testing, you can run the `test:webdriver:browserstack:mobile` script and point it at your desired file ~~or the entire package~~. e.g.

- `yarn test:webdriver:browserstack:mobile packages/editor/editor-mobile-bridge/src/__tests__/integration-hybrid/composition.ts`
- ~~yarn test:webdriver:browserstack:mobile editor-mobile-bridge~~ _(coming soon)_

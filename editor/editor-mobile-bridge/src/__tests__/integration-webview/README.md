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

> Read the `@atlaskit/webdriver-runner` [webview docs](../../../../../../build/webdriver-runner/utils/mobile/README.md) to learn more.

### Spoofed Testing vs Real Testing

Our use of App Automate is new, so for now we have pre-existing integration tests that run in the regular JSDom environment, alongside our new integration tests that run on real mobile devices.

For now, the legacy tests reside within the `src/__tests__/integration/` and `src/__tests__/integration/`, while our new ones live inside `src/__tests__/integration-webview/`.

> These will all be ported across to use App Automate in the near future.

### How to run a test

For local testing, you can run the `test:webdriver:browserstack:mobile` script and point it at your desired file or the entire package. e.g.

- `yarn test:webdriver:browserstack:mobile packages/editor/editor-mobile-bridge/src/__tests__/integration-webview/composition.ts`
- `yarn test:webdriver:browserstack:mobile editor-mobile-bridge`

> You need to upload the app binaries into your BrowserStack account. See [Troubleshooting](#troubleshooting) to learn how to upload.

### Test Suite Efficiency

**_As you can imagine, testing on handheld devices is significantly slower than testing on desktop browsers!_**

Handhelds typically run slower hardware with less system resources (_particularly older devices_), and we support a wider range of devices in terms of backwards compatibility compared to desktop.

> You can view the supported mobile OS versions [here](https://product-fabric.atlassian.net/wiki/spaces/MK/pages/1261182737/Tech+Stack), which is driven by our analytics OS usage statistics [here](https://analytics.amplitude.com/atlassian/dashboard/aiv9477). These change over time.

A test can skip running on a device based on the platform, operating system version, form factor, or software keyboard it uses. Consult the `MobileTestCaseOptions` to learn the syntax and combinations available.

You're encouraged to run your tests on the least amount of devices suitable to achieve your assertions with confidence.
This will speed up test suite execution times by skipping surplus devices.

**Example:**

```typescript
import { MobileTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';

MobileTestCase(
  'iOS only test',
  { skipPlatform: ['ios'] }, // MobileTestCaseOptions
  async (client: any, testName: string) => {
    const page = new Page(client);
    expect(page.isAndroid()).toBe(true);
  },
);
```

### Troubleshooting

> **BrowserStack automatically delete uploaded app binaries after 30 days.** > _The `upload-webdriver-webview-binaries` pipeline is automatically run every 30 days in CI._

If you encounter the below error, you'll need to upload (or re-upload) them into your account via the custom pipeline.

```
ERROR webdriver: Request failed with status 200 due to Error:
[BROWSERSTACK_INVALID_APP_CAP] The app_url/ custom_id/ shareable_id specified in the 'app' capability in your test script is invalid.
Please update the 'app' capability with a valid value and try again.
```

1. Visit the [branches](https://bitbucket.org/atlassian/atlassian-frontend/branches/) page on BitBucket.
1. Click the `...` icon in the far right to view available Actions.
1. Click `Run pipeline for a branch` from the drop down list (_it may take a few moments to appear_).
1. Search for and select `custom: upload-webdriver-webview-binaries` for the Pipeline input.
1. In the _Variables_ section paste in your credentials for `BROWSERSTACK_USERNAME` and `SECURED_BROWSERSTACK_KEY`.
1. Click the blue `Run` button.
1. If the build is green, you now have access to the apps on your account. If it's red, double check your credentials or ask for help in `#help-twp-editor` on Slack.

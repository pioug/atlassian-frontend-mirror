# Integration Testing on iOS and Android

The editor mobile bridge supports testing on real handheld devices (phones & tablets) within BrowserStack's device farm (App Automate) using [Appium](http://appium.io/docs/en/about-appium/intro/) and [WebDriverIO](https://webdriver.io/docs/gettingstarted.html).

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

> Read the `@atlaskit/webdriver-runner` [webview docs](../../../../../../build/test-utils/webdriver-runner/utils/mobile/README.md) to learn more.

#### Requesting Access

[App Automate](https://app-automate.browserstack.com/) is a separate license from [Automate](https://automate.browserstack.com/). You can request access via Service Desk [here](https://hello.atlassian.net/servicedesk/customer/portal/2/create/3998) and check the box for "Mobile App Testing".

### Spoofed Testing vs Real Testing

Our use of App Automate is new, so for now we have pre-existing integration tests that run in the regular JSDom environment, alongside our new integration tests that run on real mobile devices.

For now, the legacy tests reside within the `src/__tests__/integration/` while our new ones live inside `src/__tests__/integration-webview/`.

> These will all be ported across to use App Automate in the near future.

### How to run a test

For local testing, you can run the `test:webdriver:browserstack:mobile` script and point it at your desired file or the entire package. e.g.

- `yarn test:webdriver:browserstack:mobile packages/editor/editor-mobile-bridge/src/__tests__/integration-webview/composition.ts`
- `yarn test:webdriver:browserstack:mobile editor-mobile-bridge`

### Test Suite Efficiency

**_As you can imagine, testing on handheld devices is significantly slower than testing on desktop browsers!_**

Handhelds typically run slower hardware with less system resources (_particularly older devices_), and we support a wider range of devices in terms of backwards compatibility compared to desktop.

> You can view the supported mobile OS versions [here](https://hello.atlassian.net/wiki/spaces/MOBILEKIT/pages/907164712/Tech+Stack), which is driven by our analytics OS usage statistics [here](https://analytics.amplitude.com/atlassian/dashboard/aiv9477). These change over time.

A test can skip running on a device based on the platform, operating system version, form factor, or software keyboard it uses. Consult the `MobileTestCaseOptions` to learn the syntax and combinations available.

Although many tests will need to run on the full device suite, you're encouraged to run your tests on the least amount of devices suitable to achieve your assertions with confidence. This will speed up test suite execution times by skipping surplus devices.

**Example:**

```typescript
import { MobileTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';

MobileTestCase(
  'This test only runs for iPadOS on v13 and the default version (e.g. v14)',
  // `MobileTestCaseOptions` controls device skipping
  {
    skipPlatform: ['android'],
    versions: ['DEFAULT', 'ios 13'],
    formFactors: ['tablet'],
  },
  async (client: any, testName: string) => {
    const page = await Page.create(client);
    // Test something specific to iPads...
    expect(page.isIOS()).toBe(true);
  },
);
```

### Mobile VR testing

Visual regression testing is performed using Browserstack App Automate + Appium screenshot helpers http://appium.io/docs/en/commands/session/screenshot

We retrieve a base64 PNG of the current native viewport and we compare it against the existing for that test using jest-image-snapshot + toMatchProdImageSnapshot method.
To ensure consistency, we add an overlay to the screenshots to cover the statusbar and hide dynamic values like time or battery.

### How to run a mobile VR test

Mobile test run the same way as regular Browserstack mobile test, you can just use the `mobileSnapshot` method in your test and run it using `test:webdriver:browserstack:mobile`

```
$ BROWSERSTACK_USERNAME=USERNAME BROWSERSTACK_KEY=KEY yarn test:webdriver:browserstack:mobile PATH
```

### How to update a mobile VR snapshot

```
$ BROWSERSTACK_USERNAME=USERNAME BROWSERSTACK_KEY=KEY yarn test:webdriver:browserstack:mobile PATH -u
```

### Writting a mobile VR test

```ts
import { MobileTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-app-wrapper';
import { setADFContent } from '../integration-webview/_utils/afe-app-helpers';
import { loadEditor } from '../integration-webview/_page-objects/hybrid-editor-page';
import adf from '../integration-webview/__fixtures__/demo.adf.json';
import { mobileSnapshot } from '../_utils';

MobileTestCase('VR demo: Load ADF and snapshot', {}, async client => {
  const page = await Page.create(client);
  await loadEditor(page);
  await page.switchToWeb();
  await setADFContent(page, adf);
  await mobileSnapshot(page);
});
```

Snapshots are saved under
`packages/editor/editor-mobile-bridge/src/__tests__/__image_snapshots__/vr-demo-load-adf-and-snapshot.png`

### Disabling mobile VR tests

Use `DISABLE_MOBILE_VR=true` to disable all mobile VR test, such env var will ignore the image diffing to happen for mobile tests.

### Troubleshooting

> **BrowserStack automatically delete uploaded app binaries after 30 days.** > _The `upload-webdriver-webview-binaries` Pipeline is automatically run every 30 days in CI so this shouldn't be a problem._

This error indicates it couldn't find the app binaries in the provided BrowserStack account:

```
ERROR webdriver: Request failed with status 200 due to Error:
[BROWSERSTACK_INVALID_APP_CAP] The app_url/ custom_id/ shareable_id specified in the 'app' capability in your test script is invalid.
Please update the 'app' capability with a valid value and try again.
```

You you encounter this error:

- In CI, then ping `!disturbed` in [#atlassian-frontend](https://atlassian.slack.com/archives/CL6HC337Z) for help.
- Locally, you'll need to upload (or re-upload) them into your account via the custom pipeline.
  - First double check that you haven't accidentally set a value for `BROWSERSTACK_MOBILE_USERNAME` in your bash profile.
    - This is only for use when you're intending to alter the native application.

To upload the app binaries into your account:

1. Visit the [branches](https://bitbucket.org/atlassian/atlassian-frontend/branches/) page on Bitbucket.
1. Click the `...` icon in the far right to view available Actions.
1. Click `Run pipeline for a branch` from the drop down list (_it may take a few moments to appear_).
1. Search for and select `custom: upload-webdriver-webview-binaries` for the Pipeline input.
1. In the _Variables_ section paste in your credentials for `BROWSERSTACK_USERNAME` and `SECURED_BROWSERSTACK_KEY`.
1. Click the blue `Run` button.
1. If the build is green, you now have access to the apps on your account. If it's red, double check your credentials or ask for help in `#help-twp-editor` on Slack.

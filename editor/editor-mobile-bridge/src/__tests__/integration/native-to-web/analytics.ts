import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  callNativeBridge,
  clearBridgeOutput,
  editor,
  skipBrowsers as skip,
  getBridgeOutput,
} from '../_utils';

import { INPUT_METHOD, AnalyticsEventPayload } from '@atlaskit/editor-core';

const callNativeBridgeFirst = async (
  browser: any,
  fnName: any,
  ...args: any[]
) => {
  await browser.goto(editor.path);
  await browser.waitForSelector(editor.placeholder);
  await callNativeBridge(browser, fnName, ...args);
};

const expectTrackEventsToMatchCustomSnapshot = async (
  browser: any,
  testName: string,
) => {
  const outputEvents = await getBridgeOutput(
    browser,
    'analyticsBridge',
    'trackEvent',
  );

  const trackEvents = outputEvents
    .map((outputEvent: any) => JSON.parse(outputEvent.event))
    .filter(
      (analyticsEvent: AnalyticsEventPayload) =>
        analyticsEvent.eventType === 'track',
    );

  expect(trackEvents).toMatchCustomSnapshot(testName);
};

const simpleBrowserTestCase = async (
  client: any,
  testName: string,
  fnName: any,
  ...args: any[]
) => {
  const browser = new Page(client);
  await callNativeBridgeFirst(browser, fnName, ...args);
  await expectTrackEventsToMatchCustomSnapshot(browser, testName);
};

BrowserTestCase(
  'editor: toggling bold style fires an analytics event via the bridge',
  { skip },
  async (client: any, testName: string) => {
    await simpleBrowserTestCase(
      client,
      testName,
      'onBoldClicked',
      INPUT_METHOD.TOOLBAR,
    );
  },
);

BrowserTestCase(
  'editor: toggling italic style fires an analytics event via the bridge',
  { skip },
  async (client: any, testName: string) => {
    await simpleBrowserTestCase(
      client,
      testName,
      'onItalicClicked',
      INPUT_METHOD.TOOLBAR,
    );
  },
);

BrowserTestCase(
  'editor: toggling underline style fires an analytics event via the bridge',
  { skip },
  async (client: any, testName: string) => {
    await simpleBrowserTestCase(
      client,
      testName,
      'onUnderlineClicked',
      INPUT_METHOD.TOOLBAR,
    );
  },
);

BrowserTestCase(
  'editor: toggling code style fires an analytics event via the bridge',
  { skip },
  async (client: any, testName: string) => {
    await simpleBrowserTestCase(
      client,
      testName,
      'onCodeClicked',
      INPUT_METHOD.TOOLBAR,
    );
  },
);

BrowserTestCase(
  'editor: toggling strike style fires an analytics event via the bridge',
  { skip },
  async (client: any, testName: string) => {
    await simpleBrowserTestCase(
      client,
      testName,
      'onStrikeClicked',
      INPUT_METHOD.TOOLBAR,
    );
  },
);

BrowserTestCase(
  'editor: toggling superscript style fires an analytics event via the bridge',
  { skip },
  async (client: any, testName: string) => {
    await simpleBrowserTestCase(
      client,
      testName,
      'onSuperClicked',
      INPUT_METHOD.TOOLBAR,
    );
  },
);

BrowserTestCase(
  'editor: toggling subscript style fires an analytics event via the bridge',
  { skip },
  async (client: any, testName: string) => {
    await simpleBrowserTestCase(
      client,
      testName,
      'onSubClicked',
      INPUT_METHOD.TOOLBAR,
    );
  },
);

BrowserTestCase(
  'editor: updating status fires an analytics event via the bridge',
  { skip },
  async (client: any, testName: string) => {
    await simpleBrowserTestCase(
      client,
      testName,
      'onStatusUpdate',
      'test-text',
      'red',
      'test-uuid',
      INPUT_METHOD.TOOLBAR,
    );
  },
);

BrowserTestCase(
  'editor: setting block type to heading fires an analytics event via the bridge',
  { skip },
  async (client: any, testName: string) => {
    await simpleBrowserTestCase(
      client,
      testName,
      'onBlockSelected',
      'heading1',
      INPUT_METHOD.TOOLBAR,
    );
  },
);

BrowserTestCase(
  'editor: inserting ordered list fires an analytics event via the bridge',
  { skip },
  async (client: any, testName: string) => {
    await simpleBrowserTestCase(
      client,
      testName,
      'onOrderedListSelected',
      INPUT_METHOD.TOOLBAR,
    );
  },
);

BrowserTestCase(
  'editor: inserting bullet list fires an analytics event via the bridge',
  { skip },
  async (client: any, testName: string) => {
    await simpleBrowserTestCase(
      client,
      testName,
      'onBulletListSelected',
      INPUT_METHOD.TOOLBAR,
    );
  },
);

BrowserTestCase(
  'editor: indenting list fires analytics events via the bridge',
  { skip },
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await callNativeBridgeFirst(
      browser,
      'onBulletListSelected',
      INPUT_METHOD.TOOLBAR,
    );
    await browser.type(editor.placeholder, 'lol');
    await browser.keys(['Enter']);
    await clearBridgeOutput(browser);
    await callNativeBridge(browser, 'onIndentList', INPUT_METHOD.TOOLBAR);
    await expectTrackEventsToMatchCustomSnapshot(browser, testName);
  },
);

BrowserTestCase(
  'editor: outdenting list fires analytics events via the bridge',
  { skip },
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await callNativeBridgeFirst(
      browser,
      'onBulletListSelected',
      INPUT_METHOD.TOOLBAR,
    );
    await clearBridgeOutput(browser);
    await callNativeBridge(browser, 'onOutdentList', INPUT_METHOD.TOOLBAR);
    await expectTrackEventsToMatchCustomSnapshot(browser, testName);
  },
);

BrowserTestCase(
  'editor: inserting link fires analytics events via the bridge',
  { skip },
  async (client: any, testName: string) => {
    await simpleBrowserTestCase(
      client,
      testName,
      'onLinkUpdate',
      'test-link-title',
      'https://test.link.url',
      INPUT_METHOD.TOOLBAR,
    );
  },
);

BrowserTestCase(
  'editor: inserting block quote fires an analytics event via the bridge',
  { skip },
  async (client: any, testName: string) => {
    await simpleBrowserTestCase(
      client,
      testName,
      'insertBlockType',
      'blockquote',
      INPUT_METHOD.INSERT_MENU,
    );
  },
);

BrowserTestCase(
  'editor: inserting code block fires an analytics event via the bridge',
  { skip },
  async (client: any, testName: string) => {
    await simpleBrowserTestCase(
      client,
      testName,
      'insertBlockType',
      'codeblock',
      INPUT_METHOD.INSERT_MENU,
    );
  },
);

BrowserTestCase(
  'editor: inserting panel fires an analytics event via the bridge',
  { skip },
  async (client: any, testName: string) => {
    await simpleBrowserTestCase(
      client,
      testName,
      'insertBlockType',
      'panel',
      INPUT_METHOD.INSERT_MENU,
    );
  },
);

BrowserTestCase(
  'editor: inserting action fires an analytics event via the bridge',
  { skip },
  async (client: any, testName: string) => {
    await simpleBrowserTestCase(
      client,
      testName,
      'insertBlockType',
      'action',
      INPUT_METHOD.INSERT_MENU,
      'test-action-list-id',
      'test-action-item-id',
    );
  },
);

BrowserTestCase(
  'editor: inserting decision fires an analytics event via the bridge',
  { skip },
  async (client: any, testName: string) => {
    await simpleBrowserTestCase(
      client,
      testName,
      'insertBlockType',
      'decision',
      INPUT_METHOD.INSERT_MENU,
      'test-decision-list-id',
      'test-decision-item-id',
    );
  },
);

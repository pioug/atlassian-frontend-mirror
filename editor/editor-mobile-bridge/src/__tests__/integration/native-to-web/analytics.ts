import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  callNativeBridge,
  clearBridgeOutput,
  clearEditor,
  editor,
  skipBrowsers as skip,
  getBridgeOutput,
} from '../_utils';

import { INPUT_METHOD, AnalyticsEventPayload } from '@atlaskit/editor-core';

const initPage = async (browser: Page) => {
  await browser.goto(editor.path);
  await browser.waitForSelector(editor.placeholder);
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
  browser: Page,
  testName: string,
  fnName: any,
  ...args: any[]
) => {
  await callNativeBridge(browser, fnName, ...args);
  await expectTrackEventsToMatchCustomSnapshot(browser, testName);
  await clearEditor(browser);
  await clearBridgeOutput(browser);
};

BrowserTestCase(
  'editor: ensure actions fire an analytics event via the bridge',
  { skip },
  async (client: any) => {
    const browser = new Page(client);
    await initPage(browser);

    await simpleBrowserTestCase(
      browser,
      'editor: toggling bold style fires an analytics event via the bridge',
      'onBoldClicked',
      INPUT_METHOD.TOOLBAR,
    );

    await simpleBrowserTestCase(
      browser,
      'editor: toggling italic style fires an analytics event via the bridge',
      'onItalicClicked',
      INPUT_METHOD.TOOLBAR,
    );

    await simpleBrowserTestCase(
      client,
      'editor: toggling underline style fires an analytics event via the bridge',
      'onUnderlineClicked',
      INPUT_METHOD.TOOLBAR,
    );

    await simpleBrowserTestCase(
      client,
      'editor: toggling code style fires an analytics event via the bridge',
      'onCodeClicked',
      INPUT_METHOD.TOOLBAR,
    );

    await simpleBrowserTestCase(
      client,
      'editor: toggling strike style fires an analytics event via the bridge',
      'onStrikeClicked',
      INPUT_METHOD.TOOLBAR,
    );

    await simpleBrowserTestCase(
      client,
      'editor: toggling superscript style fires an analytics event via the bridge',
      'onSuperClicked',
      INPUT_METHOD.TOOLBAR,
    );

    await simpleBrowserTestCase(
      client,
      'editor: toggling subscript style fires an analytics event via the bridge',
      'onSubClicked',
      INPUT_METHOD.TOOLBAR,
    );

    await simpleBrowserTestCase(
      client,
      'editor: updating status fires an analytics event via the bridge',
      'onStatusUpdate',
      'test-text',
      'red',
      'test-uuid',
      INPUT_METHOD.TOOLBAR,
    );

    await simpleBrowserTestCase(
      client,
      'editor: setting block type to heading fires an analytics event via the bridge',
      'onBlockSelected',
      'heading1',
      INPUT_METHOD.TOOLBAR,
    );

    await simpleBrowserTestCase(
      client,
      'editor: inserting ordered list fires an analytics event via the bridge',
      'onOrderedListSelected',
      INPUT_METHOD.TOOLBAR,
    );

    await simpleBrowserTestCase(
      client,
      'editor: inserting bullet list fires an analytics event via the bridge',
      'onBulletListSelected',
      INPUT_METHOD.TOOLBAR,
    );

    await callNativeBridge(
      browser,
      'onBulletListSelected',
      INPUT_METHOD.TOOLBAR,
    );
    await browser.type(editor.placeholder, 'lol');
    await browser.keys(['Enter']);
    await clearBridgeOutput(browser);
    await callNativeBridge(browser, 'onIndentList', INPUT_METHOD.TOOLBAR);
    await expectTrackEventsToMatchCustomSnapshot(
      browser,
      'editor: indenting list fires analytics events via the bridge',
    );
    await clearEditor(browser);
    await clearBridgeOutput(browser);

    await callNativeBridge(
      browser,
      'onBulletListSelected',
      INPUT_METHOD.TOOLBAR,
    );
    await clearBridgeOutput(browser);
    await callNativeBridge(browser, 'onOutdentList', INPUT_METHOD.TOOLBAR);
    await expectTrackEventsToMatchCustomSnapshot(
      browser,
      'editor: outdenting list fires analytics events via the bridge',
    );
    await clearEditor(browser);
    await clearBridgeOutput(browser);

    await simpleBrowserTestCase(
      client,
      'editor: inserting link fires analytics events via the bridge',
      'onLinkUpdate',
      'test-link-title',
      'https://test.link.url',
      INPUT_METHOD.TOOLBAR,
    );

    await simpleBrowserTestCase(
      client,
      'editor: inserting block quote fires an analytics event via the bridge',
      'insertBlockType',
      'blockquote',
      INPUT_METHOD.INSERT_MENU,
    );

    await simpleBrowserTestCase(
      client,
      'editor: inserting code block fires an analytics event via the bridge',
      'insertBlockType',
      'codeblock',
      INPUT_METHOD.INSERT_MENU,
    );

    await simpleBrowserTestCase(
      client,
      'editor: inserting panel fires an analytics event via the bridge',
      'insertBlockType',
      'panel',
      INPUT_METHOD.INSERT_MENU,
    );

    await simpleBrowserTestCase(
      client,
      'editor: inserting action fires an analytics event via the bridge',
      'insertBlockType',
      'action',
      INPUT_METHOD.INSERT_MENU,
      'test-action-list-id',
      'test-action-item-id',
    );

    await simpleBrowserTestCase(
      client,
      'editor: inserting decision fires an analytics event via the bridge',
      'insertBlockType',
      'decision',
      INPUT_METHOD.INSERT_MENU,
      'test-decision-list-id',
      'test-decision-item-id',
    );
  },
);

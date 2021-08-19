import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  callNativeBridge,
  clearBridgeOutput,
  clearEditor,
  editor,
  skipBrowsers,
  getBridgeOutput,
} from '../_utils';

import { INPUT_METHOD, AnalyticsEventPayload } from '@atlaskit/editor-core';

const initPage = async (browser: Page) => {
  await browser.goto(editor.path);
  await browser.waitForSelector(editor.placeholder);
};

const expectTrackEventsToMatchPayload = async (
  browser: any,
  payload: Record<string, string>,
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

  expect(trackEvents).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        ...payload,
        attributes: expect.objectContaining({
          appearance: 'mobile',
        }),
      }),
    ]),
  );
};

const validateAnalyticsTrackEventAfterNativeBridgeMethod = async (
  browser: Page,
  payloadExpected: Record<string, string>,
  fnName: any,
  ...args: any[]
) => {
  await callNativeBridge(browser, fnName, ...args);
  await expectTrackEventsToMatchPayload(browser, payloadExpected);
  await clearEditor(browser);
  await clearBridgeOutput(browser);
};

BrowserTestCase(
  'editor: ensure actions fire an analytics event via the bridge',
  { skip: skipBrowsers },
  async (client: any) => {
    const browser = new Page(client);
    await initPage(browser);

    await validateAnalyticsTrackEventAfterNativeBridgeMethod(
      browser,
      {
        action: 'formatted',
        actionSubject: 'text',
        actionSubjectId: 'strong',
      },
      'onBoldClicked',
      INPUT_METHOD.TOOLBAR,
    );

    await validateAnalyticsTrackEventAfterNativeBridgeMethod(
      browser,
      {
        action: 'formatted',
        actionSubject: 'text',
        actionSubjectId: 'italic',
      },
      'onItalicClicked',
      INPUT_METHOD.TOOLBAR,
    );

    await validateAnalyticsTrackEventAfterNativeBridgeMethod(
      client,
      {
        action: 'formatted',
        actionSubject: 'text',
        actionSubjectId: 'underline',
      },
      'onUnderlineClicked',
      INPUT_METHOD.TOOLBAR,
    );

    await validateAnalyticsTrackEventAfterNativeBridgeMethod(
      client,
      {
        action: 'formatted',
        actionSubject: 'text',
        actionSubjectId: 'code',
      },
      'onCodeClicked',
      INPUT_METHOD.TOOLBAR,
    );

    await validateAnalyticsTrackEventAfterNativeBridgeMethod(
      client,
      {
        action: 'formatted',
        actionSubject: 'text',
        actionSubjectId: 'strike',
      },
      'onStrikeClicked',
      INPUT_METHOD.TOOLBAR,
    );

    await validateAnalyticsTrackEventAfterNativeBridgeMethod(
      client,
      {
        action: 'formatted',
        actionSubject: 'text',
        actionSubjectId: 'superscript',
      },
      'onSuperClicked',
      INPUT_METHOD.TOOLBAR,
    );

    await validateAnalyticsTrackEventAfterNativeBridgeMethod(
      client,
      {
        action: 'formatted',
        actionSubject: 'text',
        actionSubjectId: 'subscript',
      },
      'onSubClicked',
      INPUT_METHOD.TOOLBAR,
    );

    await validateAnalyticsTrackEventAfterNativeBridgeMethod(
      client,
      {
        action: 'inserted',
        actionSubject: 'document',
        actionSubjectId: 'status',
      },
      'insertNode',
      'status',
    );

    await validateAnalyticsTrackEventAfterNativeBridgeMethod(
      client,
      {
        action: 'formatted',
        actionSubject: 'text',
        actionSubjectId: 'heading',
      },
      'onBlockSelected',
      'heading1',
      INPUT_METHOD.TOOLBAR,
    );

    await validateAnalyticsTrackEventAfterNativeBridgeMethod(
      client,
      {
        action: 'inserted',
        actionSubject: 'list',
        actionSubjectId: 'numberedList',
      },
      'onOrderedListSelected',
      INPUT_METHOD.TOOLBAR,
    );

    await validateAnalyticsTrackEventAfterNativeBridgeMethod(
      client,
      {
        action: 'inserted',
        actionSubject: 'list',
        actionSubjectId: 'bulletedList',
      },
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

    await validateAnalyticsTrackEventAfterNativeBridgeMethod(
      client,
      {
        action: 'indented',
        actionSubject: 'list',
        actionSubjectId: 'bulletedList',
      },
      'onIndentList',
      INPUT_METHOD.TOOLBAR,
    );

    await callNativeBridge(
      browser,
      'onBulletListSelected',
      INPUT_METHOD.TOOLBAR,
    );

    await validateAnalyticsTrackEventAfterNativeBridgeMethod(
      client,
      {
        action: 'outdented',
        actionSubject: 'list',
        actionSubjectId: 'bulletedList',
      },
      'onOutdentList',
      INPUT_METHOD.TOOLBAR,
    );

    await validateAnalyticsTrackEventAfterNativeBridgeMethod(
      client,
      {
        action: 'inserted',
        actionSubject: 'document',
        actionSubjectId: 'link',
      },
      'onLinkUpdate',
      'test-link-title',
      'https://test.link.url',
      INPUT_METHOD.TOOLBAR,
    );

    await validateAnalyticsTrackEventAfterNativeBridgeMethod(
      client,
      {
        action: 'formatted',
        actionSubject: 'text',
        actionSubjectId: 'blockQuote',
      },
      'insertBlockType',
      'blockquote',
      INPUT_METHOD.INSERT_MENU,
    );

    await validateAnalyticsTrackEventAfterNativeBridgeMethod(
      client,
      {
        action: 'inserted',
        actionSubject: 'document',
        actionSubjectId: 'codeBlock',
      },
      'insertBlockType',
      'codeblock',
      INPUT_METHOD.INSERT_MENU,
    );

    await validateAnalyticsTrackEventAfterNativeBridgeMethod(
      client,
      {
        action: 'inserted',
        actionSubject: 'document',
        actionSubjectId: 'panel',
      },
      'insertBlockType',
      'panel',
      INPUT_METHOD.INSERT_MENU,
    );

    await validateAnalyticsTrackEventAfterNativeBridgeMethod(
      client,
      {
        action: 'inserted',
        actionSubject: 'document',
        actionSubjectId: 'action',
      },
      'insertBlockType',
      'action',
      INPUT_METHOD.INSERT_MENU,
      'test-action-list-id',
      'test-action-item-id',
    );

    await validateAnalyticsTrackEventAfterNativeBridgeMethod(
      client,
      {
        action: 'inserted',
        actionSubject: 'document',
        actionSubjectId: 'decision',
      },
      'insertBlockType',
      'decision',
      INPUT_METHOD.INSERT_MENU,
      'test-decision-list-id',
      'test-decision-item-id',
    );
  },
);

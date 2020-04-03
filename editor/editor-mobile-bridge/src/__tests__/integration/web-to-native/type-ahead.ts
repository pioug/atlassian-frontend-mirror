import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  editor,
  editable,
  getBridgeOutput,
  navigateOrClear,
  skipBrowsers as skip,
} from '../_utils';

BrowserTestCase(
  `type-ahead.ts: Sends correct typing events`,
  { skip: skip.concat('safari') },
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await browser.goto(editor.path);
    await browser.waitForSelector(editable);

    await browser.type(editable, 'Some beautifully written words ');
    await browser.type(editable, '@idontexist');

    const typeAheadPayloads = await getBridgeOutput(
      browser,
      'typeAheadBridge',
      'typeAheadQuery',
    );

    expect(typeAheadPayloads).toMatchCustomSnapshot(testName);
  },
);

BrowserTestCase(
  `type-ahead.ts: Space sends dismiss type-ahead event.`,
  { skip },
  async (client: any) => {
    const browser = new Page(client);
    await navigateOrClear(browser, editor.path);
    await browser.waitForSelector(editable);

    // Space with no results dismisses typeahead
    await browser.type(editable, '@idontexist ');

    const typeAheadPayloads = await getBridgeOutput(
      browser,
      'typeAheadBridge',
      'dismissTypeAhead',
    );

    expect(typeAheadPayloads.length).toEqual(1);
  },
);

BrowserTestCase(
  `type-ahead.ts: Navigating away sends dismiss type-ahead event.`,
  // Safari has issues with key events
  { skip: skip.concat('safari') },
  async (client: any) => {
    const browser = new Page(client);
    await navigateOrClear(browser, editor.path);
    await browser.waitForSelector(editable);

    // Navigating cursor away from query mark should dismiss typeahead
    await browser.keys('Enter');
    await browser.type(editable, 'word @sg');
    await browser.keys(['ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft']);

    const typeAheadPayloads = await getBridgeOutput(
      browser,
      'typeAheadBridge',
      'dismissTypeAhead',
    );

    expect(typeAheadPayloads.length).toEqual(1);
  },
);

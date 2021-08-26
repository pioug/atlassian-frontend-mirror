import { Browser, BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { editor, editable, getBridgeOutput, navigateOrClear } from '../_utils';

// TODO: Unskipped type-ahead tests ED-13572
const skip: Browser[] = ['*'];

BrowserTestCase(
  `type-ahead.ts: Sends correct typing events`,
  { skip },
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await browser.goto(editor.path);
    await browser.waitForSelector(editable);
    await browser.click(editable);

    await browser.keys('Some beautifully written words @idontexist'.split(''));

    const typeAheadPayloads = await getBridgeOutput(
      browser,
      'typeAheadBridge',
      'typeAheadQuery',
    );

    expect(typeAheadPayloads).toMatchCustomSnapshot(testName);
  },
);

BrowserTestCase(
  `type-ahead.ts: Space should not sends dismiss type-ahead event.`,
  { skip },
  async (client: any) => {
    const browser = new Page(client);
    await navigateOrClear(browser, editor.path);
    await browser.waitForSelector(editable);
    await browser.click(editable);

    await browser.keys('@idontexist '.split(''));

    const typeAheadPayloads = await getBridgeOutput(
      browser,
      'typeAheadBridge',
      'dismissTypeAhead',
    );

    expect(typeAheadPayloads.length).toEqual(0);
  },
);

BrowserTestCase(
  `type-ahead.ts: Navigating away sends dismiss type-ahead event.`,
  { skip },
  async (client: any) => {
    const browser = new Page(client);
    await navigateOrClear(browser, editor.path);
    await browser.waitForSelector(editable);
    await browser.click(editable);

    // Navigating cursor away from query mark should dismiss typeahead
    await browser.keys('Enter');
    await browser.keys('word @sg'.split(''));
    await browser.keys(['ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft']);

    const typeAheadPayloads = await getBridgeOutput(
      browser,
      'typeAheadBridge',
      'dismissTypeAhead',
    );

    expect(typeAheadPayloads.length).toEqual(1);
  },
);

BrowserTestCase(
  `type-ahead.ts: /link opens link dialog window`,
  { skip },
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await browser.goto(editor.path);
    await browser.waitForSelector(editable);
    await browser.click(editable);

    await browser.keys('/link'.split(''));
    await browser.keys(['Enter']);

    const typeAheadPayloads = await getBridgeOutput(
      browser,
      'typeAheadBridge',
      'typeAheadItemSelected',
    );

    expect(typeAheadPayloads).toMatchCustomSnapshot(testName);
  },
);

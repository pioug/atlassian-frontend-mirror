import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

import {
  copyToClipboard,
  editable,
  getDocFromElement,
  gotoEditor,
  insertMentionUsingClick,
} from '../../../../__tests__/integration/_helpers';

export const loadActionButton = '[aria-label="Action item"]';

/*
 * Safari adds special characters that end up in the snapshot
 */
BrowserTestCase(
  'task-decision-2.ts: can paste rich text into an action',
  {},
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await copyToClipboard(
      browser,
      '<p>this is a link <a href="http://www.google.com">www.google.com</a></p><p>more elements with some <strong>format</strong></p><p>some addition<em> formatting</em></p>',
      'html',
    );
    await gotoEditor(browser);
    await browser.waitFor(editable);
    await browser.type(editable, '[] ');
    await browser.waitForSelector('div[data-node-type="actionList"]');
    await browser.paste();
    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'task-decision-2.ts: can paste plain text into an action',
  {},
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await copyToClipboard(
      browser,
      'this is a link http://www.google.com more elements with some **format** some addition *formatting*',
    );
    await gotoEditor(browser);
    await browser.waitFor(editable);
    await browser.type(editable, '[] ');
    await browser.waitForSelector('div[data-node-type="actionList"]');
    await browser.paste();
    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'task-decision-2.ts: can type into decision',
  {},
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await gotoEditor(browser);
    await browser.click(loadActionButton);
    await browser.waitForSelector(
      'div[data-node-type="actionList"] span + div',
    );
    await browser.click('div[data-node-type="actionList"] span + div');
    await browser.type(editable, 'adding action');
    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'task-decision-2.ts: can insert mention into an action using click',
  {},
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await gotoEditor(browser);
    await browser.waitFor(editable);
    await browser.type(editable, '[] ');
    await browser.waitForSelector('div[data-node-type="actionList"]');
    await insertMentionUsingClick(browser, '0');
    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

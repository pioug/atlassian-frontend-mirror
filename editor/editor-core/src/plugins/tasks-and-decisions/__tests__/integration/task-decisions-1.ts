import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

import {
  copyToClipboard,
  editable,
  getDocFromElement,
  gotoEditor,
  insertBlockMenuItem,
} from '../../../../__tests__/integration/_helpers';

/*
 * Safari adds special characters that end up in the snapshot
 */
BrowserTestCase(
  'task-decision-1.ts: can paste rich text into a decision',
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
    await browser.type(editable, '<> ');
    await browser.waitForSelector('ol');
    await browser.paste();
    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'task-decision-1.ts: can paste plain text into a decision',
  {},
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await copyToClipboard(
      browser,
      'this is a link http://www.google.com more elements with some **format** some addition *formatting*',
    );
    await gotoEditor(browser);
    await browser.waitFor(editable);
    await browser.type(editable, '<> ');
    await browser.waitForSelector('ol');
    await browser.paste();
    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'task-decision-1.ts: can type into decision',
  {},
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await gotoEditor(browser);
    await insertBlockMenuItem(browser, 'Decision');
    await browser.waitForSelector('ol span + div');
    await browser.click('ol span + div');
    await browser.type(editable, 'adding decisions');
    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

// FIXME: This test was automatically skipped due to failure on 8/23/2021: https://product-fabric.atlassian.net/browse/ED-13646
BrowserTestCase(
  `task-decision: Backspacing on second line of multi-line decision shouldnt remove list`,
  {
    skip: ['*'],
  },
  async (client: any, testName: string) => {
    const browser = new Page(client);

    await copyToClipboard(browser, '<p>Line 1<br/>L2</p>', 'html');
    await gotoEditor(browser);
    await browser.waitFor(editable);
    await browser.type(editable, '<> ');
    await browser.waitForSelector('ol');
    await browser.paste();

    await browser.keys(Array(2).fill('Backspace'));

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  `task-decision: Backspacing on second line of multi-line task shouldnt remove list`,
  {},
  async (client: any, testName: string) => {
    const browser = new Page(client);

    await copyToClipboard(browser, '<p>Line 1<br/>L2</p>', 'html');
    await gotoEditor(browser);
    await browser.waitFor(editable);
    await browser.type(editable, '[] ');
    await browser.waitForSelector('div[data-node-type="actionList"]');
    await browser.paste();

    await browser.keys(Array(2).fill('Backspace'));

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

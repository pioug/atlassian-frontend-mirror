import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

import {
  copyToClipboard,
  editable,
  getDocFromElement,
  gotoEditor,
  insertMentionUsingClick,
  insertBlockMenuItem,
} from '@atlaskit/editor-test-helpers/integration/helpers';

export const loadActionButton = '[aria-label="Action item"]';
const TYPE_AHEAD_MENU_LIST = `[aria-label="Popup"] [role="listbox"]`;

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
  // TODO: safari skipped due to flakines in pipelines - please fix
  { skip: ['safari'] },
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

BrowserTestCase(
  'task-decision-2.ts: joins actions regardless of insert method',
  {},
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await gotoEditor(browser);
    await browser.waitFor(editable);
    // Insert an action via menu
    await insertBlockMenuItem(browser, 'Action item', undefined, true);
    // Type 'a', press 'Enter' to create a new action below
    // Type 'Enter' again to remove a new action
    await browser.keys(['a', 'Enter', 'Enter']);
    // Insert an action via input rule
    await browser.type(editable, '[] ');
    await browser.waitForSelector('div[data-node-type="actionList"]');
    // Type 'b', press 'Enter' to create a new action below
    // Type 'Enter' again to remove a new action
    await browser.keys(['b', 'Enter', 'Enter']);
    // Insert an action via quickinsert/typeahead
    await browser.keys('/Action Item'.split(''));
    await browser.waitForVisible(TYPE_AHEAD_MENU_LIST);
    await browser.keys(['ArrowDown', 'Enter', 'c']);

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'task-decision-2.ts: inserts new action item via typeahead on the same level as the previous action item even when it was empty',
  {},
  async (client: any, testName: string) => {
    const browser = new Page(client);
    await gotoEditor(browser);
    await browser.waitFor(editable);
    // Create a non-empty action item
    await insertBlockMenuItem(browser, 'Action item', undefined, true);
    await browser.keys(['a', 'Space']);
    // Insert a new action via quickinsert when the cursor is inside of a non-empty action
    await browser.keys('/Action Item'.split(''));
    await browser.waitForVisible(TYPE_AHEAD_MENU_LIST);
    await browser.keys(['ArrowDown', 'Enter']);
    // Insert a new action via quickinsert when the cursor is inside of an empty action
    await browser.keys('/Action Item'.split(''));
    await browser.waitForVisible(TYPE_AHEAD_MENU_LIST);
    await browser.keys(['ArrowDown', 'Enter', 'c']);

    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

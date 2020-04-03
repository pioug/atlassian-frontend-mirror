import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  getDocFromElement,
  fullpage,
  editable,
  getProseMirrorPos,
  setProseMirrorTextSelection,
} from '../_helpers';
import {
  goToEditorTestingExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';
import { KEY } from '../../__helpers/page-objects/_keyboard';

import floatsAdf from './__fixtures__/lists-adjacent-floats.adf.json';
import listsAdf from './__fixtures__/lists-indentation-paragraphs.json';

const PM_FOCUS_SELECTOR = '.ProseMirror-focused';

async function insertList(
  page: any,
  modifierKey: string,
  list: 'number' | 'bullet',
) {
  const listKey = list === 'number' ? '7' : '8';
  await page.browser.keys([modifierKey, KEY.SHIFT, listKey]);
  await page.browser.keys([modifierKey, KEY.SHIFT]); // release modifier keys
  await page.type(editable, 'item');
  await page.browser.keys(['Enter', 'Enter']); // double enter to exit list
}

BrowserTestCase(
  `list: shouldn't change focus on tab if the list is not indentable`,
  { skip: ['ie', 'edge'] },
  async (client: any, testName: string) => {
    const page = new Page(client);
    await page.goto(fullpage.path);
    await page.waitForSelector(fullpage.placeholder);
    await page.click(fullpage.placeholder);

    // Investigate why string based input (without an array) fails in firefox
    // https://product-fabric.atlassian.net/browse/ED-7044
    await page.keys(['*', 'Space'], true);
    await page.type(editable, 'abc');
    await page.keys(['Return', 'Tab'], true);
    await page.type(editable, '123');
    await page.keys('Tab', true);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
    expect(await page.isExisting(PM_FOCUS_SELECTOR)).toBeTruthy();
  },
);

BrowserTestCase(
  'list: should be able to insert lists via keyboard shortcut (Windows)',
  { skip: ['ie', 'edge', 'safari', 'firefox'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, { appearance: 'full-page' });
    await page.click(editable);
    await insertList(page, KEY.CONTROL, 'number');
    await insertList(page, KEY.CONTROL, 'bullet');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'list: should be able to insert lists via keyboard shortcut (Mac)',
  { skip: ['ie', 'edge', 'chrome', 'firefox'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, { appearance: 'full-page' });
    await page.click(editable);
    await insertList(page, KEY.META, 'number');
    await insertList(page, KEY.META, 'bullet');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

/**
 * An example of what our page looks like
 * We use the arrow keys to navigate this list
 * In Firefox we want to ensure our cursor doesnt
 * jump outside the list on the first navigation
 * movement, but goes up and down the list as expected.
 *
 * +-----------------+   This is text
 * |                 |   1. One
 * |                 |     2. Two
 * |   float:left;   |       3. Three
 * |                 |     4. Four
 * |                 |   5. Five
 * +-----------------+
 */
BrowserTestCase(
  'list: should be able to navigate lists correctly in firefox',
  { skip: ['ie', 'edge', 'chrome', 'safari'] },
  async (client: any) => {
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, {
      appearance: 'full-page',
      media: {
        allowMediaSingle: true,
      },
      defaultValue: floatsAdf,
      shouldFocus: true,
    });

    // These loops navigate up and down the lists
    // We want to ensure we remain in the list.
    for (let i = 0; i < 11; i++) {
      await page.keys('ArrowDown');
    }

    for (let i = 0; i < 5; i++) {
      await page.keys('ArrowRight');
    }

    for (let i = 0; i < 3; i++) {
      await page.keys('ArrowUp');
    }

    const pos = await getProseMirrorPos(page);
    // Start of the word Six
    expect(pos).toEqual(217);
  },
);

//Will test cases for paragraphs and other list nodes when deleting at the end of a list
BrowserTestCase(
  'list: should handle delete correctly when at the end of a list',
  { skip: ['ie', 'edge', 'safari', 'firefox'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: listsAdf,
      shouldFocus: true,
    });

    //Delete before a list node on bullet list
    await setProseMirrorTextSelection(page, { anchor: 10, head: 10 });
    await page.keys('Delete');
    //Should append next list element to current selection

    //Delete before empty paragraph and paragraph with text on bullet list
    await setProseMirrorTextSelection(page, { anchor: 65, head: 65 });
    await page.keys('Delete');
    await page.keys('Delete');
    //Should remove empty paragraph and append paragraph with content to current selection

    //Delete before a list node on numbered list
    await setProseMirrorTextSelection(page, { anchor: 85, head: 85 });
    await page.keys('Delete');
    //Should append next list element to current selection

    //Delete before empty paragraph and paragraph with text on numbered list
    await setProseMirrorTextSelection(page, { anchor: 140, head: 140 });
    await page.keys('Delete');
    await page.keys('Delete');
    //Should remove empty paragraph and append paragraph with content to current selection

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

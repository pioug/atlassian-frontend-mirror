import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import {
  getDocFromElement,
  fullpage,
  editable,
  getProseMirrorPos,
  setProseMirrorTextSelection,
} from '../../../../__tests__/integration/_helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../../../__tests__/__helpers/testing-example-helpers';
import { KEY } from '../../../../__tests__/__helpers/page-objects/_keyboard';

import floatsAdf from './__fixtures__/lists-adjacent-floats.adf.json';
import listsAdf from './__fixtures__/lists-indentation-paragraphs.json';
import sampleSchema from '@atlaskit/editor-test-helpers/schema';
import { Node } from 'prosemirror-model';

const PM_FOCUS_SELECTOR = '.ProseMirror-focused';

async function insertList(
  page: Page,
  modifierKey: string,
  list: 'number' | 'bullet',
) {
  const listKey = list === 'number' ? '7' : '8';
  await page.keys([modifierKey, KEY.SHIFT, listKey], true);
  await page.keys([modifierKey, KEY.SHIFT], true); // release modifier keys
  await page.type(editable, 'item');
  await page.keys(['Enter', 'Enter']); // double enter to exit list
}

BrowserTestCase(
  `list: shouldn't change focus on tab if the list is not indentable`,
  { skip: ['edge'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: 'full-page',
    });
    await page.click(editable);

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
  { skip: ['edge', 'safari', 'firefox'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: 'full-page',
    });
    await page.click(editable);
    await insertList(page, KEY.CONTROL, 'number');
    await insertList(page, KEY.CONTROL, 'bullet');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'list: should be able to insert lists via keyboard shortcut (Mac)',
  { skip: ['edge', 'chrome', 'firefox'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: 'full-page',
    });
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
  { skip: ['edge', 'chrome', 'safari'] },
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);
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

//Will test cases for paragraphs and other list nodes when backspacing at the start of a list
//Cases below refer to the cases found in this document: https://product-fabric.atlassian.net/wiki/spaces/E/pages/1146954996/List+Backspace+and+Delete+Behaviour
BrowserTestCase(
  'list: should handle backspace correctly when at the start of a list',
  { skip: ['edge', 'safari', 'firefox'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: listsAdf,
      shouldFocus: true,
    });

    //Case 2 with indented child
    await setProseMirrorTextSelection(page, { anchor: 14, head: 14 });
    await page.keys('Backspace');

    //Case 4 with outdented child
    await setProseMirrorTextSelection(page, { anchor: 45, head: 45 });
    await page.keys('Backspace');

    //Case 4 with double nested previous listItem
    await setProseMirrorTextSelection(page, { anchor: 54, head: 54 });
    await page.keys('Backspace');

    //Case 3 with indented child
    await setProseMirrorTextSelection(page, { anchor: 21, head: 21 });
    await page.keys('Backspace');

    //Case 3 with no children
    await setProseMirrorTextSelection(page, { anchor: 28, head: 28 });
    await page.keys('Backspace');

    //Case 1 with paragraphs with and without content
    await setProseMirrorTextSelection(page, { anchor: 49, head: 49 });
    await page.keys('Backspace');
    await setProseMirrorTextSelection(page, { anchor: 49, head: 49 });
    await page.keys('Backspace');

    //Case 2 with indented child
    await setProseMirrorTextSelection(page, { anchor: 69, head: 69 });
    await page.keys('Backspace');

    //Case 4 with outdented child
    await setProseMirrorTextSelection(page, { anchor: 100, head: 100 });
    await page.keys('Backspace');

    //Case 4 with double nested previous listItem
    await setProseMirrorTextSelection(page, { anchor: 109, head: 109 });
    await page.keys('Backspace');

    //Case 3 with indented child
    await setProseMirrorTextSelection(page, { anchor: 76, head: 76 });
    await page.keys('Backspace');

    //Case 3 with no children
    await setProseMirrorTextSelection(page, { anchor: 83, head: 83 });
    await page.keys('Backspace');

    //Case 1 with paragraphs with and without content
    await setProseMirrorTextSelection(page, { anchor: 104, head: 104 });
    await page.keys('Backspace');
    await setProseMirrorTextSelection(page, { anchor: 104, head: 104 });
    await page.keys('Backspace');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

//Will test cases for paragraphs and other list nodes when deleting at the end of a list
BrowserTestCase(
  'list: should handle delete correctly when at the end of a list',
  { skip: ['edge', 'safari', 'firefox'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: listsAdf,
      shouldFocus: true,
    });

    //Case 2 with indented child
    await setProseMirrorTextSelection(page, { anchor: 10, head: 10 });
    await page.keys('Delete');

    //Case 4 with outdented child
    await setProseMirrorTextSelection(page, { anchor: 39, head: 39 });
    await page.keys('Delete');

    //Case 4 with double nested previous listItem
    await setProseMirrorTextSelection(page, { anchor: 46, head: 46 });
    await page.keys('Delete');

    //Case 3 with indented child
    await setProseMirrorTextSelection(page, { anchor: 17, head: 17 });
    await page.keys('Delete');

    //Case 3 with no children
    await setProseMirrorTextSelection(page, { anchor: 24, head: 24 });
    await page.keys('Delete');

    //Case 1 with paragraphs with and without content
    await setProseMirrorTextSelection(page, { anchor: 45, head: 45 });
    await page.keys('Delete');
    await page.keys('Delete');

    //Case 2 with indented child
    await setProseMirrorTextSelection(page, { anchor: 65, head: 65 });
    await page.keys('Delete');

    //Case 4 with outdented child
    await setProseMirrorTextSelection(page, { anchor: 94, head: 94 });
    await page.keys('Delete');

    //Case 4 with double nested previous listItem
    await setProseMirrorTextSelection(page, { anchor: 101, head: 101 });
    await page.keys('Delete');

    //Case 3 with indented child
    await setProseMirrorTextSelection(page, { anchor: 72, head: 72 });
    await page.keys('Delete');

    //Case 3 with no children
    await setProseMirrorTextSelection(page, { anchor: 79, head: 79 });
    await page.keys('Delete');

    //Case 1 with paragraphs with and without content
    await setProseMirrorTextSelection(page, { anchor: 100, head: 100 });
    await page.keys('Delete');
    await page.keys('Delete');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'list: ctrl-d shortcut should behave the same as delete key (Mac)',
  { skip: ['edge', 'chrome', 'firefox'] },
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: listsAdf,
      shouldFocus: true,
    });
    await setProseMirrorTextSelection(page, { anchor: 11, head: 11 });
    // Use unicode keys for Control & d
    await page.keys('\uE009\u0064');

    const jsonDocument = await page.$eval(editable, getDocFromElement);
    const pmDocument = Node.fromJSON(sampleSchema, jsonDocument);
    const firstListItem = pmDocument.nodeAt(3);
    const textContentFirstListItem = firstListItem!.textContent;
    expect(textContentFirstListItem).toEqual('wefwef1wefwef2');
  },
);

BrowserTestCase(
  'list: ctrl-d shortcut should not change editable content (Windows)',
  { skip: ['edge', 'safari', 'firefox'] },
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: listsAdf,
      shouldFocus: true,
    });
    await setProseMirrorTextSelection(page, { anchor: 11, head: 11 });
    // Use unicode keys for Control & d
    await page.keys('\uE009\u0064');

    const jsonDocument = await page.$eval(editable, getDocFromElement);
    const pmDocument = Node.fromJSON(sampleSchema, jsonDocument);
    const firstListItem = pmDocument.nodeAt(3);
    const textContentFirstListItem = firstListItem!.textContent;
    expect(textContentFirstListItem).toEqual('wefwef1');
  },
);

import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  fullpage,
  getDocFromElement,
} from '@atlaskit/editor-test-helpers/integration/helpers';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  mountEditor,
  goToEditorTestingWDExample,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import type Page from '@atlaskit/webdriver-runner/wd-wrapper';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { KEY } from '@atlaskit/editor-test-helpers/page-objects/keyboard';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { selectors } from '@atlaskit/editor-test-helpers/page-objects/editor';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { runEscapeKeydownSuite } from '@atlaskit/editor-test-helpers/integration/escape-keydown';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  clickToolbarMenu,
  ToolbarMenuItem,
} from '@atlaskit/editor-test-helpers/page-objects/toolbar';

const editorSelector = selectors.editor;

const insertHeadings = async (page: Page, modifierKeys: string[]) => {
  await page.click(editorSelector);

  for (let i = 1; i <= 6; i++) {
    await page.keys([...modifierKeys, `${i}`], true);
    await page.keys(modifierKeys, true); // release modifier keys
    await page.type(editorSelector, 'A');
    await page.keys(['Enter']);
  }
};

BrowserTestCase(
  'format.ts: user should be able to create link using markdown',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, { appearance: 'full-page' });
    await page.type(editorSelector, '[link](https://hello.com)');
    await page.pause(100);

    await page.waitForSelector('a');
    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'format.ts: user should be able to format bold, italics and strikethrough with markdown',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, { appearance: 'full-page' });
    await page.click(fullpage.placeholder);
    const markdown =
      '__bold__ _italics_ **starbold** *staritalics* ~~strikethrough~~';
    // Investigate why string based input (without an array) fails in firefox
    // https://product-fabric.atlassian.net/browse/ED-7044
    const input = markdown.split('');
    await page.keys(input);
    await page.pause(100);

    await page.waitForSelector('strong');
    await page.waitForSelector('em');
    await page.waitForSelector('s');
    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'format.ts: user should be able to write inline code',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, { appearance: 'full-page' });
    await page.type(editorSelector, '`');
    await page.type(editorSelector, 'this');
    await page.type(editorSelector, '`');

    await page.waitForSelector('span.code');
    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'format.ts: should be able to use keyboard shortcuts to set headings (Windows)',
  { skip: ['safari'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, { appearance: 'full-page' });
    await insertHeadings(page, [KEY.CONTROL, KEY.ALT]);

    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'format.ts: should be able to use keyboard shortcuts to set headings (Mac)',
  { skip: ['chrome', 'firefox'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, { appearance: 'full-page' });
    await insertHeadings(page, [KEY.META, KEY.ALT]);

    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

runEscapeKeydownSuite({
  openMenu: async (page) => {
    await clickToolbarMenu(page, ToolbarMenuItem.moreFormatting);
  },
});

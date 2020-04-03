import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { fullpage, getDocFromElement } from '../_helpers';
import {
  mountEditor,
  goToEditorTestingExample,
} from '../../__helpers/testing-example-helpers';
import Page from '@atlaskit/webdriver-runner/wd-wrapper';
import { KEY } from '../../__helpers/page-objects/_keyboard';

const editorSelector = '.ProseMirror';

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
  { skip: ['edge', 'ie'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, { appearance: 'full-page' });
    await page.type(editorSelector, '[link](https://hello.com)');
    await page.pause(100);

    await page.waitForSelector('a');
    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'format.ts: user should be able to format bold and italics with markdown',
  { skip: ['edge', 'ie'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, { appearance: 'full-page' });
    await page.click(fullpage.placeholder);
    const markdown = '__bold__ _italics_ **starbold** *staritalics*';
    // // Investigate why string based input (without an array) fails in firefox
    // // https://product-fabric.atlassian.net/browse/ED-7044
    const input = markdown.split('');
    await page.keys(input);
    await page.pause(100);

    await page.waitForSelector('strong');
    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'format.ts: user should be able to write inline code',
  { skip: ['edge', 'ie'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);
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
  { skip: ['safari', 'ie', 'edge'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, { appearance: 'full-page' });
    await insertHeadings(page, [KEY.CONTROL, KEY.ALT]);

    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'format.ts: should be able to use keyboard shortcuts to set headings (Mac)',
  { skip: ['chrome', 'firefox', 'edge', 'ie'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, { appearance: 'full-page' });
    await insertHeadings(page, [KEY.META, KEY.ALT]);

    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

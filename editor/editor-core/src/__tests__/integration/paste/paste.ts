import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { getDocFromElement, fullpage } from '../_helpers';
import {
  goToEditorTestingExample,
  mountEditor,
  copyAsPlainText,
  copyAsHTML,
} from '../../__helpers/testing-example-helpers';

const editorSelector = '.ProseMirror';
BrowserTestCase(
  'paste.ts: paste tests on fullpage editor: plain text',
  { skip: ['edge', 'ie', 'safari'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);

    await copyAsPlainText(page, 'This text is plain.');

    await mountEditor(page, {
      appearance: fullpage.appearance,
    });
    await page.click(fullpage.placeholder);
    await page.paste();

    await page.waitForSelector('p');
    const doc = await page.$eval(editorSelector, getDocFromElement);

    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'paste.ts: paste tests on fullpage editor: text formatting',
  { skip: ['edge', 'ie', 'safari'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);

    const testData =
      '<strong>bold </strong><em><strong>italics and bold </strong>some italics only </em><span class="code" style="font-family: monospace; white-space: pre-wrap;">add some code to this </span><u>underline this text</u><s> strikethrough </s><span style="color: rgb(0, 184, 217);">blue is my fav color</span> <a href="http://www.google.com">www.google.com</a>';

    await copyAsHTML(page, testData);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowTextColor: true,
    });

    await page.click(fullpage.placeholder);
    await page.paste();
    await page.waitForSelector('strong');
    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'paste.ts: paste tests on fullpage editor: bullet list',
  { skip: ['edge', 'ie', 'safari'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);

    const data =
      '<ul><li><p>list ele 1</p></li><li><p>list ele 2</p><ul><li><p>more ele 1</p></li><li><p>more ele 2</p></li></ul></li><li><p>this is the last ele</p></li></ul>';
    await copyAsHTML(page, data);

    await mountEditor(page, {
      appearance: fullpage.appearance,
    });

    await page.click(fullpage.placeholder);
    await page.paste();

    await page.waitForSelector('ul');
    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'paste.ts: paste tests on fullpage editor: ordered list',
  { skip: ['edge', 'ie', 'safari'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);

    const data =
      '<ol><li><p>this is ele1</p></li><li><p>this is a link <a href="http://www.google.com">www.google.com</a></p><ol><li><p>more elements with some <strong>format</strong></p></li><li><p>some addition<em> formatting</em></p></li></ol></li><li><p>last element</p></li></ol>';
    await copyAsHTML(page, data);

    await mountEditor(page, {
      appearance: fullpage.appearance,
    });

    await page.click(fullpage.placeholder);
    await page.paste();

    await page.waitForSelector('p');
    const doc = await page.$eval(editorSelector, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

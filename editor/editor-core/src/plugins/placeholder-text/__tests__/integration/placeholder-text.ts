import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import {
  editable,
  getDocFromElement,
  fullpage,
  insertBlockMenuItem,
  copyAsHTML,
  gotoEditor,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import placeholderAdf from './__fixtures__/placeholder.adf.json';

const placeholderInputSelector = 'input[placeholder="Add placeholder text"]';
const placeholderNodeSelector = '[data-placeholder]';

BrowserTestCase(
  'placeholder text: can insert placeholder',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowTemplatePlaceholders: {
        allowInserting: true,
      },
    });

    await page.click(fullpage.placeholder);
    await insertBlockMenuItem(page, 'Placeholder text');

    await page.type(placeholderInputSelector, 'Fill this in...');
    await page.keys(['Enter']);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'placeholder text: can type inside placeholder and replace with text',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowTemplatePlaceholders: {
        allowInserting: true,
      },
      defaultValue: placeholderAdf,
    });

    await page.click(placeholderNodeSelector);
    await page.type(fullpage.placeholder, 'This is my text');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'placeholder text: can replace with pasted inline node',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await copyAsHTML(
      page,
      `<meta charset='utf-8'><p data-pm-slice="1 1 []">test<span data-node-type="status" data-color="neutral" data-local-id="cd5fe1cb-6828-4d85-b483-ee8fba47b3d3" data-style="" contenteditable="false">test</span></p>`,
    );

    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowTemplatePlaceholders: {
        allowInserting: true,
      },
      defaultValue: placeholderAdf,
    });

    await gotoEditor(page);
    await page.click(placeholderNodeSelector);
    await page.paste();
    await page.waitForSelector('.statusView-content-wrap');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

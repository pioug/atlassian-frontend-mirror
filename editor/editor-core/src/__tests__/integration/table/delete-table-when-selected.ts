import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import {
  editable,
  getDocFromElement,
  fullpage,
  clipboardInput,
  copyAsPlaintextButton,
  copyAsHTMLButton,
} from '../_helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';
import {
  tableSelectors,
  clickFirstCell,
  waitForNoTable,
} from '../../__helpers/page-objects/_table';

import basicTableAdf from './__fixtures__/basic-table';

BrowserTestCase(
  'replaces table with text when user types with a full-table cell selection',
  { skip: ['edge'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowTables: {
        advanced: true,
      },
      defaultValue: basicTableAdf,
    });

    await clickFirstCell(page);
    await page.click(tableSelectors.cornerButton);
    await page.keys('A');

    await waitForNoTable(page);
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'replaces table with content when user pastes plain text with a full-table cell selection',
  { skip: ['edge', 'safari'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await page.waitFor(clipboardInput);
    await page.type(clipboardInput, 'Some text to copy');
    await page.click(copyAsPlaintextButton);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowTables: {
        advanced: true,
      },
      defaultValue: basicTableAdf,
    });

    await clickFirstCell(page);
    await page.click(tableSelectors.cornerButton);
    await page.paste();

    await waitForNoTable(page);
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'replaces table with content when user pastes rich text with a full-table cell selection',
  { skip: ['edge', 'safari'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await page.waitFor(clipboardInput);
    await page.type(
      clipboardInput,
      '<p>this is a link <a href="http://www.google.com">www.google.com</a></p><p>more elements with some <strong>format</strong></p><p>some addition<em> formatting</em></p>',
    );
    await page.click(copyAsHTMLButton);

    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowTables: {
        advanced: true,
      },
      defaultValue: basicTableAdf,
    });

    await clickFirstCell(page);
    await page.click(tableSelectors.cornerButton);
    await page.paste();

    await waitForNoTable(page);
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

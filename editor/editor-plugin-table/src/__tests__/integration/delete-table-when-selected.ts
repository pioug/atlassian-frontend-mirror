// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  clipboardInput,
  copyAsHTMLButton,
  copyAsPlaintextButton,
  editable,
  fullpage,
  getDocFromElement,
} from '@atlaskit/editor-test-helpers/integration/helpers';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  clickFirstCell,
  tableSelectors,
  waitForNoTable,
} from '@atlaskit/editor-test-helpers/page-objects/table';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import basicTableAdf from './__fixtures__/basic-table';

BrowserTestCase(
  'replaces table with text when user types with a full-table cell selection',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(
      client,
      'editor-plugin-table',
    );
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
  { skip: [] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(
      client,
      'editor-plugin-table',
    );
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
  { skip: [] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(
      client,
      'editor-plugin-table',
    );
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

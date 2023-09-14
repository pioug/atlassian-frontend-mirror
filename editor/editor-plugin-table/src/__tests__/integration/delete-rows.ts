import { createIntl } from 'react-intl-next';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  editable,
  fullpage,
  getDocFromElement,
} from '@atlaskit/editor-test-helpers/integration/helpers';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { deleteRow } from '@atlaskit/editor-test-helpers/page-objects/table';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import { TableCssClassName as ClassName } from '../../plugins/table/types';
import messages from '../../plugins/table/ui/messages';

import { documentWithMergedCells } from './__fixtures__/merged-rows-and-cols-document';
import { nestedInExtension } from './__fixtures__/nested-in-extension';

BrowserTestCase(
  'Should delete merged rows from contextual menu and append missing cells to the table',
  { skip: ['firefox', 'safari'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(
      client,
      'editor-plugin-table',
    );
    const intl = createIntl({
      locale: 'en',
    });

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(documentWithMergedCells),
      allowTables: {
        advanced: true,
      },
    });

    const controlSelector = `tbody tr:nth-child(2) td:first-child`;
    await page.waitForSelector(controlSelector);
    await page.click(controlSelector);

    const contextMenuTriggerSelector = `.${ClassName.CONTEXTUAL_MENU_BUTTON}`;
    await page.waitForSelector(contextMenuTriggerSelector);
    await page.click(contextMenuTriggerSelector);

    const message = await intl.formatMessage(messages.removeRows, {
      0: 1,
    });
    const contextMenuItemSelector = `span=${message}`;
    await page.waitForSelector(contextMenuItemSelector);
    await page.click(contextMenuItemSelector);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'Should delete merged rows from contextual menu and decrement rowspan of the spanning cell',
  { skip: ['firefox', 'safari'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(
      client,
      'editor-plugin-table',
    );
    const intl = createIntl({
      locale: 'en',
    });

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(documentWithMergedCells),
      allowTables: {
        advanced: true,
      },
    });

    const controlSelector = `tbody tr:nth-child(3) td:first-child`;
    await page.waitForSelector(controlSelector);
    await page.click(controlSelector);

    const contextMenuTriggerSelector = `.${ClassName.CONTEXTUAL_MENU_BUTTON}`;
    await page.waitForSelector(contextMenuTriggerSelector);
    await page.click(contextMenuTriggerSelector);

    const message = await intl.formatMessage(messages.removeRows, {
      0: 1,
    });
    const contextMenuItemSelector = `span=${message}`;
    await page.waitForSelector(contextMenuItemSelector);
    await page.click(contextMenuItemSelector);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'Should delete a row when table is nested inside bodied extension',
  { skip: ['firefox', 'safari'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(
      client,
      'editor-plugin-table',
    );

    await mountEditor(page, {
      appearance: fullpage.appearance,
      defaultValue: JSON.stringify(nestedInExtension),
      allowTables: {
        advanced: true,
      },
      allowExtension: true,
    });

    await deleteRow(page, 1);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

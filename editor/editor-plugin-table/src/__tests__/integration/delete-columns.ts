import { createIntl } from 'react-intl-next';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  editable,
  fullpage,
  getDocFromElement,
} from '@atlaskit/editor-test-helpers/integration/helpers';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import { TableCssClassName as ClassName } from '../../plugins/table/types';
import messages from '../../plugins/table/ui/messages';

import { documentWithMergedCells } from './__fixtures__/merged-rows-and-cols-document';

BrowserTestCase(
  'Should delete merged columns from contextual menu and append missing cells to the table',
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

    const controlSelector = `tbody tr:first-child th:nth-child(2)`;
    await page.waitForSelector(controlSelector);
    await page.click(controlSelector);

    const contextMenuTriggerSelector = `.${ClassName.CONTEXTUAL_MENU_BUTTON}`;
    await page.waitForSelector(contextMenuTriggerSelector);
    await page.click(contextMenuTriggerSelector);

    const message = await intl.formatMessage(messages.removeColumns, {
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
  'Should delete merged columns from contextual menu and decrement colspan of the spanning cell',
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

    const controlSelector = `tbody tr:first-child th:nth-child(3)`;
    await page.waitForSelector(controlSelector);
    await page.click(controlSelector);

    const contextMenuTriggerSelector = `.${ClassName.CONTEXTUAL_MENU_BUTTON}`;
    await page.waitForSelector(contextMenuTriggerSelector);
    await page.click(contextMenuTriggerSelector);

    const message = await intl.formatMessage(messages.removeColumns, {
      0: 1,
    });
    const contextMenuItemSelector = `span=${message}`;
    await page.waitForSelector(contextMenuItemSelector);
    await page.click(contextMenuItemSelector);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

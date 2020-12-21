import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import {
  editable,
  getDocFromElement,
  fullpage,
  quickInsert,
} from '../_helpers';
import {
  mountEditor,
  goToEditorTestingWDExample,
} from '../../__helpers/testing-example-helpers';
import { selectors } from './_utils';
import { messages as insertBlockMessages } from '../../../plugins/insert-block/ui/ToolbarInsertBlock/messages';

BrowserTestCase(
  'inside-table.ts: Insert panel into table, add text, change panel type',
  { skip: ['edge'] },
  async (client: any, testName: string) => {
    const insertTableMenu = `[aria-label="${insertBlockMessages.table.defaultMessage}"]`;
    const tableControls = '[aria-label="Table floating controls"]';

    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowPanel: true,
      allowTables: {
        advanced: true,
      },
    });

    await page.click(editable);
    await page.click(insertTableMenu);
    await page.waitForSelector(tableControls);

    await quickInsert(page, 'Info panel');
    await page.waitForSelector(selectors.PANEL_EDITOR_CONTAINER);

    // type some text
    await page.type(editable, 'this text should be in the panel');

    // click on Error label
    const selector = `[aria-label="Error"]`;
    await page.click(selector);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
    expect(await page.isExisting(tableControls)).toBe(false);
  },
);

import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import {
  editable,
  getDocFromElement,
  fullpage,
  quickInsert,
  insertBlockMenuItem,
} from '../_helpers';
import {
  mountEditor,
  goToEditorTestingWDExample,
} from '../../__helpers/testing-example-helpers';

const calendar = '[aria-label="calendar"]';
const nextDate = 'button[aria-selected=true] + button';

BrowserTestCase(
  'change-date-inside-table.ts: Change date inside table',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowDate: true,
      allowTables: {
        advanced: true,
      },
    });

    await page.click(editable);

    // Insert table
    await quickInsert(page, 'Table');
    // Insert Date
    await insertBlockMenuItem(page, 'Date');
    expect(await page.isExisting(calendar)).toBe(true);

    await page.click(nextDate);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

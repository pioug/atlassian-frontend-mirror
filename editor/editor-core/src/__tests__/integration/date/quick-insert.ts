import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { editable, quickInsert, getDocFromElement } from '../_helpers';
import {
  goToEditorTestingExample,
  mountEditor,
  loadLocale,
} from '../../__helpers/testing-example-helpers';

const dateLozenge = 'span[timestamp]';

BrowserTestCase(
  'quick-insert.ts: Insert date via quick insert',
  { skip: ['firefox', 'edge', 'ie'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);

    const JAN_1ST_2019_AEST_TIMEZONE = {
      year: 2019,
      monthIndex: 0,
      day: 1,
      hour: 0,
      minute: 0,
      tz: 11,
    };
    const teardownMockDate = page.mockDate(JAN_1ST_2019_AEST_TIMEZONE);
    // 1st Jan 2019 00:00 AEST / 31st Dec 2018 13:00 UTC

    await mountEditor(page, {
      appearance: 'full-page',
      allowDate: true,
    });

    await page.click(editable);

    await quickInsert(page, 'Date');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);

    teardownMockDate();
  },
);

BrowserTestCase(
  "quick-insert.ts: Uses today's date in user's local timezone as initial selection",
  { skip: ['firefox', 'edge', 'ie', 'safari'] },
  async (client: any) => {
    const page = await goToEditorTestingExample(client);

    const JAN_1ST_2019_AEST_TIMEZONE = {
      year: 2019,
      monthIndex: 0,
      day: 1,
      hour: 0,
      minute: 0,
      tz: 11,
    };
    const teardownMockDate = page.mockDate(JAN_1ST_2019_AEST_TIMEZONE);
    // 1st Jan 2019 00:00 AEST / 31st Dec 2018 13:00 UTC

    await mountEditor(page, {
      appearance: 'full-page',
      allowDate: true,
    });

    await page.click(editable);
    await quickInsert(page, 'Date');

    expect(await page.getText(dateLozenge)).toBe('Jan 1, 2019');
    teardownMockDate();
  },
);

BrowserTestCase(
  'quick-insert.ts: format date to localized version',
  { skip: ['firefox', 'edge', 'ie', 'safari'] },
  async (client: any) => {
    const page = await goToEditorTestingExample(client);
    await loadLocale(page, ['pt', 'es']);

    const JAN_1ST_2019_AEST_TIMEZONE = {
      year: 2019,
      monthIndex: 0,
      day: 1,
      hour: 0,
      minute: 0,
      tz: 11,
    };
    const teardownMockDate = page.mockDate(JAN_1ST_2019_AEST_TIMEZONE);
    // 1st Jan 2019 00:00 AEST / 31st Dec 2018 13:00 UTC

    await mountEditor(
      page,
      {
        appearance: 'full-page',
        allowDate: true,
      },
      { i18n: { locale: 'pt' } },
    );

    await page.click(editable);
    await quickInsert(page, 'Date');

    expect(await page.getText(dateLozenge)).toBe('1 de jan. de 2019');

    await mountEditor(
      page,
      {
        appearance: 'full-page',
        allowDate: true,
      },
      { i18n: { locale: 'es' } },
    );

    await page.click(editable);
    await quickInsert(page, 'Date');
    expect(await page.getText(dateLozenge)).toBe('1 ene. 2019');

    teardownMockDate();
  },
);

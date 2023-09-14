import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  editable,
  quickInsert,
  getDocFromElement,
} from '@atlaskit/editor-test-helpers/integration/helpers';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { stripZeroWidthSpaces } from '@atlaskit/editor-test-helpers/e2e-helpers';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { dateSelectors } from '@atlaskit/editor-test-helpers/page-objects/date';

const { dateLozenge } = dateSelectors;

BrowserTestCase(
  'quick-insert.ts: Insert date via quick insert',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    const JAN_1ST_2019_AEST_TIMEZONE = {
      year: 2019,
      monthIndex: 0,
      day: 1,
      hour: 0,
      minute: 0,
      tz: 11,
    };
    await page.mockDate(JAN_1ST_2019_AEST_TIMEZONE);
    // 1st Jan 2019 00:00 AEST / 31st Dec 2018 13:00 UTC

    await mountEditor(page, {
      appearance: 'full-page',
      allowDate: true,
    });

    await page.click(editable);

    await quickInsert(page, 'Date');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
    await page.teardownMockDate();
  },
);

BrowserTestCase(
  "quick-insert.ts: Uses today's date in user's local timezone as initial selection",
  {},
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);

    const JAN_1ST_2019_AEST_TIMEZONE = {
      year: 2019,
      monthIndex: 0,
      day: 1,
      hour: 0,
      minute: 0,
      tz: 11,
    };
    await page.mockDate(JAN_1ST_2019_AEST_TIMEZONE);
    // 1st Jan 2019 00:00 AEST / 31st Dec 2018 13:00 UTC

    await mountEditor(page, {
      appearance: 'full-page',
      allowDate: true,
    });

    await page.click(editable);
    await quickInsert(page, 'Date');

    expect(stripZeroWidthSpaces(await page.getText(dateLozenge))).toBe(
      'Jan 1, 2019',
    );
    await page.teardownMockDate();
  },
);

BrowserTestCase(
  'quick-insert.ts: format date to localized version',
  {},
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);

    const JAN_1ST_2019_AEST_TIMEZONE = {
      year: 2019,
      monthIndex: 0,
      day: 1,
      hour: 0,
      minute: 0,
      tz: 11,
    };
    await page.mockDate(JAN_1ST_2019_AEST_TIMEZONE);
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

    const lozengeText = stripZeroWidthSpaces(await page.getText(dateLozenge));

    expect(lozengeText).toBe('1 de jan. de 2019');

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

    const lozengeText2 = stripZeroWidthSpaces(await page.getText(dateLozenge));
    expect(lozengeText2).toBe('1 ene 2019');
    await page.teardownMockDate();
  },
);

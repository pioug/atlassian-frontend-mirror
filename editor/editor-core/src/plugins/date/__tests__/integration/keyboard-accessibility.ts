import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { reduce } from '@atlaskit/adf-utils/traverse';

import {
  editable,
  quickInsert,
  getDocFromElement,
} from '../../../../__tests__/integration/_helpers';
import {
  goToEditorTestingWDExample,
  mountEditor,
  loadLocale,
} from '../../../../__tests__/__helpers/testing-example-helpers';
import { dateSelectors } from '../../../../__tests__/__helpers/page-objects/_date';

const { dateInput, dateLozenge } = dateSelectors;
const maxSeparatorLen = 3;
const maxDayOrMonthLen = 2;
const numBackspaces = 4 + maxDayOrMonthLen * 2 + maxSeparatorLen + 5;

/** Array of enough 'Backspace' strings to move to the end of the input */
const backspaceArray = Array(numBackspaces).fill('Backspace');

/** Array of enough 'ArrowRight' strings to move to the end of the input */
const rightArrowArray = Array(numBackspaces).fill('ArrowRight');

BrowserTestCase(
  'keyboard-accessibility.ts: Type in date using input',
  { skip: [] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: 'full-page',
      allowDate: true,
      allowKeyboardAccessibleDatepicker: true,
    });
    await page.click(editable);

    await quickInsert(page, 'Date');
    await page.waitForSelector(dateInput);

    // Remove existing date
    await page.keys(backspaceArray);

    await page.type(dateInput, '2/29/2020');
    await page.keys('Enter', true);

    await page.waitForSelector(dateLozenge);
    expect(await page.getText(dateLozenge)).toBe('Feb 29, 2020');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'keyboard-accessibility.ts: Type in en-GB date using input',
  { skip: [] },
  async (client: any, testName: string) => {
    const locale = 'en-GB';
    const page = await goToEditorTestingWDExample(client);
    await loadLocale(page, [locale]);
    await mountEditor(
      page,
      {
        appearance: 'full-page',
        allowDate: true,
        allowKeyboardAccessibleDatepicker: true,
      },
      { i18n: { locale: 'en-GB' } },
    );
    await page.click(editable);

    await quickInsert(page, 'Date');

    await page.waitForSelector(dateInput);
    // Remove existing date
    await page.keys(backspaceArray);
    await page.type(dateInput, '29/02/2020');
    await page.keys('Enter', true);
    await page.keys('Escape', true);

    await page.waitForSelector(dateLozenge);
    expect(await page.getText(dateLozenge)).toBe('29 Feb 2020');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
BrowserTestCase(
  'keyboard-accessibility.ts: Type in (slightly) misformatted en-GB date using input',
  { skip: [] },
  async (client: any, testName: string) => {
    const locale = 'en-GB';
    const page = await goToEditorTestingWDExample(client);
    await loadLocale(page, [locale]);
    await mountEditor(
      page,
      {
        appearance: 'full-page',
        allowDate: true,
        allowKeyboardAccessibleDatepicker: true,
      },
      { i18n: { locale } },
    );
    await page.click(editable);

    await quickInsert(page, 'Date');

    await page.waitForSelector(dateInput);
    // Remove existing date
    await page.keys(backspaceArray);
    await page.type(dateInput, '29/2/2020');
    await page.keys('Enter', true);
    await page.keys('Escape', true);

    await page.waitForSelector(dateLozenge);
    expect(await page.getText(dateLozenge)).toBe('29 Feb 2020');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'keyboard-accessibility.ts: Type in hu-HU (Hungarian) date using input',
  { skip: [] },
  async (client: any, testName: string) => {
    const locale = 'hu';
    const page = await goToEditorTestingWDExample(client);
    await loadLocale(page, [locale]);
    await mountEditor(
      page,
      {
        appearance: 'full-page',
        allowDate: true,
        allowKeyboardAccessibleDatepicker: true,
      },
      { i18n: { locale } },
    );
    await page.click(editable);

    await quickInsert(page, 'Date');

    await page.waitForSelector(dateInput);

    // Remove existing date
    await page.keys(backspaceArray);

    // yyyy. mm. dd.
    await page.type(dateInput, '2020. 02. 29.');
    await page.keys('Enter', true);
    await page.keys('Escape', true);

    await page.waitForSelector(dateLozenge);
    expect(await page.getText(dateLozenge)).toBe('2020. febr. 29.');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'keyboard-accessibility.ts: Type in a (slightly) misformatted hu (Hungarian) date using input',
  { skip: [] },
  async (client: any, testName: string) => {
    const locale = 'hu';
    const page = await goToEditorTestingWDExample(client);
    await loadLocale(page, [locale]);
    await mountEditor(
      page,
      {
        appearance: 'full-page',
        allowDate: true,
        allowKeyboardAccessibleDatepicker: true,
      },
      { i18n: { locale } },
    );
    await page.click(editable);

    await quickInsert(page, 'Date');

    await page.waitForSelector(dateInput);

    // Remove existing date
    await page.keys(backspaceArray);

    // format is yyyy. mm. dd.
    await page.type(dateInput, '2020.2.29');
    await page.keys('Enter', true);
    await page.keys('Escape', true);

    await page.waitForSelector(dateLozenge);
    expect(await page.getText(dateLozenge)).toBe('2020. febr. 29.');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'keyboard-accessibility.ts: Arrow up on year increments year by 1 and keeps same day/month when they exist',
  { skip: [] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await loadLocale(page, ['en_GB']);
    await mountEditor(
      page,
      {
        appearance: 'full-page',
        allowDate: true,
        allowKeyboardAccessibleDatepicker: true,
      },
      { i18n: { locale: 'en-gb' } },
    );
    await page.click(editable);

    await quickInsert(page, 'Date');

    await page.waitForSelector(dateInput);

    // Remove existing date
    await page.keys(backspaceArray);

    await page.type(dateInput, '15/7/2020');

    await page.keys('ArrowUp', true);
    await page.keys(['Enter', 'Escape'], true);

    const lozengeText = await page.getText(dateLozenge);

    expect(lozengeText).toBe('15 Jul 2021');
  },
);

BrowserTestCase(
  "keyboard-accessibility.ts: When incrementing year by one, rolls over or back day when day doesn't exist in new year",
  { skip: [] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await loadLocale(page, ['en_GB']);
    await mountEditor(
      page,
      {
        appearance: 'full-page',
        allowDate: true,
        allowKeyboardAccessibleDatepicker: true,
      },
      { i18n: { locale: 'en-gb' } },
    );
    await page.click(editable);

    await quickInsert(page, 'Date');

    await page.waitForSelector(dateInput);

    // Remove existing date
    await page.keys(backspaceArray);

    await page.type(dateInput, '29/2/2020');

    await page.keys(['ArrowUp', 'Enter', 'Escape'], true);

    await page.waitForSelector(dateLozenge);

    expect(await page.getText(dateLozenge)).toBe('28 Feb 2021');

    const doc = await page.$eval(editable, getDocFromElement);

    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  `keyboard-accessibility.ts: Backspace after opening existing date should delete it`,
  { skip: ['firefox', 'edge', 'safari'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, {
      appearance: 'full-page',
      allowDate: true,
      allowKeyboardAccessibleDatepicker: true,
    });

    await page.click(editable);

    // Create date and close it again
    await quickInsert(page, 'Date');
    await page.waitForSelector(dateInput);
    await page.keys('Enter');

    // Open the date a second time
    await page.click(dateLozenge);
    await page.waitForSelector(dateInput);
    // Attempt to delete it
    await page.keys('Backspace');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'keyboard-accessibility.ts: Arrow up in textfield works on existing date',
  { skip: ['firefox', 'edge', 'safari'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await loadLocale(page, ['en_GB']);
    await mountEditor(
      page,
      {
        appearance: 'full-page',
        allowDate: true,
        allowKeyboardAccessibleDatepicker: true,
      },
      { i18n: { locale: 'en-gb' } },
    );

    // Insert date
    await page.click(editable);
    await quickInsert(page, 'Date');
    await page.waitForSelector(dateInput);

    // Replace existing date
    expect(await page.hasFocus(dateInput)).toBe(true);
    await page.keys(backspaceArray);
    await page.type(dateInput, '15/7/2020');

    // Close date
    await page.keys('Enter');

    // Open date again
    await page.click(dateLozenge);
    await page.waitForSelector(dateInput);

    // Make textfield active
    await page.click(dateInput);
    expect(await page.hasFocus(dateInput)).toBe(true);

    // Increment the date using arrow key
    await page.keys(rightArrowArray);
    await page.keys('ArrowUp', true);
    await page.keys(['Enter', 'Escape'], true);

    const lozengeText = await page.getText(dateLozenge);

    expect(lozengeText).toBe('15 Jul 2021');
  },
);

BrowserTestCase(
  'keyboard-accessibility.ts: Ctrl/Cmd-c on existing date copies node not text',
  { skip: ['firefox', 'edge', 'safari'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await loadLocale(page, ['en_GB']);
    await mountEditor(
      page,
      {
        appearance: 'full-page',
        allowDate: true,
        allowKeyboardAccessibleDatepicker: true,
      },
      { i18n: { locale: 'en-gb' } },
    );

    // Insert date
    await page.click(editable);
    await quickInsert(page, 'Date');
    await page.waitForSelector(dateInput);

    // Replace existing date
    expect(await page.hasFocus(dateInput)).toBe(true);
    await page.keys(backspaceArray);
    await page.type(dateInput, '17/2/2020');

    // Close date
    await page.keys('Enter');

    // Open date again
    await page.click(dateLozenge);
    await page.waitForSelector(dateInput);

    // Hit Ctrl/Cmd-C
    await page.copy();

    // Close date
    await page.keys('Enter');

    // Paste date node (not text)
    await page.paste();
    await page.keys(['ArrowRight', 'ArrowRight']);

    const doc = await page.$eval(editable, getDocFromElement);

    // On Windows Chrome, paste adds two extra spaces after the date on paste (macOS adds none)
    // Therefore a snapshot comparison can't be used

    const numDates = reduce(
      doc,
      (acc, node) => (node.type === 'date' ? acc + 1 : acc),
      0,
    );

    expect(numDates).toBe(2);
  },
);

BrowserTestCase(
  'keyboard-accessibility.ts: Tab on existing date selected the input',
  { skip: ['firefox', 'edge', 'safari'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await loadLocale(page, ['en_GB']);
    await mountEditor(
      page,
      {
        appearance: 'full-page',
        allowDate: true,
        allowKeyboardAccessibleDatepicker: true,
      },
      { i18n: { locale: 'en-gb' } },
    );

    // Insert date
    await page.click(editable);
    await quickInsert(page, 'Date');
    await page.waitForSelector(dateInput);

    // Replace existing date
    expect(await page.hasFocus(dateInput)).toBe(true);
    await page.keys(backspaceArray);
    await page.type(dateInput, '17/2/2020');

    // Close date
    await page.keys('Enter');

    // Open date again
    await page.click(dateLozenge);
    await page.waitForSelector(dateInput);

    // Input of existing date isn't focused
    expect(await page.hasFocus(dateInput)).toBe(false);

    // Tab into textfield
    await page.keys('Tab');

    // Input should now be focused
    expect(await page.hasFocus(dateInput)).toBe(true);
  },
);

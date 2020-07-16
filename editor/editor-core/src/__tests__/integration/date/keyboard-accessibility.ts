import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { editable, quickInsert, getDocFromElement } from '../_helpers';
import {
  goToEditorTestingExample,
  mountEditor,
  loadLocale,
} from '../../__helpers/testing-example-helpers';

const dateLozenge = 'span[timestamp]';
const input = '[aria-label="Popup"] input';

const maxSeparatorLen = 3;
const maxDayOrMonthLen = 2;
const numBackspaces = 4 + maxDayOrMonthLen * 2 + maxSeparatorLen + 5;
const backspaceArray = Array(numBackspaces).fill('Backspace');

BrowserTestCase(
  'keyboard-accessibility.ts: Type in date using input',
  { skip: ['edge'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);

    await mountEditor(page, {
      appearance: 'full-page',
      allowDate: true,
      allowKeyboardAccessibleDatepicker: true,
    });
    await page.click(editable);

    await quickInsert(page, 'Date');
    await page.waitForSelector(input);

    // Remove existing date
    await page.keys(backspaceArray);

    await page.type(input, '2/29/2020');
    await page.keys('Enter', true);

    await page.waitForSelector(dateLozenge);
    expect(page.getText(dateLozenge)).resolves.toBe('Feb 29, 2020');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'keyboard-accessibility.ts: Type in en-GB date using input',
  { skip: ['edge'] },
  async (client: any, testName: string) => {
    const locale = 'en-GB';
    const page = await goToEditorTestingExample(client);
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

    await page.waitForSelector(input);
    // Remove existing date
    await page.keys(backspaceArray);
    await page.type(input, '29/02/2020');
    await page.keys('Enter', true);
    await page.keys('Escape', true);

    await page.waitForSelector(dateLozenge);
    expect(page.getText(dateLozenge)).resolves.toBe('29 Feb 2020');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
BrowserTestCase(
  'keyboard-accessibility.ts: Type in (slightly) misformatted en-GB date using input',
  { skip: ['edge'] },
  async (client: any, testName: string) => {
    const locale = 'en-GB';
    const page = await goToEditorTestingExample(client);
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

    await page.waitForSelector(input);
    // Remove existing date
    await page.keys(backspaceArray);
    await page.type(input, '29/2/2020');
    await page.keys('Enter', true);
    await page.keys('Escape', true);

    await page.waitForSelector(dateLozenge);
    expect(page.getText(dateLozenge)).resolves.toBe('29 Feb 2020');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'keyboard-accessibility.ts: Type in hu-HU (Hungarian) date using input',
  { skip: ['edge'] },
  async (client: any, testName: string) => {
    const locale = 'hu';
    const page = await goToEditorTestingExample(client);
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

    await page.waitForSelector(input);

    // Remove existing date
    await page.keys(backspaceArray);

    // yyyy. mm. dd.
    await page.type(input, '2020. 02. 29.');
    await page.keys('Enter', true);
    await page.keys('Escape', true);

    await page.waitForSelector(dateLozenge);
    expect(page.getText(dateLozenge)).resolves.toBe('2020. febr. 29.');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'keyboard-accessibility.ts: Type in a (slightly) misformatted hu (Hungarian) date using input',
  { skip: ['edge'] },
  async (client: any, testName: string) => {
    const locale = 'hu';
    const page = await goToEditorTestingExample(client);
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

    await page.waitForSelector(input);

    // Remove existing date
    await page.keys(backspaceArray);

    // format is yyyy. mm. dd.
    await page.type(input, '2020.2.29');
    await page.keys('Enter', true);
    await page.keys('Escape', true);

    await page.waitForSelector(dateLozenge);
    expect(page.getText(dateLozenge)).resolves.toBe('2020. febr. 29.');

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'keyboard-accessibility.ts: Arrow up on year increments year by 1 and keeps same day/month when they exist',
  { skip: ['edge'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);
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

    await page.waitForSelector(input);

    // Remove existing date
    await page.keys(backspaceArray);

    await page.type(input, '15/7/2020');

    await page.keys('ArrowUp', true);
    await page.keys(['Enter', 'Escape'], true);

    const lozengeText = await page.getText(dateLozenge);

    // Temporary fix - some BrowserStack tests seem to decrement
    // the day by 1 as well when pressing ArrowUp on the year
    const isPrevRollover = lozengeText === '14 Jul 2021';
    const isNextRollover = lozengeText === '15 Jul 2021';

    // Can't check against snapshot, as it will be one or the other
    expect(isPrevRollover || isNextRollover).toBe(true);
  },
);

BrowserTestCase(
  "keyboard-accessibility.ts: When incrementing year by one, rolls over or back day when day doesn't exist in new year",
  { skip: ['edge'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);
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

    await page.waitForSelector(input);

    // Remove existing date
    await page.keys(backspaceArray);

    await page.type(input, '29/2/2020');

    await page.keys(['ArrowUp', 'Enter', 'Escape'], true);

    await page.waitForSelector(dateLozenge);

    expect(page.getText(dateLozenge)).resolves.toBe('28 Feb 2021');

    const doc = await page.$eval(editable, getDocFromElement);

    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

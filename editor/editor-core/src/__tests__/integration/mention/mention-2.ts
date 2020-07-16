import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  typeAheadPicker,
  insertMention,
  lozenge,
  getDocFromElement,
  editable,
  fullpage,
} from '../_helpers';
import {
  goToEditorTestingExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';

/*
 * Safari does not understand webdriver keyboard actions so a
 * number of tests have been skipped until move to snapshots.
 *
 * The remaining skipped tests for IE11/Edge are bugs that should be fixed for those browsers.
 */

// Follow up with browserstack as to why @ is keyed in as 2 on ie
BrowserTestCase(
  'mention-2.ts: user should see picker if they type "@"',
  { skip: ['edge'] },
  async (client: any) => {
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
    });

    await page.type(editable, '@');
    await page.waitForSelector(typeAheadPicker);
    expect(await page.isExisting(typeAheadPicker)).toBe(true);
  },
);

BrowserTestCase(
  'mention-2.ts: text@ should not invoke picker',
  { skip: ['edge'] },
  async (client: any) => {
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
    });

    await page.type(editable, 'test@');
    await page.waitForSelector(typeAheadPicker, undefined, true);

    expect(await page.isExisting(typeAheadPicker)).toBe(false);
  },
);

BrowserTestCase(
  'mention-2.ts: user should be able remove mention on backspace',
  { skip: ['edge'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
    });

    await insertMention(page, 'Carolyn');
    await insertMention(page, 'Summer');
    await insertMention(page, 'Amber');
    await page.keys(['Backspace', 'Backspace']);
    await page.waitForSelector(lozenge);
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'mention-2.ts: @ <space> should not invoke picker',
  { skip: ['edge'] },
  async (client: any) => {
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
    });

    await page.type(editable, '@ Carolyn');
    await page.waitForSelector(typeAheadPicker, undefined, true);

    expect(await page.isExisting(typeAheadPicker)).toBe(false);
  },
);

BrowserTestCase(
  'mention-2.ts: user should see space after node',
  { skip: ['edge'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
    });

    await insertMention(page, 'Summer');
    await page.waitForSelector('span=@Summer');
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'mention-2.ts: escape closes picker',
  { skip: ['edge'] },
  async (client: any) => {
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
    });

    await page.type(editable, '@');
    await page.waitForSelector(typeAheadPicker);
    await page.type(editable, 'Escape');
    await page.waitForSelector(typeAheadPicker, undefined, true);

    expect(await page.isExisting(typeAheadPicker)).toBe(false);
  },
);

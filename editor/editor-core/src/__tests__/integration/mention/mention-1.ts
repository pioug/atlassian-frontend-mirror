import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  getDocFromElement,
  editable,
  insertMention,
  typeAheadPicker,
  lozenge,
  fullpage,
} from '../_helpers';
import {
  mountEditor,
  goToEditorTestingWDExample,
} from '../../__helpers/testing-example-helpers';

BrowserTestCase(
  'mention-1.ts: user can see mention inside blockquote',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
      allowTables: {
        advanced: true,
      },
    });

    await page.type(editable, '> ');
    await page.type(editable, 'blockquote ');
    await insertMention(page, 'Carolyn');
    await page.waitForSelector(lozenge);
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'mention-1.ts: user can see mention inside bulletList',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
    });

    await page.type(editable, '* ');
    await page.waitForSelector('ul');
    await page.type(editable, 'this ');
    await insertMention(page, 'Carolyn');
    await page.waitForSelector(lozenge);
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'mention-1.ts: user can see mention inside orderedList',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
    });

    await page.type(editable, '1. ');
    await page.waitForSelector('ol');
    await page.type(editable, 'list ');
    await insertMention(page, 'Carolyn');
    await page.waitForSelector(lozenge);
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'mention-1.ts: user can see mention inside decision',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
    });

    await page.type(editable, '<> ');
    await insertMention(page, 'Carolyn');
    await page.waitForSelector(lozenge);
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'mention-1.ts: user can see mention inside action',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
    });

    await page.type(editable, '[] ');
    await insertMention(page, 'Carolyn');
    await page.waitForSelector(lozenge);
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'mention-1.ts: user can navigate picker using keyboard',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
    });

    await page.type(editable, '@');
    await page.waitForSelector(typeAheadPicker);
    await page.keys(['ArrowDown', 'Enter']);
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

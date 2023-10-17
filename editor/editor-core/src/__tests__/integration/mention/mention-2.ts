import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  typeAheadPicker,
  insertMention,
  lozenge,
  getDocFromElement,
  editable,
  fullpage,
} from '@atlaskit/editor-test-helpers/integration/helpers';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  goToEditorTestingWDExample,
  mountEditor,
} from '@atlaskit/editor-test-helpers/testing-example-page';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { selectors } from '@atlaskit/editor-test-helpers/page-objects/editor';

BrowserTestCase(
  'mention-2.ts: user should see picker if they type "@"',
  {},
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);
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
  {},
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);
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
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
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

// FIXME: This test was automatically skipped due to failure on 16/10/2023: https://product-fabric.atlassian.net/browse/ED-20490
BrowserTestCase(
  'mention-2.ts: @ <space> should not invoke picker',
  {
    skip: ['*'],
  },
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);
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
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
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
  {},
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
    });

    await page.type(editable, '@');
    await page.waitForSelector(typeAheadPicker);
    await page.keys(['Escape']);
    await page.waitForSelector(typeAheadPicker, undefined, true);

    expect(await page.isExisting(typeAheadPicker)).toBe(false);
  },
);

BrowserTestCase(
  'mention-2.ts: mouseclick outside picker closes picker',
  {},
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, {
      appearance: fullpage.appearance,
    });

    await page.type(editable, '@');
    await page.waitForSelector(typeAheadPicker);
    await page.click(selectors.editor);
    await page.waitForSelector(typeAheadPicker, undefined, true);

    expect(await page.isExisting(typeAheadPicker)).toBe(false);
  },
);

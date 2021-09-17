import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  mountEditor,
  goToEditorTestingWDExample,
} from '../../__helpers/testing-example-helpers';
import {
  getDocFromElement,
  editable,
  insertEmoji,
  emojiItem,
  insertEmojiBySelect,
} from '../_helpers';

BrowserTestCase(
  'emoji-2.ts: should be able to use emoji inside blockquote',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, { appearance: 'full-page' });
    await page.type(editable, '> ');
    await page.type(editable, 'some text ');
    await insertEmoji(page, 'a');
    await page.waitForSelector(emojiItem('a'), { timeout: 100 });
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'emoji-2.ts: should be able to use emoji inside bulletList',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, { appearance: 'full-page' });
    await page.type(editable, '* ');
    await insertEmoji(page, 'smile');
    await page.waitForSelector(emojiItem('smile'), { timeout: 1000 });
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

// FIXME: This test was automatically skipped due to failure on 9/16/2021: https://product-fabric.atlassian.net/browse/ED-13767
BrowserTestCase(
  'emoji-2.ts: should be able to use emoji inside orderedList',
  {
    skip: ['*'],
  },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, { appearance: 'full-page' });
    await page.type(editable, '1. ');
    await insertEmoji(page, 'a');
    await page.waitForSelector(emojiItem('a'), { timeout: 1000 });
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'emoji-2.ts: should be able remove emoji on backspace',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, { appearance: 'full-page' });
    await page.type(editable, 'this ');
    await insertEmoji(page, 'joy');
    await page.waitForSelector(emojiItem('joy'), { timeout: 1000 });
    await page.keys(['Backspace', 'Backspace']);
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'emoji-2.ts: should be able to select emoji by clicking inside decisions',
  {},
  async (client: any, testName: string) => {
    const decisions = 'span[aria-label="Decision"]';
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, { appearance: 'full-page' });
    // to get steps working on edge since its is slow
    await page.type(editable, '<> ');
    await page.waitForSelector(decisions, { timeout: 1000 });
    await page.type(editable, 'this ');
    await insertEmojiBySelect(page, 'smile');
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'emoji-2.ts: should be able to change text with emoji into decisions',
  {},
  async (client: any, testName: string) => {
    const decisions = 'li span[aria-label="Decision"]';
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, { appearance: 'full-page' });
    await page.type(editable, 'this ');
    await insertEmoji(page, 'smile');
    await page.click('[aria-label="Decision"]');
    await page.waitForSelector(decisions, { timeout: 1000 });
    await page.isExisting(decisions);
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

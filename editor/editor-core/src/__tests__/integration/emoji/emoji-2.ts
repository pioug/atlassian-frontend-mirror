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
  { skip: ['edge'] },
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
  { skip: ['edge'] },
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

BrowserTestCase(
  'emoji-2.ts: should be able to use emoji inside orderedList',
  { skip: ['edge'] },
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

// ie keying in ; instead of : - browserstack issue
BrowserTestCase(
  'emoji-2.ts: should be able remove emoji on backspace',
  { skip: ['safari', 'edge'] },
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

// Safari does not understand webdriver click
// IE has a bug opening picker inside task/decisions
BrowserTestCase(
  'emoji-2.ts: should be able to select emoji by clicking inside decisions',
  { skip: ['safari', 'edge'] },
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
  { skip: ['edge'] },
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

import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  mountEditor,
  goToEditorTestingExample,
} from '../../__helpers/testing-example-helpers';
import {
  getDocFromElement,
  editable,
  LONG_WAIT_FOR,
  insertEmoji,
  emojiItem,
  typeahead,
} from '../_helpers';

BrowserTestCase(
  'emoji-1.ts:should be able to see emoji if typed the name in full',
  { skip: ['safari', 'edge'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, { appearance: 'full-page' });
    await insertEmoji(page, 'grinning');
    await page.waitForSelector(emojiItem('grinning'), { timeout: 1000 });
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

// ie complains it cannot either type :) or types :0
BrowserTestCase(
  'emoji-1.ts: should convert :) to emoji',
  { skip: ['edge'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, { appearance: 'full-page' });
    // type slowly to get edge working
    await page.type(editable, '# ');
    await page.type(editable, 'heading ');
    await page.type(editable, ':) ');
    await page.waitForSelector(emojiItem('slight_smile'), { timeout: 1000 });
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

// IE now keying in CAPs on browserstack
BrowserTestCase(
  'user should not be able to see emoji inside inline code',
  { skip: ['edge'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, { appearance: 'full-page' });
    await page.type(editable, 'type `');
    await page.type(editable, ':a:');
    await page.type(editable, '`');
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'emoji-1.ts: should close emoji picker on Escape',
  { skip: ['firefox', 'safari', 'edge'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, { appearance: 'full-page' });
    await page.type(editable, 'this ');
    await page.type(editable, ':');
    await page.type(editable, 'smile');

    await page.waitForSelector(typeahead, { timeout: LONG_WAIT_FOR });
    expect(await page.isExisting(typeahead)).toBe(true);

    await page.type(editable, 'Escape');
    expect(await page.isExisting(typeahead)).toBe(false);

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

// Emoji pop up is hidden should fix examples to show this
// https://product-fabric.atlassian.net/browse/ED-5951
/* BrowserTestCase(
  'emoji-1.ts: should be able to click on the emoji button and select emoji',
  { skip: ['firefox', 'safari','edge'] },
  async (client: any, testName: string) => {
    const emojiButton = `[aria-label="${messages.emoji.defaultMessage}"]`;
    const sweatSmile = '[aria-label=":sweat_smile:"]';
    const browser = new Page(client);
    await gotoEditor(browser);
    await browser.waitForSelector(emojiButton);
    await browser.click(emojiButton);
    await browser.waitForSelector(sweatSmile);
    await browser.click(sweatSmile);
    const doc = await browser.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);
*/

// skipping safari since char    is stored in snapshot
// skipping firefox as it doesn't handle ArrowLeft on webdriver
// unable to navigate between emojis on IE - file issue
// Edge: ED-4908
BrowserTestCase(
  'emoji-1.ts: should be able to navigate between emojis',
  { skip: ['firefox', 'safari', 'edge'] },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, { appearance: 'full-page' });
    await page.type(editable, 'this ');
    await insertEmoji(page, 'a');
    await insertEmoji(page, 'light_bulb_on');
    await page.waitForSelector(emojiItem('a'), { timeout: 1000 });
    await page.keys(['ArrowLeft', 'ArrowLeft', 'ArrowLeft']);
    await page.type(editable, ' that ');
    const doc = await page.$eval(editable, getDocFromElement);
    // Below is a workaround related to https://product-fabric.atlassian.net/browse/ED-10238
    // It needs to be updated once the the chromeDriver bug is fixed.
    const docClone = Object.assign({}, doc);
    const str = doc.content[0].content[2].text; // store the 'that' string.
    docClone.content[0].content[2].text = ''; // wipe out the problematic 'that' string
    expect(str.includes('that')).toBe(true);
    expect(docClone).toMatchCustomDocSnapshot(testName);
  },
);

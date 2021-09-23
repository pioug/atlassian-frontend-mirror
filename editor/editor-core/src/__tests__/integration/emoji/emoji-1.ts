import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  mountEditor,
  goToEditorTestingWDExample,
} from '../../__helpers/testing-example-helpers';
import {
  emojiSelectors,
  emojiSearch,
} from '../../__helpers/page-objects/_emoji';
import {
  getDocFromElement,
  editable,
  insertEmoji,
  emojiItem,
  typeahead,
} from '../_helpers';

BrowserTestCase(
  'emoji-1.ts:should be able to see emoji if typed the name in full',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, { appearance: 'full-page' });
    await insertEmoji(page, 'grinning');
    await page.waitForSelector(emojiItem('grinning'));
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'emoji-1.ts: should convert :) to emoji',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, { appearance: 'full-page' });

    await page.waitForSelector(editable);

    await page.keys('# heading :) '.split(''));

    await page.waitForInvisible(emojiSelectors.typeaheadPopup);

    await page.waitForSelector(emojiItem('slight_smile'));
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'user should not be able to see emoji inside inline code',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
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
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, { appearance: 'full-page' });
    await page.type(editable, 'this ');

    await emojiSearch(page, 'smile');

    await page.keys('Escape');
    const result = await page.isExisting(typeahead);
    expect(result).toBeFalsy();

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

// FIXME: This test was automatically skipped due to failure on 9/17/2021: https://product-fabric.atlassian.net/browse/ED-13770
BrowserTestCase(
  'emoji-1.ts: should be able to navigate between emojis',
  {
    skip: ['*'],
  },
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, { appearance: 'full-page' });
    await page.type(editable, 'this ');

    await insertEmoji(page, 'a');
    await page.waitForSelector(emojiItem('a'));

    await insertEmoji(page, 'light_bulb_on');
    await page.waitForSelector(emojiItem('light_bulb_on'));

    await page.keys(['ArrowLeft', 'ArrowLeft', 'ArrowLeft']);

    await page.keys('that '.split(''));
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

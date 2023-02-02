import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  mountEditor,
  goToEditorTestingWDExample,
} from '@atlaskit/editor-test-helpers/testing-example-page';
import {
  emojiSelectors,
  emojiSearch,
} from '@atlaskit/editor-test-helpers/page-objects/emoji';
import {
  getDocFromElement,
  editable,
  insertEmoji,
  emojiItem,
  typeahead,
} from '@atlaskit/editor-test-helpers/integration/helpers';
import { runEscapeKeydownSuite } from '@atlaskit/editor-test-helpers/integration/escape-keydown';

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
    const reverseSelection = true;
    const typeAheadNotPresent = await page.waitForSelector(
      typeahead,
      undefined,
      reverseSelection,
    );
    expect(typeAheadNotPresent).toBeTruthy();

    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

runEscapeKeydownSuite({
  openMenu: async (page) => {
    await emojiSearch(page, 'smile');
  },
});

BrowserTestCase(
  'emoji-1.ts: should be able to navigate between emojis',
  {},
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

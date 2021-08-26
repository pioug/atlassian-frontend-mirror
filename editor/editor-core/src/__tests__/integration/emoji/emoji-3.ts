import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import { codeBlockSelectors } from '../../__helpers/page-objects/_code-block';
import {
  mountEditor,
  goToEditorTestingWDExample,
} from '../../__helpers/testing-example-helpers';
import { emojiSearch } from '../../__helpers/page-objects/_emoji';
import {
  getDocFromElement,
  editable,
  insertEmoji,
  emojiItem,
  typeahead,
  highlightEmojiInTypeahead,
} from '../_helpers';

BrowserTestCase(
  'emoji-3.ts: user can navigate typeahead using keyboard',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, { appearance: 'full-page' });
    await emojiSearch(page, 'smi');
    await page.keys('ArrowDown');

    // The typeahead may re-order our results.
    // Go down 5 items til we find our desired emoji
    await highlightEmojiInTypeahead(page, 'smile');

    await page.keys('Return');
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'emoji-3.ts: should select emoji on return',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, { appearance: 'full-page' });

    await emojiSearch(page, 'wink');

    // The typeahead may re-order our results.
    // Grab the currently selected emoji, to reference in render.
    await highlightEmojiInTypeahead(page, 'wink');

    await page.keys('Return');
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'emoji-3.ts: should render emoji inside codeblock',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, { appearance: 'full-page' });
    await page.type(editable, ['``', '`']);
    await page.waitForSelector(codeBlockSelectors.code, { timeout: 1000 });
    await page.type(editable, ':smile:');
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'emoji-3.ts: should render emoji inside action',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, { appearance: 'full-page' });
    await page.type(editable, '[] ');
    await insertEmoji(page, 'smile');
    await page.waitForSelector(emojiItem('smile'), { timeout: 1000 });
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

BrowserTestCase(
  'emoji-3.ts: should not show typeahead with text: ',
  {},
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, { appearance: 'full-page' });
    await page.type(editable, 'text: ');
    const result = await page.isExisting(typeahead);

    expect(result).toBeFalsy();
  },
);

BrowserTestCase(
  'emoji-3.ts: ":<space>" does not show the picker',
  {},
  async (client: any) => {
    const page = await goToEditorTestingWDExample(client);
    await mountEditor(page, { appearance: 'full-page' });
    await page.type(editable, ': ');
    const result = await page.isExisting(typeahead);

    expect(result).toBeFalsy();
  },
);

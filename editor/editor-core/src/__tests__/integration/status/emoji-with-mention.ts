import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  mountEditor,
  goToEditorTestingWDExample,
} from '@atlaskit/editor-test-helpers/testing-example-page';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  editable,
  getDocFromElement,
  insertEmoji,
  emojiItem,
  insertMention,
  lozenge,
} from '@atlaskit/editor-test-helpers/integration/helpers';

BrowserTestCase(
  'emoji.ts: Insert an emoji, then a mention, move to right before the emoji and try to add text between both',
  {},
  async (client: any, testName: string) => {
    const page = await goToEditorTestingWDExample(client);

    await mountEditor(page, { appearance: 'full-page' });

    await insertEmoji(page, 'grinning');
    await page.waitForSelector(emojiItem('grinning'));
    await insertEmoji(page, 'grinning');
    await page.waitForSelector(emojiItem('grinning'));
    await insertMention(page, 'Carolyn');
    await page.waitForSelector(lozenge);

    await page.keys([
      'ArrowLeft',
      'ArrowLeft',
      'ArrowLeft',
      'ArrowLeft',
      'ArrowLeft',
      'ArrowLeft',
    ]);
    await page.keys('Some text'.split(''));

    await page.keys(['ArrowRight', 'ArrowRight', 'ArrowRight']);

    await page.keys('Some text'.split(''));

    await page.keys(['ArrowRight', 'ArrowRight', 'ArrowRight']);
    await page.keys('Some text'.split(''));

    await page.click(editable);
    const doc = await page.$eval(editable, getDocFromElement);
    expect(doc).toMatchCustomDocSnapshot(testName);
  },
);

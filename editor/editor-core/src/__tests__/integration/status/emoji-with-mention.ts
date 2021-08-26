import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';

import {
  mountEditor,
  goToEditorTestingWDExample,
} from '../../__helpers/testing-example-helpers';
import {
  editable,
  getDocFromElement,
  insertEmoji,
  emojiItem,
  insertMention,
  lozenge,
} from '../_helpers';

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
    await page.keys(['ArrowLeft', 'ArrowLeft', 'ArrowLeft']);

    if (page.isBrowser('firefox')) {
      // https://product-fabric.atlassian.net/browse/ED-13457
      // There is a selection issue for Firefox
      // The emoji requires on more keystroke to leave
      await page.keys(['ArrowLeft']);
    }

    await page.keys(['ArrowLeft', 'ArrowLeft', 'ArrowLeft']);
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

import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
import {
  goToEditorTestingExample,
  mountEditor,
} from '../../__helpers/testing-example-helpers';
import { fullpage, editable } from '../_helpers';

BrowserTestCase(
  'insert-block.ts: opens emoji picker from toolbar button',
  { skip: ['edge'] },
  async (client: any) => {
    const page = await goToEditorTestingExample(client);
    await mountEditor(page, fullpage);

    const emoji = `[aria-label="Emoji"]`;

    await page.click(editable);
    await page.click(emoji);

    await page.waitForSelector('[data-emoji-picker-container="true"]');
  },
);

BrowserTestCase(
  'insert-block.ts: opens emoji picker from dropdown after resizing',
  { skip: ['edge'] },
  async (client: any) => {
    const page = await goToEditorTestingExample(client);

    await page.setWindowSize(3000, 750);

    await mountEditor(page, fullpage);

    const emoji = '[aria-label="Emoji"]';
    const emojiPanel = '[data-emoji-picker-container="true"]';
    const insert = '[aria-label="Insert"]';

    await page.setWindowSize(500, 750);

    await page.click(editable);
    await page.click(insert);
    await page.click(emoji);

    await page.waitForSelector(emojiPanel);
    expect(await page.isExisting(emojiPanel)).toBe(true);
  },
);

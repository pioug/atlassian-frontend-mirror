import { Page } from 'puppeteer';

export const emojiReadySelector = '.emoji-common-emoji-sprite';

export async function waitForEmojis(page: Page) {
  await page.waitForSelector(emojiReadySelector);
}

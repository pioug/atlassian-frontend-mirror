import { EmojiSharedCssClassName } from '@atlaskit/editor-common';
import { Page } from 'puppeteer';

export const emojiSelectors = {
  standard: `.${EmojiSharedCssClassName.EMOJI_SPRITE}`,
  custom: `.${EmojiSharedCssClassName.EMOJI_IMAGE}`,
};

export async function waitForEmojis(page: Page) {
  await page.waitForSelector(emojiSelectors.standard);
}

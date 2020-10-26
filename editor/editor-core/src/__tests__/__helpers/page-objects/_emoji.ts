import { EmojiSharedCssClassName } from '@atlaskit/editor-common';
import { TestPage } from './_types';

export const emojiSelectors = {
  standard: `.${EmojiSharedCssClassName.EMOJI_SPRITE}`,
  custom: `.${EmojiSharedCssClassName.EMOJI_IMAGE}`,
  node: `.${EmojiSharedCssClassName.EMOJI_NODE}`,
};

export async function waitForEmojis(page: TestPage) {
  await page.waitForSelector(emojiSelectors.standard);
}

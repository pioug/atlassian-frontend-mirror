import { EmojiSharedCssClassName } from '@atlaskit/editor-common/emoji';
import { type PuppeteerPage } from '@atlaskit/visual-regression/helper';

export const emojiSelectors = {
	standard: `.${EmojiSharedCssClassName.EMOJI_SPRITE}`,
	custom: `.${EmojiSharedCssClassName.EMOJI_IMAGE}`,
};

export async function waitForEmojis(page: PuppeteerPage) {
	await page.waitForSelector(emojiSelectors.standard);
}

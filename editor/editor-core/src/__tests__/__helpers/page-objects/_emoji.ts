import { EmojiSharedCssClassName } from '@atlaskit/editor-common/emoji';
import { waitForLoadedBackgroundImages } from '@atlaskit/visual-regression/helper';
import { selectors } from './_editor';

export const EMOJI_TRIGGER = ':';
export const emojiSelectors = {
  typeaheadPopup: '.fabric-editor-typeahead [role="listbox"]',
  standard: `.${EmojiSharedCssClassName.EMOJI_SPRITE}`,
  custom: `.${EmojiSharedCssClassName.EMOJI_IMAGE}`,
  node: `.${EmojiSharedCssClassName.EMOJI_NODE}`,
  placeholder: `.${EmojiSharedCssClassName.EMOJI_PLACEHOLDER}`,
};

export async function waitForNoEmojiPlaceholder(page: PuppeteerPage) {
  await page.waitForSelector(emojiSelectors.placeholder, {
    timeout: 5000,
    hidden: true,
  });
}

export async function waitForEmojisToLoad(page: PuppeteerPage) {
  await waitForNoEmojiPlaceholder(page);
  await waitForLoadedBackgroundImages(page, emojiSelectors.standard);
}

export const emojiSearch = async (
  page: any,
  searchQuery: string,
  appendTriggerAtQuery: boolean = false,
) => {
  await page.waitForSelector(selectors.editor);
  await page.type(selectors.editor, EMOJI_TRIGGER);

  await page.waitForSelector(selectors.emojiQuery);

  if (searchQuery) {
    await page.keys(searchQuery.split(''));

    if (appendTriggerAtQuery) {
      await page.keys(EMOJI_TRIGGER);
    }
  }
};

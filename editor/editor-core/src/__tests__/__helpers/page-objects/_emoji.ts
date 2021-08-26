import { EmojiSharedCssClassName } from '@atlaskit/editor-common/styles';
import { TestPage } from './_types';
import { selectors } from './_editor';

export const EMOJI_TRIGGER = ':';
export const emojiSelectors = {
  typeaheadPopup: '.fabric-editor-typeahead [role="listbox"]',
  standard: `.${EmojiSharedCssClassName.EMOJI_SPRITE}`,
  custom: `.${EmojiSharedCssClassName.EMOJI_IMAGE}`,
  node: `.${EmojiSharedCssClassName.EMOJI_NODE}`,
};

export async function waitForEmojis(page: TestPage) {
  await page.waitForSelector(emojiSelectors.standard);
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

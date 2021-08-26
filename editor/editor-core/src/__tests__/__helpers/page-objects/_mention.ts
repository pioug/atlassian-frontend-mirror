import { MentionSharedCssClassName } from '@atlaskit/editor-common';
import { selectors } from './_editor';

export const MENTION_TRIGGER = '@';
export const mentionSelectors = {
  mention: `.${MentionSharedCssClassName.MENTION_CONTAINER}`,
};

export const mentionSearch = async (page: any, searchQuery?: string) => {
  await page.waitForSelector(selectors.editor);
  await page.type(selectors.editor, MENTION_TRIGGER);

  await page.waitForSelector(selectors.mentionQuery);

  if (searchQuery) {
    await page.keys(searchQuery.split(''));
  }
};

import { EmojiDescription } from '@atlaskit/emoji/types';

export const filterToSearchable = (emojis: EmojiDescription[]) =>
  emojis.filter(emoji => emoji.searchable);

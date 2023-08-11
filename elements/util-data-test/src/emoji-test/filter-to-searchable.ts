import { EmojiDescription } from '../../../emoji/src/types';

export const filterToSearchable = (emojis: EmojiDescription[]) =>
  emojis.filter(emoji => emoji.searchable);

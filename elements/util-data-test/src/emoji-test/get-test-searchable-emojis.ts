import type { EmojiDescription } from '@atlaskit/emoji';
import { filterToSearchable } from './filter-to-searchable';
import { getTestEmojis } from './get-test-emojis';

export const getTestSearchableEmojis = (): EmojiDescription[] => filterToSearchable(getTestEmojis());

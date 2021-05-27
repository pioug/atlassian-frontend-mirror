import { filterToSearchable } from './filter-to-searchable';
import { getTestEmojis } from './get-test-emojis';

export const getTestSearchableEmojis = () =>
  filterToSearchable(getTestEmojis());

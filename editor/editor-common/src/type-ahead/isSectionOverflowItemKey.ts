import { SECTION_OVERFLOW_ITEM_KEY_SUFFIX } from './SECTION_OVERFLOW_ITEM_KEY_SUFFIX';

/** Identifies items reserved for revealing the remainder of a type-ahead section. */
export const isSectionOverflowItemKey = (key: string): boolean =>
	key.endsWith(SECTION_OVERFLOW_ITEM_KEY_SUFFIX);

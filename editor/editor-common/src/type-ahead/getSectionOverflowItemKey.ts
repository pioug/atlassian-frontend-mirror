import { SECTION_OVERFLOW_ITEM_KEY_SUFFIX } from './SECTION_OVERFLOW_ITEM_KEY_SUFFIX';

/** Returns the reserved key for the item that reveals the remainder of a type-ahead section. */
export const getSectionOverflowItemKey = (sectionKey: string): string =>
	`${sectionKey}${SECTION_OVERFLOW_ITEM_KEY_SUFFIX}`;

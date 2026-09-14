import type { EmojiDescription } from '../../types';

/**
 * Returns a number representing the result of comparing e1 and e2.
 * Compatible with Array.sort, which is to say -
 *   - less than 0 if e1 should come first
 *   - 0 if they are equal; e1 and e2 will be unchanged in position relative to each other
 *   - greater than 0 if e2 should come first.
 */
export interface EmojiComparator {
	compare(e1: EmojiDescription, e2: EmojiDescription): number;
}

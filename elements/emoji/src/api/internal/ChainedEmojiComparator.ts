import type { EmojiDescription } from '../../types';
import type { EmojiComparator } from './Comparators';

/**
 * A combinator comparator that applies an ordered chained of sub-comparators. The first comparator that
 * returns a non-zero value stops the chain and causes that value to be returned. If a comparator returns a
 * zero then the next one in the chain is tried.
 *
 * If no comparators in the chain return a non-zero value then zero will be returned.
 */
export class ChainedEmojiComparator implements EmojiComparator {
	private chain: EmojiComparator[];

	constructor(...comparators: EmojiComparator[]) {
		this.chain = comparators;
	}

	compare(e1: EmojiDescription, e2: EmojiDescription): number {
		for (let i = 0; i < this.chain.length; i++) {
			const result = this.chain[i].compare(e1, e2);
			if (result !== 0) {
				return result;
			}
		}

		return 0;
	}
}

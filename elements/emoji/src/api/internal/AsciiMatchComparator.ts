import type { EmojiDescription } from '../../types';
import type { EmojiComparator } from './Comparators';

/**
 * Orders two emoji such that if one of them has an ascii representation that exactly matches the query then it will
 * be ordered first.
 */
export class AsciiMatchComparator implements EmojiComparator {
	private query: string;

	constructor(query: string) {
		this.query = query;
	}

	compare(e1: EmojiDescription, e2: EmojiDescription): 0 | 1 | -1 {
		const e1HasAscii = e1.ascii && e1.ascii.indexOf(this.query) !== -1;
		const e2HasAscii = e2.ascii && e2.ascii.indexOf(this.query) !== -1;

		if (e1HasAscii && !e2HasAscii) {
			return -1;
		} else if (!e1HasAscii && e2HasAscii) {
			return 1;
		}

		return 0;
	}
}

import type { EmojiDescription } from '../../types';
import type { EmojiComparator } from './Comparators';
import { EmojiTypeComparator } from './EmojiTypeComparator';

/**
 * Orders two emoji such that the one who's shortname matches the query exactly comes first. If there are matching
 * shortnames then the type of emoji is taken into account with SITE emoji coming first.
 */
export class ExactShortNameMatchComparator implements EmojiComparator {
	private colonQuery: string;
	private typeComparator: EmojiComparator;

	constructor(query: string) {
		this.colonQuery = `:${query}:`;
		this.typeComparator = new EmojiTypeComparator(true);
	}

	compare(e1: EmojiDescription, e2: EmojiDescription): number {
		if (e1.shortName === this.colonQuery && e2.shortName === this.colonQuery) {
			return this.typeComparator.compare(e1, e2);
		} else if (e1.shortName === this.colonQuery) {
			return -1;
		} else if (e2.shortName === this.colonQuery) {
			return 1;
		}

		return 0;
	}
}

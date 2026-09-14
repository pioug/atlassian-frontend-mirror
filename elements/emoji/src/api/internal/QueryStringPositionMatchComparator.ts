import type { EmojiDescription } from '../../types';
import { MAX_ORDINAL } from '../../util/constants';
import type { EmojiComparator } from './Comparators';

type KeysOfType<T, TProp> = {
	[P in keyof T]: T[P] extends TProp | undefined ? P : never;
}[keyof T];

/**
 * A comparator that will sort higher an emoji which matches the query string earliest in the indicated
 * property.
 */
export class QueryStringPositionMatchComparator implements EmojiComparator {
	private readonly propertyName: KeysOfType<EmojiDescription, string>;
	private query: string;

	/**
	 * @param query the query to match
	 * @param propertyToCompare the property of EmojiDescription to check for query within
	 */
	constructor(query: string, propertyToCompare: KeysOfType<EmojiDescription, string>) {
		this.query = query;
		if (!propertyToCompare) {
			throw new Error('propertyToCompare is required');
		}
		this.propertyName = propertyToCompare;
	}

	private getScore(emoji: EmojiDescription) {
		// It is fine to do override the null check here because we are checking
		// it on the constructor.
		const propertyValue: string | undefined = emoji[this.propertyName!];
		const score = propertyValue ? propertyValue.indexOf(this.query) : MAX_ORDINAL;
		return score === -1 ? MAX_ORDINAL : score;
	}

	compare(e1: EmojiDescription, e2: EmojiDescription): number {
		return this.getScore(e1) - this.getScore(e2);
	}
}

import type { EmojiDescription } from '../../types';
import type { EmojiComparator } from './Comparators';

export class AlphabeticalShortnameComparator implements EmojiComparator {
	private static INSTANCE: AlphabeticalShortnameComparator;
	private constructor() {}

	public static get Instance(): AlphabeticalShortnameComparator {
		return this.INSTANCE || (this.INSTANCE = new this());
	}

	compare(e1: EmojiDescription, e2: EmojiDescription): number {
		return e1.shortName.localeCompare(e2.shortName);
	}
}

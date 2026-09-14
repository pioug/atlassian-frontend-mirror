import type { EmojiDescription } from '../../types';
import type { EmojiComparator } from './Comparators';

/**
 * Orders two emoji based on their type, with the types being STANDARD, ATLASSIAN and SITE (in that order).
 * If the comparator is configured to 'reverse' then the order will be SITE, ATLASSIAN, STANDARD.
 *
 * Regardless of the reverse setting, an unknown type will always come last.
 */
export class EmojiTypeComparator implements EmojiComparator {
	private typeToNumber: Map<string, number>;

	constructor(reverse?: boolean) {
		if (reverse) {
			this.typeToNumber = new Map<string, number>([
				['SITE', 0],
				['ATLASSIAN', 1],
				['STANDARD', 2],
			]);
		} else {
			this.typeToNumber = new Map<string, number>([
				['STANDARD', 0],
				['ATLASSIAN', 1],
				['SITE', 2],
			]);
		}
	}

	compare(e1: EmojiDescription, e2: EmojiDescription): number {
		return this.emojiTypeToOrdinal(e1) - this.emojiTypeToOrdinal(e2);
	}

	private emojiTypeToOrdinal(emoji: EmojiDescription): number {
		let ordinal = this.typeToNumber.get(emoji.type);
		if (ordinal === undefined) {
			ordinal = 10;
		}

		return ordinal;
	}
}

import type { EmojiDescription } from '../../types';
import { MAX_ORDINAL } from '../../util/constants';
import { isEmojiVariationDescription } from '../../util/is-emoji-variation-description';
import type { EmojiComparator } from './Comparators';

/**
 * Order two emoji such as the one which is more frequently used comes first. If neither have any usage
 * information then leave their order unchanged.
 */
export class UsageFrequencyComparator implements EmojiComparator {
	// A Map of emoji base Id to their order in a least of most frequently used
	private positionLookup: Map<string, number>;

	constructor(orderedIds: Array<string>) {
		this.positionLookup = new Map();
		// Make ordering start from 1 to avoid having zero in the map (which is falsey)
		orderedIds.map((id, index) => this.positionLookup.set(id, index + 1));
	}

	compare(e1: EmojiDescription, e2: EmojiDescription): number {
		if (!e1.id || !e2.id) {
			return 0; // this shouldn't occur. Leave position unchanged if there is any missing id.
		}

		let i1 = this.getPositionInOrder(e1);
		let i2 = this.getPositionInOrder(e2);

		return i1 - i2;
	}

	/**
	 * Get the ordinal representing the position of this emoji.
	 *
	 * @param id the id of the emoji
	 */
	private getPositionInOrder(emoji: EmojiDescription) {
		let id = emoji.id ? emoji.id : '0';
		if (isEmojiVariationDescription(emoji)) {
			id = emoji.baseId;
		}

		const position = this.positionLookup.get(id);
		if (position) {
			return position;
		} else {
			return MAX_ORDINAL;
		}
	}
}

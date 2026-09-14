import type { EmojiDescription } from '../../types';
import { MAX_ORDINAL } from '../../util/constants';
import type { EmojiComparator } from './Comparators';

export class OrderComparator implements EmojiComparator {
	private static INSTANCE: OrderComparator;
	private constructor() {}

	public static get Instance(): OrderComparator {
		return this.INSTANCE || (this.INSTANCE = new this());
	}

	compare(e1: EmojiDescription, e2: EmojiDescription): number {
		let o1 = e1.order ? e1.order : MAX_ORDINAL;
		let o2 = e2.order ? e2.order : MAX_ORDINAL;

		return o1 - o2;
	}
}

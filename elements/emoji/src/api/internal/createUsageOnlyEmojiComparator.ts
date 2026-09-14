import { ChainedEmojiComparator } from './ChainedEmojiComparator';
import type { EmojiComparator } from './Comparators';
import { EmojiTypeComparator } from './EmojiTypeComparator';
import { OrderComparator } from './OrderComparator';
import { UsageFrequencyComparator } from './UsageFrequencyComparator';

export function createUsageOnlyEmojiComparator(orderedIds: Array<string>): EmojiComparator {
	const comparator = new ChainedEmojiComparator(
		new UsageFrequencyComparator(orderedIds),
		new EmojiTypeComparator(),
		OrderComparator.Instance,
	);
	comparator.compare = comparator.compare.bind(comparator);
	return comparator;
}

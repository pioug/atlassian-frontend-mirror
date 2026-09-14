import { AlphabeticalShortnameComparator } from './AlphabeticalShortnameComparator';
import { AsciiMatchComparator } from './AsciiMatchComparator';
import { ChainedEmojiComparator } from './ChainedEmojiComparator';
import type { EmojiComparator } from './Comparators';
import { ExactShortNameMatchComparator } from './ExactShortNameMatchComparator';
import { OrderComparator } from './OrderComparator';
import { QueryStringPositionMatchComparator } from './QueryStringPositionMatchComparator';
import { UsageFrequencyComparator } from './UsageFrequencyComparator';

/**
 * Create the default sort comparator to be used for the user queries against emoji
 *
 * @param query the query used in the search to be sorted. Any colons will be stripped from the query and it will be
 * converted to lowercase.
 * @param orderedIds the id of emoji ordered by how frequently they are used
 */
export function createSearchEmojiComparator(
	query?: string,
	orderedIds?: Array<string>,
): EmojiComparator {
	const textQuery = query ? query.replace(/:/g, '').toLowerCase().trim() : undefined;

	const comparators: EmojiComparator[] = [];

	if (query) {
		comparators.push(new AsciiMatchComparator(query));
	}

	// Add the comparators to the 'chain'. The order of adding each comparator is important to the sort that is applied by the
	// ChainedEmojiComparator. (Which is why you may see the same 'if' a few times.)

	if (textQuery) {
		comparators.push(new ExactShortNameMatchComparator(textQuery));
	}

	if (orderedIds && orderedIds.length) {
		comparators.push(new UsageFrequencyComparator(orderedIds));
	}

	if (textQuery) {
		comparators.push(
			new QueryStringPositionMatchComparator(textQuery, 'shortName'),
			new QueryStringPositionMatchComparator(textQuery, 'name'),
		);
	}

	comparators.push(OrderComparator.Instance, AlphabeticalShortnameComparator.Instance);

	const comparator = new ChainedEmojiComparator(...comparators);
	comparator.compare = comparator.compare.bind(comparator);
	return comparator;
}

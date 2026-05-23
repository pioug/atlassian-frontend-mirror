import type { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import { find } from '@atlaskit/editor-common/quick-insert';
import type { QuickInsertSearchOptions } from '@atlaskit/editor-common/types';
import { dedupe } from '@atlaskit/editor-common/utils';
import { fg } from '@atlaskit/platform-feature-flags';

type GetQuickInsertSuggestions = (
	searchOptions: QuickInsertSearchOptions,
	lazyDefaultItems?: () => QuickInsertItem[],
	providedItems?: QuickInsertItem[],
) => QuickInsertItem[];

type QuickInsertItemWithId = QuickInsertItem & { id: NonNullable<QuickInsertItem['id']> };
type QuickInsertPrioritySortFn = NonNullable<
	ReturnType<NonNullable<QuickInsertSearchOptions['prioritySortingFn']>>
>;
type QuickInsertPrioritySortResult = Parameters<QuickInsertPrioritySortFn>[0];

const isRegisteredLayoutQuickInsertItem = (item: QuickInsertItem): item is QuickInsertItemWithId =>
	Boolean(
		item.id &&
		item.id !== 'layout' &&
		item.keywords?.includes('layout') &&
		item.keywords?.includes('column'),
	);

const getLayoutQuickInsertItemIdRank = (
	items: QuickInsertItem[],
): Map<QuickInsertItem['id'], number> =>
	new Map(items.filter(isRegisteredLayoutQuickInsertItem).map((item, index) => [item.id, index]));

const getQuickInsertItemId = (
	items: QuickInsertItem[],
	result: QuickInsertPrioritySortResult,
): QuickInsertItem['id'] => items[result.idx]?.id;

export const withLayoutQuickInsertPrioritySorting =
	(
		prioritySortingFn?: QuickInsertSearchOptions['prioritySortingFn'],
	): QuickInsertSearchOptions['prioritySortingFn'] =>
	(items) => {
		const consumerSortFn = prioritySortingFn?.(items);
		const layoutItemIdRank = getLayoutQuickInsertItemIdRank(items);

		if (layoutItemIdRank.size < 2) {
			return consumerSortFn;
		}

		return (firstItem, secondItem) => {
			const firstLayoutItemRank = layoutItemIdRank.get(getQuickInsertItemId(items, firstItem));
			const secondLayoutItemRank = layoutItemIdRank.get(getQuickInsertItemId(items, secondItem));

			if (firstLayoutItemRank !== undefined && secondLayoutItemRank !== undefined) {
				return firstLayoutItemRank - secondLayoutItemRank;
			}

			if (consumerSortFn) {
				return consumerSortFn(firstItem, secondItem);
			}

			return firstItem.score === secondItem.score
				? firstItem.idx < secondItem.idx
					? -1
					: 1
				: firstItem.score < secondItem.score
					? -1
					: 1;
		};
	};

export const getQuickInsertSuggestions: GetQuickInsertSuggestions = (
	searchOptions,
	lazyDefaultItems = () => [],
	providedItems,
) => {
	// @ts-ignore
	const { query, category, disableDefaultItems, featuredItems, itemFilter, prioritySortingFn } =
		searchOptions;
	const defaultItems = disableDefaultItems ? [] : lazyDefaultItems();

	const dedupeFn = (item: QuickInsertItem) => `${item.title}-${item.description ?? ''}`;

	let items = providedItems ? dedupe([...defaultItems, ...providedItems], dedupeFn) : defaultItems;

	// EDITOR-6558: apply consumer-supplied filter (e.g. Markdown Mode allowlist).
	if (itemFilter) {
		items = items.filter(itemFilter);
	}

	if (featuredItems) {
		return items.filter((item) => item.featured);
	}

	return find(
		(fg('platform_editor_fix_space_triggering_ai') ? query?.trimEnd() : query) || '',
		category === 'all' || !category
			? items
			: items.filter((item) => item.categories && item.categories.includes(category)),
		prioritySortingFn,
	);
};

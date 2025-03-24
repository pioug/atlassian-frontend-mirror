import { type QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import { find } from '@atlaskit/editor-common/quick-insert';
import type { QuickInsertSearchOptions } from '@atlaskit/editor-common/types';
import { dedupe } from '@atlaskit/editor-common/utils';
import { fg } from '@atlaskit/platform-feature-flags';

type GetQuickInsertSuggestions = (
	searchOptions: QuickInsertSearchOptions,
	lazyDefaultItems?: () => QuickInsertItem[],
	providedItems?: QuickInsertItem[],
) => QuickInsertItem[];

export const getQuickInsertSuggestions: GetQuickInsertSuggestions = (
	searchOptions,
	lazyDefaultItems = () => [],
	providedItems,
) => {
	// @ts-ignore
	const { query, category, disableDefaultItems, featuredItems, prioritySortingFn } = searchOptions;
	const defaultItems = disableDefaultItems ? [] : lazyDefaultItems();

	const dedupeFn = fg('platform_editor_quick_insert_dedupe_title_desc')
		? (item: QuickInsertItem) => `${item.title}-${item.description ?? ''}`
		: (item: QuickInsertItem) => item.title;

	const items = providedItems
		? dedupe([...defaultItems, ...providedItems], dedupeFn)
		: defaultItems;

	if (featuredItems) {
		return items.filter((item) => item.featured);
	}

	return find(
		query || '',
		category === 'all' || !category
			? items
			: items.filter((item) => item.categories && item.categories.includes(category)),
		prioritySortingFn,
	);
};

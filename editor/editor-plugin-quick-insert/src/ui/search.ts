import { type QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import { find } from '@atlaskit/editor-common/quick-insert';
import type { QuickInsertSearchOptions } from '@atlaskit/editor-common/types';
import { dedupe } from '@atlaskit/editor-common/utils';

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
	const { query, category, disableDefaultItems, featuredItems, templateItems, prioritySortingFn } =
		searchOptions;
	const defaultItems = disableDefaultItems ? [] : lazyDefaultItems();

	const items = providedItems
		? dedupe([...defaultItems, ...providedItems], (item) => item.title)
		: defaultItems;

	// For platform_editor_element_level_templates experiment only
	// clean up ticket ED-24873
	if (templateItems && featuredItems) {
		return items.filter(
			(item) =>
				[
					'discussionNotes',
					'approvalsTracker',
					'decisionMatrix',
					'actionList',
					'instructionsOutline',
				].includes(item.id ?? '') || item.featured,
		);
	}

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

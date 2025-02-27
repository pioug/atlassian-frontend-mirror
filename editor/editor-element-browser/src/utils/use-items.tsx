import { useMemo, useState } from 'react';

import { makeKeyMapWithCommon } from '@atlaskit/editor-common/keymaps';

import type { InsertPanelItem, QuickInsertPanelItem } from '../types';
import type { GroupData, ItemData } from '../ui/ItemType';

import { getMappedItems } from './get-mapped-items';
import { find } from './search';

const transformBrowserElementItem = (item: InsertPanelItem): ItemData => {
	return {
		index: item.tempKey,
		title: item.title,
		description: item.description,
		showDescription: Boolean(item?.id) && item.id !== 'datasource' ? false : true,
		keyshortcut: item.keyshortcut ? makeKeyMapWithCommon('', item.keyshortcut) : undefined,
		renderIcon: item.icon,
	};
};

// TODO: Title will need to be i18n
type CategoryData = {
	id: string;
	title: string;
	subcategories: { id: string; title: string }[] | [];
	defautltItems: string[] | [];
};
export const CategoriesStructure: CategoryData[] = [
	{
		id: 'media',
		title: 'Media',
		subcategories: [],
		// defaultItems and array or native elements' ids or titles of an extensions
		// TODO: how should we identify extensions in prod?
		// Note: only 'media' or 'media-insert' will be available, so we'll display only 5 default items
		defautltItems: ['media', 'media-insert', 'emoji', 'hyperlink', 'loom', 'Create whiteboard'],
	},
	{
		id: 'structure',
		title: 'Structure',
		subcategories: [
			{ id: 'text structure', title: 'Text structure' },
			{ id: 'page structure', title: 'Page structure' },
			{ id: 'connect pages', title: 'Connect pages' },
			{ id: 'navigation', title: 'Navigation' },
			{ id: 'search', title: 'Search' },
		],
		defautltItems: ['date', 'decision', 'status', 'table', 'Table of contents'],
	},
	{
		id: 'data',
		title: 'Data',
		subcategories: [
			{ id: 'charts', title: 'Charts' },
			{ id: 'gadgets', title: 'Gadgets' },
			{ id: 'jira', title: 'Jira' },
			{ id: 'labels', title: 'Labels' },
			{ id: 'reports', title: 'Reports' },
			{ id: 'timelines', title: 'Timelines' },
		],
		defautltItems: [
			'Create database',
			'Filter by label (Content by label)',
			'Chart',
			'Create Jira issue',
			'Content Report Table',
		],
	},
	{
		id: 'collaborate',
		title: 'Collaborate',
		subcategories: [],
		defautltItems: [
			'mention',
			'Contributors',
			'Contributors Summary',
			'User Profile',
			'Spaces List',
		],
	},
	{ id: 'ai', title: 'Atlassian Intelligence', subcategories: [], defautltItems: [] },
	{ id: 'apps', title: 'Apps', subcategories: [], defautltItems: [] },
];

export const PredefinedCategories = new Map();
CategoriesStructure.forEach((categoryData) => {
	PredefinedCategories.set(categoryData.id, categoryData);

	categoryData.subcategories.forEach((subcategoryData) => {
		PredefinedCategories.set(subcategoryData.id, subcategoryData);
	});
});

const parseCategories = (itemCategories: string[] | undefined): string[] => {
	if (!itemCategories) {
		return ['apps'];
	}

	const filteredCategories = itemCategories.filter((category) => {
		return PredefinedCategories.has(category.toLocaleLowerCase());
	});

	return filteredCategories.length > 0 ? filteredCategories : ['apps'];
};

export interface CategoryRegistry {
	[key: string]: ItemData[];
}

export interface ItemsRegistry {
	[key: string]: ItemData;
}

const suggestedTitels = [
	'Table',
	'Action item',
	'Code snippet',
	'Info panel',
	'Emoji',
	'Layouts',
	'Divider',
	'Expand',
];

// slices items from the QuickInsertPanelItem[] into suggested, categories and search result items
export const useItems = (
	quickInsertPanelItems: QuickInsertPanelItem[],
	query?: string,
): {
	suggested?: GroupData;
	categoryRegistry: CategoryRegistry;
	itemsRegistry: ItemsRegistry;
	selectedCategory?: string;
	searchItems?: ItemData[];
	setSearchText: (searchText: string | undefined) => void;
	setSelectedCategory: (categoryId: string | undefined) => void;
} => {
	const [searchText, setSearchText] = useState<string | undefined>(query);
	const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

	const insertPanelItems = useMemo(
		() => getMappedItems(quickInsertPanelItems),
		[quickInsertPanelItems],
	);

	const suggested: GroupData = insertPanelItems.reduce(
		(acc: GroupData, item) => {
			if (suggestedTitels.includes(item.title)) {
				acc.items.push(transformBrowserElementItem(item));
			}
			return acc;
		},
		{ id: 'suggested', label: 'Suggestions', items: [] }, // TODO define the id and label as constants
	);

	const categoryRegistry: CategoryRegistry = {};
	const itemsRegistry: ItemsRegistry = {};
	insertPanelItems.forEach((item) => {
		const categories = parseCategories(item.categories);
		const preparedItem = transformBrowserElementItem(item);
		categories.forEach((category) => {
			category = category.toLocaleLowerCase();
			if (categoryRegistry[category]) {
				categoryRegistry[category].push(preparedItem);
			} else {
				categoryRegistry[category] = [preparedItem];
			}
		});
		const itemKey = item.id || item.title;
		itemsRegistry[itemKey] = preparedItem;
	});

	// when query gets updated from the prop drilling it won't cause a re-render of the hook
	// as it will be treated only as default state, so for now combinbing searchText and query here
	// we need to find a better more performant solution for the search (after the demo)
	const combinedSearchText = useMemo(() => searchText || query, [query, searchText]);

	const searchItems = useMemo(() => {
		if (!combinedSearchText) {
			return undefined;
		}
		const filteredItems = find(combinedSearchText, insertPanelItems);
		return filteredItems.map((item) => transformBrowserElementItem(item));
	}, [insertPanelItems, combinedSearchText]);

	return {
		suggested,
		categoryRegistry,
		itemsRegistry,
		selectedCategory,
		searchItems,
		setSearchText,
		setSelectedCategory,
	};
};

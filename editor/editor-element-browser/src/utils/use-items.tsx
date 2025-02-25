import { useMemo, useState } from 'react';

import { makeKeyMapWithCommon } from '@atlaskit/editor-common/keymaps';

import type { InsertPanelItem, QuickInsertPanelItem } from '../types';
import type { GroupData, ItemData } from '../ui/ItemType';

import { getMappedItems } from './get-mapped-items';

const transformBrowserElementItem = (item: InsertPanelItem): ItemData => {
	return {
		index: item.index,
		title: item.title,
		description: item.description,
		showDescription: item.showDescription,
		keyshortcut: item.keyshortcut ? makeKeyMapWithCommon('', item.keyshortcut) : undefined,
		attributes: item.attributes,
		renderIcon: item.icon,
	};
};

// slices items from the QuickInsertPanelItem[] into suggested, categories and search result items
export const useItems = (
	quickInsertPanelItems: QuickInsertPanelItem[],
): {
	suggested?: GroupData;
	categories?: GroupData[];
	selectedCategoryItems?: ItemData[];
	searchItems?: ItemData[];
	setSearchText: (searchText: string | undefined) => void;
	setSelectedCategory: (categoryId: string | undefined) => void;
} => {
	const [searchText, setSearchText] = useState<string | undefined>();
	const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

	const insertPanelItems = useMemo(
		() => getMappedItems(quickInsertPanelItems),
		[quickInsertPanelItems],
	);

	const suggested: GroupData = insertPanelItems.reduce(
		(acc: GroupData, item) => {
			if (item.category?.toLowerCase() === 'suggested') {
				acc.items.push(transformBrowserElementItem(item));
			}
			return acc;
		},
		{ id: 'suggested', label: 'Suggested', items: [] }, // TODO Where the label and id should come from?
	);

	const categories: GroupData[] = insertPanelItems.reduce((acc: GroupData[], item) => {
		const categoryName: string = item.category || 'Uncategorised';
		if (categoryName?.toLowerCase() !== 'suggested') {
			const category = acc.find((category) => category.id === categoryName);
			if (category) {
				category.items.push(transformBrowserElementItem(item));
			} else {
				acc.push({
					id: categoryName, // TODO - is this good enough?
					label: categoryName,
					items: [transformBrowserElementItem(item)],
				});
			}
		}
		return acc;
	}, []);

	const selectedCategoryItems = useMemo(() => {
		if (!selectedCategory) {
			return undefined;
		}
		return categories.find((category) => category.id === selectedCategory)?.items;
	}, [categories, selectedCategory]);

	const searchItems = useMemo(() => {
		if (!searchText) {
			return undefined;
		}
		// TODO - this is a very basic search, this needs to be replaced by search from ./search.tsx
		const filteredItems = insertPanelItems.filter((item) =>
			item.title?.toLowerCase().includes(searchText.toLowerCase()),
		);
		return filteredItems.map((item) => transformBrowserElementItem(item));
	}, [insertPanelItems, searchText]);

	return {
		suggested,
		categories,
		selectedCategoryItems,
		searchItems,
		setSearchText,
		setSelectedCategory,
	};
};

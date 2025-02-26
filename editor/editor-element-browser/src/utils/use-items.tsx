import { useMemo, useState } from 'react';

import { makeKeyMapWithCommon } from '@atlaskit/editor-common/keymaps';

import type { InsertPanelItem, QuickInsertPanelItem } from '../types';
import type { GroupData, ItemData } from '../ui/ItemType';

import { getMappedItems } from './get-mapped-items';
import { find } from './search';

const transformBrowserElementItem = (item: InsertPanelItem): ItemData => {
	return {
		index: item.index,
		title: item.title,
		description: item.description,
		showDescription: item.showDescription,
		keyshortcut: item.keyshortcut ? makeKeyMapWithCommon('', item.keyshortcut) : undefined,
		attributes: { new: item.isNew },
		renderIcon: item.icon,
	};
};

const capitalizeFirstLetter = (val: string) => {
	return String(val).charAt(0).toUpperCase() + String(val).slice(1);
};

// slices items from the QuickInsertPanelItem[] into suggested, categories and search result items
export const useItems = (
	quickInsertPanelItems: QuickInsertPanelItem[],
): {
	suggested?: GroupData;
	topFiveItemsByCategory?: GroupData[];
	selectedCategoryItems?: GroupData;
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
			if (item.isSuggested) {
				acc.items.push(transformBrowserElementItem(item));
			}
			return acc;
		},
		{ id: 'suggested', label: 'Suggested', items: [] }, // TODO define the id and label as constants
	);

	const categories: GroupData[] = insertPanelItems.reduce((acc: GroupData[], item) => {
		const category: string = item.category || 'Uncategorised';
		if (!item.isSuggested) {
			const categoryData = acc.find((groupData) => groupData.id === category);
			if (categoryData) {
				categoryData.items.push(transformBrowserElementItem(item));
			} else {
				acc.push({
					id: category,
					label: capitalizeFirstLetter(category),
					items: [transformBrowserElementItem(item)],
				});
			}
		}
		return acc;
	}, []);

	const topFiveItemsByCategory = useMemo(() => {
		return categories.map((category) => {
			const topFiveItems = category.items.slice(0, 5); // TODO - needs better algorithm for identifying top five items
			return {
				...category,
				items: topFiveItems,
			};
		});
	}, [categories]);

	const selectedCategoryItems = useMemo(() => {
		if (!selectedCategory) {
			return undefined;
		}
		return categories.find((category) => category.id === selectedCategory) || undefined;
	}, [categories, selectedCategory]);

	const searchItems = useMemo(() => {
		if (!searchText) {
			return undefined;
		}
		const filteredItems = find(searchText, insertPanelItems);
		return filteredItems.map((item) => transformBrowserElementItem(item));
	}, [insertPanelItems, searchText]);

	return {
		suggested,
		topFiveItemsByCategory,
		selectedCategoryItems,
		searchItems,
		setSearchText,
		setSelectedCategory,
	};
};

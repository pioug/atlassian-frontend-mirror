import React, { useCallback } from 'react';

import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import { Stack } from '@atlaskit/primitives/compiled';

import type { SideInsertPanelProps } from '../types';
import { CategoriesStructure, useItems, PredefinedCategories } from '../utils/use-items';
import type { CategoryRegistry, ItemsRegistry } from '../utils/use-items';

import { ExpandablePanel } from './ExpandablePanel';
import { IconButtonGroup } from './IconButtonGroup';
import type { GroupData, ItemData } from './ItemType';
import { ListButtonGroup, ListButtonGroupWithHeading } from './ListButtonGroup';
import { SearchPanel } from './SearchPanel';
import { SubPanelWithBackButton } from './SubPanel';

const DefaultView = ({
	suggested,
	itemsRegistry,
	categoryRegistry,
	onItemSelected,
	onCategorySelected,
}: {
	categoryRegistry: CategoryRegistry;
	itemsRegistry: ItemsRegistry;
	onCategorySelected: (categoryId: string) => void;
	onItemSelected: (index: number) => void;
	suggested?: GroupData;
}) => {
	return (
		<Stack>
			{suggested && (
				<IconButtonGroup
					id={suggested.id}
					items={suggested.items}
					label={suggested.label}
					onItemSelected={onItemSelected}
				/>
			)}
			{CategoriesStructure.map((category, i) => {
				const { defautltItems } = category;
				const items =
					defautltItems.length > 0
						? defautltItems
								.map((itemIdOrTitle) => itemsRegistry[itemIdOrTitle])
								.filter((item) => item)
						: categoryRegistry[category.id]
							? categoryRegistry[category.id].slice(0, 5)
							: [];

				const shoudldShowSeparator = i === 0 && !suggested ? false : true;

				return (
					items.length > 0 && (
						<ExpandablePanel
							key={category.id}
							id={category.id}
							label={category.title}
							items={items}
							hasSeparator={shoudldShowSeparator}
							onItemSelected={onItemSelected}
							onViewAllSelected={onCategorySelected}
						/>
					)
				);
			})}
		</Stack>
	);
};

const CategoryView = ({
	categoryRegistry,
	selectedCategory,
	onItemSelected,
	onBackButtonClicked,
}: {
	categoryRegistry: CategoryRegistry;
	onBackButtonClicked: () => void;
	onItemSelected: (index: number) => void;
	selectedCategory: string;
}) => {
	const categoryData = PredefinedCategories.get(selectedCategory);

	const categoryLevelItems = categoryRegistry[selectedCategory] || [];

	return (
		<Stack>
			<SubPanelWithBackButton
				label={categoryData.title}
				buttonLabel="Back to all items"
				onClick={onBackButtonClicked}
			>
				{categoryLevelItems.length > 0 && (
					<ListButtonGroup
						id={categoryData.id}
						items={categoryLevelItems}
						onItemSelected={onItemSelected}
					/>
				)}
				{categoryData &&
					categoryData.subcategories.map(({ id, title }: { id: string; title: string }) => {
						return (
							categoryRegistry[id] && (
								<ListButtonGroupWithHeading
									id={id}
									label={title}
									items={categoryRegistry[id]}
									onItemSelected={onItemSelected}
								/>
							)
						);
					})}
			</SubPanelWithBackButton>
		</Stack>
	);
};

const SearchView = ({
	items,
	onItemSelected,
}: {
	items: ItemData[];
	onItemSelected: (index: number) => void;
}) => {
	return <ListButtonGroup id={'search'} items={items} onItemSelected={onItemSelected} />;
};

export const SideInsertPanel = ({ items, onItemInsert }: SideInsertPanelProps) => {
	const onItemSelect = useCallback(
		(index: number) => {
			onItemInsert(SelectItemMode.SELECTED, index);
		},
		[onItemInsert],
	);

	const {
		categoryRegistry,
		itemsRegistry,
		selectedCategory,
		searchItems,
		setSearchText,
		setSelectedCategory,
	} = useItems(items);

	const view = searchItems ? (
		<SearchView items={searchItems} onItemSelected={onItemSelect} />
	) : selectedCategory ? (
		<CategoryView
			categoryRegistry={categoryRegistry}
			selectedCategory={selectedCategory}
			onItemSelected={onItemSelect}
			onBackButtonClicked={() => setSelectedCategory(undefined)}
		/>
	) : (
		<DefaultView
			suggested={undefined}
			itemsRegistry={itemsRegistry}
			categoryRegistry={categoryRegistry}
			onItemSelected={onItemSelect}
			onCategorySelected={(categoryId) => {
				setSelectedCategory(categoryId);
			}}
		/>
	);

	return (
		<Stack>
			<SearchPanel
				onChange={(event) => {
					setSearchText((event.target as HTMLInputElement).value);
				}}
			/>
			{view}
		</Stack>
	);
};

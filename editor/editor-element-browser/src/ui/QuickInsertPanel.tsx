import React, { memo, useCallback } from 'react';

import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import Section from '@atlaskit/menu/section';
import { Box, Stack, Text, xcss } from '@atlaskit/primitives';

import type { OnSelectItem, QuickInsertPanelProps } from '../types';
import {
	CategoriesStructure,
	type CategoryRegistry,
	type ItemsRegistry,
	PredefinedCategories,
	useItems,
} from '../utils/use-items';

import type { GroupData, ItemData } from './ItemType';
import { ListButtonGroup, ListButtonGroupWithHeading } from './ListButtonGroup';
import { LinkNavButton } from './NavigationButton';
import { SubPanelWithBackButton } from './SubPanel';

const navButtonContainerStyles = xcss({
	paddingTop: 'space.0',
	paddingBottom: 'space.0',
	paddingLeft: 'space.200',
	paddingRight: 'space.200',
});

const DefaultView = ({
	suggested,
	itemsRegistry,
	categoryRegistry,
	onItemSelected,
	onCategorySelected,
	setSelectedItem,
}: {
	suggested?: GroupData;
	itemsRegistry: ItemsRegistry;
	categoryRegistry: CategoryRegistry;
	onItemSelected: (index: number) => void;
	onCategorySelected: (categoryId: string) => void;
	setSelectedItem?: OnSelectItem;
}) => {
	return (
		<Stack>
			{suggested && (
				<ListButtonGroupWithHeading
					id={suggested.id}
					items={suggested.items}
					label={suggested.label}
					onItemSelected={onItemSelected}
					setSelectedItem={setSelectedItem}
				/>
			)}
			{CategoriesStructure.map((category) => {
				const { defautltItems } = category;
				const items =
					defautltItems.length > 0
						? defautltItems
								.map((itemIdOrTitle) => itemsRegistry[itemIdOrTitle])
								.filter((item) => item)
						: categoryRegistry[category.id]
							? categoryRegistry[category.id].slice(0, 5)
							: [];

				return (
					items.length > 0 && (
						<Section key={category.id} hasSeparator>
							<Box xcss={navButtonContainerStyles}>
								<LinkNavButton
									id={category.id}
									label={category.title}
									onClick={onCategorySelected}
								/>
							</Box>
						</Section>
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
	selectedCategory: string;
	onItemSelected: (index: number) => void;
	onBackButtonClicked: () => void;
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
	setSelectedItem,
}: {
	items: ItemData[];
	onItemSelected: (index: number) => void;
	setSelectedItem?: OnSelectItem;
}) => {
	return (
		<ListButtonGroup
			id={'search'}
			items={items}
			onItemSelected={onItemSelected}
			setSelectedItem={setSelectedItem}
		/>
	);
};

const EmptySearchView = () => {
	return (
		<Stack>
			<Text align="center" as="p">
				We couldn't find any results.
			</Text>
			<Text align="center" as="p">
				Select <Text weight="medium">View all</Text> to browser inserts.
			</Text>
		</Stack>
	);
};

export const QuickInsertPanel = memo(
	({ items, onItemInsert, query, setSelectedItem }: QuickInsertPanelProps) => {
		const onItemSelect = useCallback(
			(index: number) => {
				onItemInsert(SelectItemMode.SELECTED, index);
			},
			[onItemInsert],
		);

		const {
			suggested,
			categoryRegistry,
			itemsRegistry,
			selectedCategory,
			searchItems,
			setSelectedCategory,
		} = useItems(items, query);

		return searchItems ? (
			searchItems.length > 0 ? (
				<SearchView
					items={searchItems}
					onItemSelected={onItemSelect}
					setSelectedItem={setSelectedItem}
				/>
			) : (
				<EmptySearchView />
			)
		) : selectedCategory ? (
			<CategoryView
				categoryRegistry={categoryRegistry}
				selectedCategory={selectedCategory}
				onItemSelected={onItemSelect}
				onBackButtonClicked={() => setSelectedCategory(undefined)}
			/>
		) : (
			<DefaultView
				suggested={suggested}
				itemsRegistry={itemsRegistry}
				categoryRegistry={categoryRegistry}
				onItemSelected={onItemSelect}
				onCategorySelected={(categoryId) => {
					setSelectedCategory(categoryId);
				}}
				setSelectedItem={setSelectedItem}
			/>
		);
	},
);

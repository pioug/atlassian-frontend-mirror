/* eslint-disable @atlassian/i18n/no-literal-string-in-jsx */
import React, { memo, useCallback } from 'react';

import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import Section from '@atlaskit/menu/section';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
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
import { ViewAllButtonItem } from './ListButtonItem';
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
	categoryRegistry: CategoryRegistry;
	itemsRegistry: ItemsRegistry;
	onCategorySelected: (categoryId: string) => void;
	onItemSelected: (index: number) => void;
	setSelectedItem?: OnSelectItem;
	suggested?: GroupData;
}) => {
	return (
		<Stack>
			{suggested && (
				<ListButtonGroupWithHeading
					id={suggested.id}
					items={suggested.items.slice(0, 6)}
					label={suggested.label}
					onItemSelected={onItemSelected}
					setSelectedItem={setSelectedItem}
					startingIndex={0}
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
	onBackButtonClicked: () => void;
	onItemSelected: (index: number) => void;
	selectedCategory: string;
}) => {
	const categoryData = PredefinedCategories.get(selectedCategory);

	const categoryLevelItems = categoryRegistry[selectedCategory] || [];

	let startingIndex = categoryLevelItems.length;

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
						startingIndex={0}
					/>
				)}
				{categoryData &&
					categoryData.subcategories.map(({ id, title }: { id: string; title: string }) => {
						if (categoryRegistry[id]) {
							const list = (
								<ListButtonGroupWithHeading
									id={id}
									label={title}
									items={categoryRegistry[id]}
									onItemSelected={onItemSelected}
									startingIndex={startingIndex}
								/>
							);
							startingIndex += categoryRegistry[id].length;

							return list;
						}
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
			startingIndex={0}
		/>
	);
};

const EmptySearchView = () => {
	return (
		<Box padding="space.300">
			<Stack space="space.0">
				<Text align="center" as="p">
					We couldn't find any results.
				</Text>
				<Text align="center" as="p">
					Select <Text weight="medium">View all</Text> to browser inserts.
				</Text>
			</Stack>
		</Box>
	);
};

export const QuickInsertPanel = memo(
	({ items, onItemInsert, onViewAllItemsClick, query, setSelectedItem }: QuickInsertPanelProps): React.JSX.Element => {
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

		const showViewAllItems = Boolean(onViewAllItemsClick);

		const view = searchItems ? (
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

		if (showViewAllItems) {
			return (
				<>
					{view}
					{showViewAllItems && (
						<ViewAllButtonItem
							isViewAllInserts={true}
							label={'View all inserts'} // TODO: ED-26961 - add i18n
							onClick={onViewAllItemsClick ? onViewAllItemsClick : () => {}}
						/>
					)}
				</>
			);
		} else {
			return view;
		}
	},
);

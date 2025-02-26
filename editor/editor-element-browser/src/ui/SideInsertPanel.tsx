import React, { useCallback } from 'react';

import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import { Stack } from '@atlaskit/primitives';

import type { SideInsertPanelProps } from '../types';
import { useItems } from '../utils/use-items';

import { ExpandablePanel } from './ExpandablePanel';
import { IconButtonGroup } from './IconButtonGroup';
import type { GroupData, ItemData } from './ItemType';
import { ListButtonGroup } from './ListButtonGroup';
import { SearchPanel } from './SearchPanel';
import { SubPanelWithBackButton } from './SubPanel';

const DefaultView = ({
	suggested,
	categories,
	onItemSelected,
	onCategorySelected,
}: {
	suggested?: GroupData;
	categories?: GroupData[];
	onItemSelected: (index: number) => void;
	onCategorySelected: (categoryId: string) => void;
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
			{categories &&
				categories.map((category) => {
					return (
						<ExpandablePanel
							key={category.id}
							id={category.id}
							label={category.label}
							items={category.items}
							hasSeparator
							onItemSelected={onItemSelected}
							onViewAllSelected={onCategorySelected}
						/>
					);
				})}
		</Stack>
	);
};

const CategoryView = ({
	category,
	onItemSelected,
	onBackButtonClicked,
}: {
	category: GroupData;
	onItemSelected: (index: number) => void;
	onBackButtonClicked: () => void;
}) => {
	return (
		<Stack>
			<SubPanelWithBackButton
				label={category.label}
				buttonLabel="Back to all items"
				onClick={onBackButtonClicked}
			>
				<ListButtonGroup id={category.id} items={category.items} onItemSelected={onItemSelected} />
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

export const SideInsertPanelNew = ({ items, onItemInsert }: SideInsertPanelProps) => {
	const onItemSelect = useCallback(
		(index: number) => {
			onItemInsert(SelectItemMode.SELECTED, index);
		},
		[onItemInsert],
	);

	const {
		suggested,
		topFiveItemsByCategory,
		selectedCategoryItems,
		searchItems,
		setSearchText,
		setSelectedCategory,
	} = useItems(items);

	const view = searchItems ? (
		<SearchView items={searchItems} onItemSelected={onItemSelect} />
	) : selectedCategoryItems ? (
		<CategoryView
			category={selectedCategoryItems}
			onItemSelected={onItemSelect}
			onBackButtonClicked={() => setSelectedCategory(undefined)}
		/>
	) : (
		<DefaultView
			suggested={suggested}
			categories={topFiveItemsByCategory}
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

export const SideInsertPanel = ({ items, onItemInsert }: SideInsertPanelProps) => {
	return <div>Editor Controls Side panel</div>;
};

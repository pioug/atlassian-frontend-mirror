import React, { useCallback } from 'react';

import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import { Stack, xcss } from '@atlaskit/primitives';
import Textfield from '@atlaskit/textfield';

import type { SideInsertPanelProps } from '../types';
import { useItems } from '../utils/use-items';

import { ExpandablePanel } from './ExpandablePanel';
import { IconButtonGroup } from './IconButtonGroup';
import type { GroupData, ItemData } from './ItemType';
import { ListButtonGroup } from './ListButtonGroup';
import { SubPanelWithBackButton } from './SubPanel';

const styles = xcss({
	borderTop: 0,
	borderBottom: '1px',
	borderRight: 0,
	borderLeft: 0,
	borderBlockColor: 'color.border',
	borderBlockStyle: 'solid',
});

type OnChangeType = React.ComponentProps<typeof Textfield>['onChange'];

// TODO - polish and possible move to it's own file
const SearchPanel = ({ onChange }: { onChange: OnChangeType }) => {
	return (
		<Textfield
			name="search"
			id="search-textfield"
			placeholder="Find or describe"
			onChange={onChange}
		/>
	);
};

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
					xcss={styles}
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
							onItemSelected={onItemSelected}
							onViewAllSelected={onCategorySelected}
							xcss={styles}
						/>
					);
				})}
		</Stack>
	);
};

const CategoryView = ({
	items,
	onItemSelected,
	onBackButtonClicked,
}: {
	items: ItemData[];
	onItemSelected: (index: number) => void;
	onBackButtonClicked: () => void;
}) => {
	return (
		<Stack>
			<SubPanelWithBackButton
				label={'Media'}
				buttonLabel="Back to all items"
				onClick={onBackButtonClicked}
			>
				<ListButtonGroup id="media" items={items} onItemSelected={onItemSelected} />
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

// TODO
//  - polish the UI
//  - add support for sub-categories
export const SideInsertPanelNew = ({ items, onItemInsert }: SideInsertPanelProps) => {
	const onItemSelect = useCallback(
		(index: number) => {
			onItemInsert(SelectItemMode.SELECTED, index);
		},
		[onItemInsert],
	);

	const {
		suggested,
		categories,
		selectedCategoryItems,
		searchItems,
		setSearchText,
		setSelectedCategory,
	} = useItems(items);

	const view = searchItems ? (
		<SearchView items={searchItems} onItemSelected={onItemSelect} />
	) : selectedCategoryItems ? (
		<CategoryView
			items={selectedCategoryItems}
			onItemSelected={onItemSelect}
			onBackButtonClicked={() => setSelectedCategory(undefined)}
		/>
	) : (
		<DefaultView
			suggested={suggested}
			categories={categories}
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

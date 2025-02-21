import React from 'react';

import { makeKeyMapWithCommon } from '@atlaskit/editor-common/keymaps';
import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import { Box, Stack, Text } from '@atlaskit/primitives';

import { find } from '../search';
import type { QuickInsertPanelProps, InsertPanelItem } from '../types';
import { getMappedItems } from '../utils';

import { ListButtonItem } from './ListButtonItem';

export const QuickInsertPanel = ({ items, onItemInsert, query }: QuickInsertPanelProps) => {
	const mappedItems = getMappedItems(items);

	// Search
	if (query !== '') {
		const resutls = find(query, mappedItems);
		return resutls.length > 0 ? (
			<Stack>
				{resutls.map((item: InsertPanelItem) => {
					if (item.shouldDisplay !== false) {
						return (
							<ListButtonItem
								key={item.tempKey}
								index={item.tempKey}
								title={item.title}
								description={item.description}
								keyshortcut={
									item.keyshortcut ? makeKeyMapWithCommon('', item.keyshortcut) : undefined
								}
								isSelected={item.isSelected}
								attributes={item.attributes}
								showDescription={!item.id}
								renderIcon={item.icon}
								onItemSelected={() => onItemInsert(SelectItemMode.SELECTED, item.tempKey)}
							/>
						);
					}
				})}
			</Stack>
		) : (
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
	}

	//  Main panel
	const structureItems = [];
	const dataItems = [];
	const apps = [];
	for (let i = 0; i < mappedItems.length; i++) {
		if (mappedItems[i].category === 'structure') {
			structureItems.push(mappedItems[i]);
		} else if (mappedItems[i].category === 'data') {
			dataItems.push(mappedItems[i]);
		} else {
			apps.push(mappedItems[i]);
		}
	}

	return mappedItems.length > 0 ? (
		<>
			<Stack>
				{structureItems.map((item) => {
					if (item.shouldDisplay !== false) {
						return (
							<ListButtonItem
								key={item.tempKey}
								index={item.tempKey}
								title={item.title}
								description={item.description}
								keyshortcut={
									item.keyshortcut ? makeKeyMapWithCommon('', item.keyshortcut) : undefined
								}
								isSelected={item.isSelected}
								attributes={item.attributes}
								showDescription={!item.id}
								renderIcon={item.icon}
								onItemSelected={() => onItemInsert(SelectItemMode.SELECTED, item.tempKey)}
							/>
						);
					}
				})}
			</Stack>
			<Stack>
				{dataItems.map((item) => {
					if (item.shouldDisplay !== false) {
						return (
							<ListButtonItem
								key={item.tempKey}
								index={item.tempKey}
								title={item.title}
								description={item.description}
								keyshortcut={
									item.keyshortcut ? makeKeyMapWithCommon('', item.keyshortcut) : undefined
								}
								isSelected={item.isSelected}
								attributes={item.attributes}
								showDescription={!item.id}
								renderIcon={item.icon}
								onItemSelected={() => onItemInsert(SelectItemMode.SELECTED, item.tempKey)}
							/>
						);
					}
				})}
			</Stack>
		</>
	) : null;
};

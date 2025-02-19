import React from 'react';

import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import { Pressable, Stack } from '@atlaskit/primitives';

import type { QuickInsertPanelProps } from '../types';
import { getMappedItems } from '../utils';

export const QuickInsertPanel = ({ items, onItemInsert }: QuickInsertPanelProps) => {
	const mappedItems = getMappedItems(items);

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

	return (
		<>
			<Stack>
				{structureItems.map((item) => {
					return (
						<Pressable
							key={item.tempKey}
							onClick={() => onItemInsert(SelectItemMode.SELECTED, item.tempKey)}
						>{`${item.tempKey} ${item.title}`}</Pressable>
					);
				})}
			</Stack>
			<div>-------</div>
			<Stack>
				{dataItems.map((item) => {
					return (
						<Pressable
							key={item.tempKey}
							onClick={() => onItemInsert(SelectItemMode.SELECTED, item.tempKey)}
						>{`${item.tempKey} ${item.title}`}</Pressable>
					);
				})}
			</Stack>
		</>
	);
};

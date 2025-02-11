import React from 'react';

import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';

import type { QuickInsertPanelProps } from '../types';

export const QuickInsertPanel = ({ items, onItemInsert }: QuickInsertPanelProps) => {
	return (
		<div>
			{items.map((item, i) => {
				return (
					<button
						type="button"
						key={item.key}
						onClick={() => onItemInsert(SelectItemMode.SELECTED, i)}
					>{`${i} ${item.title}`}</button>
				);
			})}
		</div>
	);
};

import React, { useState } from 'react';

import { DynamicTableStateless } from '@atlaskit/dynamic-table';
import { type SortOrderType } from '@atlaskit/dynamic-table/types';

import { head as baseHead, caption, rows } from './content/sample-data';

const head = {
	...baseHead,
	cells: baseHead.cells.map((cell) => {
		switch (cell.key) {
			case 'name':
				return {
					...cell,
					ascendingSortTooltip: 'Sort A to Z',
					descendingSortTooltip: 'Sort Z to A',
					buttonAriaRoleDescription: 'Sort by name',
				};
			case 'term':
				return {
					...cell,
					ascendingSortTooltip: 'Sort oldest to newest',
					descendingSortTooltip: 'Sort newest to oldest',
					buttonAriaRoleDescription: 'Sort by term button',
				};
			default:
				return cell;
		}
	}),
};

type HeadCell = (typeof head)['cells'][number];

const SortingWithCustomLabelsExample = () => {
	const [sortOrder, setSortOrder] = useState<SortOrderType>('ASC');
	const [sortKey, setSortKey] = useState<HeadCell['key']>('name');

	const onSort = ({ key, sortOrder }: any) => {
		setSortKey(key);
		setSortOrder(sortOrder);
	};

	return (
		<DynamicTableStateless
			caption={caption}
			head={head}
			rows={rows}
			rowsPerPage={10}
			isFixedSize
			sortKey={sortKey}
			sortOrder={sortOrder}
			onSort={onSort}
		/>
	);
};

export default SortingWithCustomLabelsExample;

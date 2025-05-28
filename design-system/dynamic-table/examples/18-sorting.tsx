import React, { type FC } from 'react';

import DynamicTable from '@atlaskit/dynamic-table';

const caption = 'Example sorting with DynamicTable';

const head = {
	cells: [
		{
			key: 'number',
			content: 'Number',
			isSortable: true,
		},
		{
			key: 'string',
			content: 'String',
			isSortable: true,
		},
	],
};

const rows = [
	[1, 'd'],
	[2, 'c'],
	[3, 'a'],
	[4, 'b'],
].map(([number, letter]) => ({
	key: number.toString(),
	cells: [
		{
			key: number,
			content: number,
		},
		{
			key: letter,
			content: letter,
		},
	],
}));

const SortingExample: FC = () => (
	// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
	<div style={{ maxWidth: 800 }}>
		<DynamicTable
			caption={caption}
			head={head}
			rows={rows}
			isFixedSize
			defaultSortKey="number"
			defaultSortOrder="ASC"
		/>
	</div>
);

export default SortingExample;

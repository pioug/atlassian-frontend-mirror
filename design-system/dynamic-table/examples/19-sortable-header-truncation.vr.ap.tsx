/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';

import { DynamicTableStateless } from '@atlaskit/dynamic-table';

const longHeader = 'A sortable header label that should visibly truncate';

const tableContainerStyles = css({ maxWidth: '240px' });

const rows = [
	{
		key: 'row',
		cells: [
			{
				key: 'value',
				content: longHeader,
			},
		],
	},
];

const createHead = (shouldTruncate: boolean) => ({
	cells: [
		{
			key: 'value',
			content: longHeader,
			isSortable: true,
			shouldTruncate,
			width: 15,
		},
	],
});

const SortableHeaderTruncationExample = (): React.JSX.Element => (
	<React.Fragment>
		<div css={tableContainerStyles}>
			<DynamicTableStateless
				caption="Truncating sortable header"
				head={createHead(true)}
				isFixedSize
				rows={rows}
				rowsPerPage={1}
			/>
		</div>
		<div css={tableContainerStyles}>
			<DynamicTableStateless
				caption="Non-truncating sortable header"
				head={createHead(false)}
				isFixedSize
				rows={rows}
				rowsPerPage={1}
			/>
		</div>
	</React.Fragment>
);

export default SortableHeaderTruncationExample;

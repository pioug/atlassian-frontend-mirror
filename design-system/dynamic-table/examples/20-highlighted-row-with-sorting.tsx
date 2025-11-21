import React from 'react';

import DynamicTable from '@atlaskit/dynamic-table';

import { head, rows } from './content/sample-data';

const rowsWithHighlightedRow = [...rows];
rowsWithHighlightedRow[6].isHighlighted = true;

export default (): React.JSX.Element => (
	<DynamicTable
		head={head}
		rows={rowsWithHighlightedRow}
		rowsPerPage={10}
		page={1}
		testId="the-table"
	/>
);

import React, { useState } from 'react';

import { DynamicTableStateless } from '@atlaskit/dynamic-table';
import type { RowType } from '@atlaskit/dynamic-table/types';

import { rows as allRows, head } from './content/sample-data';

const rows = allRows.slice(0, 10);

const extendRows = (
	rows: Array<RowType>,
	onClick: (e: React.MouseEvent, rowIndex: number) => void,
) => {
	return rows.map((row, index) => ({
		...row,
		onClick: (e: React.MouseEvent) => onClick(e, index),
	}));
};

function RegularStatelessExample() {
	const [highlightedRowIndex, setHighlightedRowIndex] = useState<number[]>([]);

	const onRowClick = (_e: React.MouseEvent, rowIndex: number) => {
		setHighlightedRowIndex((prevHighlightedRowIndex) => {
			const newHighlightedRowIndex = [...(prevHighlightedRowIndex || [])];
			const existingIndex = newHighlightedRowIndex.indexOf(rowIndex);
			if (existingIndex > -1) {
				newHighlightedRowIndex.splice(existingIndex, 1);
			} else {
				newHighlightedRowIndex.push(rowIndex);
			}
			return newHighlightedRowIndex;
		});
	};

	return (
		<DynamicTableStateless
			head={head}
			highlightedRowIndex={highlightedRowIndex}
			rows={extendRows(rows, onRowClick)}
		/>
	);
}

export default (): React.JSX.Element => {
	return (
		<>
			{/* eslint-disable-next-line @atlaskit/design-system/no-html-heading */}
			<h4>Click in a row to highlight it</h4>
			<RegularStatelessExample />
		</>
	);
};

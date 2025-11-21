import React, { useState } from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/new';
import { DynamicTableStateless } from '@atlaskit/dynamic-table';
import { token } from '@atlaskit/tokens';

import { head, rows } from './content/sample-data';

const paddingStyle = { padding: `${token('space.100', '8px')} 0` };

// eslint-disable-next-line import/no-anonymous-default-export
export default function HighlightedRowsExample(): React.JSX.Element {
	const [highlightedRows, setHighlightedRows] = useState<number[]>([3]);

	const toggleHighlightedRow = (rowNumber: number) => {
		setHighlightedRows((prevHighlightedRows) => {
			const newHighlightedRowIndex = [...prevHighlightedRows];
			const existingIndex = newHighlightedRowIndex.indexOf(rowNumber);
			if (existingIndex > -1) {
				newHighlightedRowIndex.splice(existingIndex, 1);
			} else {
				newHighlightedRowIndex.push(rowNumber);
			}
			return newHighlightedRowIndex;
		});
	};

	return (
		<>
			<p id="row-highlight-control" style={paddingStyle}>
				Select a button to highlight its' corresponding row
			</p>
			<ButtonGroup titleId="row-highlight-control">
				{[0, 2, 5, 6, 8, 9].map((rowIndex) => (
					<Button onClick={() => toggleHighlightedRow(rowIndex)} key={rowIndex}>
						{/* Needs to be this, because a raw `0` number won't render anything */}
						{`${rowIndex}`}
					</Button>
				))}
			</ButtonGroup>
			<DynamicTableStateless
				head={head}
				highlightedRowIndex={highlightedRows}
				rows={rows}
				rowsPerPage={10}
				page={1}
			/>
		</>
	);
}

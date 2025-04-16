import React from 'react';

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

interface StatelessState {
	highlightedRowIndex?: number[];
}

class RegularStatelessExample extends React.Component<{}, StatelessState> {
	state = {
		highlightedRowIndex: [],
	};

	onRowClick = (e: React.MouseEvent, rowIndex: number) => {
		this.setState(({ highlightedRowIndex }) => {
			const newHighlightedRowIndex = [...(highlightedRowIndex || [])];
			const existingIndex = newHighlightedRowIndex.indexOf(rowIndex);
			if (existingIndex > -1) {
				newHighlightedRowIndex.splice(existingIndex, 1);
			} else {
				newHighlightedRowIndex.push(rowIndex);
			}
			return { highlightedRowIndex: newHighlightedRowIndex };
		});
	};

	render() {
		return (
			<DynamicTableStateless
				head={head}
				highlightedRowIndex={this.state.highlightedRowIndex}
				rows={extendRows(rows, this.onRowClick)}
			/>
		);
	}
}

export default () => {
	return (
		<>
			<h4>Click in a row to highlight it</h4>
			<RegularStatelessExample />
		</>
	);
};

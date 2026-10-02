import React from 'react';

import { TableBodyCell } from '../styled/table-cell';
import { TableBodyRow } from '../styled/table-row';
import { type HeadType, type RowType } from '../types';

interface RowProps {
	head?: HeadType;
	isFixedSize: boolean;
	isHighlighted?: boolean;
	row: RowType;
	testId?: string;
}

const Row = ({ row, head, testId, isFixedSize, isHighlighted }: RowProps): React.JSX.Element => {
	// `key` is pulled out so it isn't spread into JSX (React 19 warns about that). The parent
	// already applies it to this row, and each cell gets an explicit `key` below.
	const { cells, key: rowKey, ...restRowProps } = row;

	return (
		<TableBodyRow
			{...restRowProps}
			isHighlighted={isHighlighted}
			{...(isHighlighted ? { 'data-ts--dynamic-table--table-row--highlighted': true } : null)}
			testId={row.testId || (testId && `${testId}--row-${rowKey}`)}
		>
			{cells.map((cell, cellIndex) => {
				const { content, testId: cellTestId, key: _cellKey, ...restCellProps } = cell;
				const { shouldTruncate, width } = (head || { cells: [] }).cells[cellIndex] || ({} as any);

				return (
					<TableBodyCell
						data-testid={cellTestId || (testId && `${testId}--cell-${cellIndex}`)}
						{...restCellProps}
						isFixedSize={isFixedSize}
						key={cellIndex}
						shouldTruncate={shouldTruncate}
						width={width}
					>
						{content}
					</TableBodyCell>
				);
			})}
		</TableBodyRow>
	);
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Row;

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
	const { cells, ...restRowProps } = row;

	return (
		<TableBodyRow
			{...restRowProps}
			isHighlighted={isHighlighted}
			{...(isHighlighted ? { 'data-ts--dynamic-table--table-row--highlighted': true } : null)}
			testId={row.testId || (testId && `${testId}--row-${restRowProps.key}`)}
		>
			{cells.map((cell, cellIndex) => {
				const { content, testId: cellTestId, ...restCellProps } = cell;
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

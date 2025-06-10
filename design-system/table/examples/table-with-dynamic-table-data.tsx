import React from 'react';

import Table, { Cell, HeadCell, Row, SortableColumn, TBody, THead } from '@atlaskit/table';

import { head, rows } from './content/dynamic-table-data';

/**
 * Example use case of the full 'data table' using 'dynamic table data'.
 *
 * FIXME: sorting seems to be broken on this example, but works fine in `examples/basic-with-actions.tsx`
 * Every column seems to sort by 'term'
 */
export default function Basic() {
	return (
		<Table testId="table">
			<THead>
				{head.cells.map((cell) => {
					const Component = cell.isSortable ? SortableColumn : HeadCell;
					return <Component name={cell.key}>{cell.content}</Component>;
				})}
			</THead>
			<TBody rows={rows}>
				{(row) => (
					<Row {...row} key={row.key}>
						{row.cells.map((cell) => (
							<Cell key={cell.key}>{cell.content}</Cell>
						))}
					</Row>
				)}
			</TBody>
		</Table>
	);
}

import React, { Children, type ReactElement, useEffect, useMemo } from 'react';

import { useSelection } from './hooks/selection-provider';
import { RowProvider } from './hooks/use-row-id';
import { useTable } from './hooks/use-table';
import { TableBodyProvider } from './hooks/use-table-body';
import { TBody as TBodyPrimitive } from './ui';

type BodyProps<Item extends object> =
	| {
			rows: Item[];
			children: (row: Item) => ReactElement;
	  }
	| {
			rows?: never;
			children: ReactElement[] | ReactElement;
	  };

/**
 * __Table body__
 */
function TBody<ObjectType extends object>({ rows, children }: BodyProps<ObjectType>) {
	const { sortFn } = useTable<ObjectType>();
	const [_state, { removeAll, setMax }] = useSelection();
	// TODO: this seems like something the user should control or opt into.
	useEffect(() => {
		removeAll?.();
		// eslint-disable-next-line react-hooks/exhaustive-deps -- When the rows change, we [currently] want to call removeAll.
	}, [rows]);

	const childrenCount = Children.count(children);
	const rowsLength = rows?.length;

	// Set data length (via setMax) whenever data changes
	useEffect(() => {
		const numRows = rowsLength ?? childrenCount;

		setMax?.(numRows);
	}, [rowsLength, childrenCount, setMax]);

	const sortedRows = useMemo(
		() => rows?.map((row, idx) => ({ ...row, idx })).sort(sortFn),
		[rows, sortFn],
	);

	const renderedChildren = (() => {
		if (typeof children === 'function') {
			return sortedRows?.map(({ idx, ...row }) => (
				<RowProvider key={idx} value={idx}>
					{
						// @ts-expect-error
						children(row)
					}
				</RowProvider>
			));
		}

		const childrenArray = Array.isArray(children) ? children : [children];
		return childrenArray.map((row, idx) => (
			<RowProvider key={idx} value={idx}>
				{row}
			</RowProvider>
		));
	})();

	return (
		<TableBodyProvider value={true}>
			<TBodyPrimitive>{renderedChildren}</TBodyPrimitive>
		</TableBodyProvider>
	);
}

export default TBody;

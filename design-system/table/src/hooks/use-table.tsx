import React, { type Context, createContext, useContext } from 'react';

import __noop from '@atlaskit/ds-lib/noop';

export type SortDirection = 'ascending' | 'descending';
export type SortKey<Key extends string | symbol | number> = Key | 'unset';

type TableContext<T, K extends keyof T = keyof T> = {
	isSelectable?: boolean;
	sortKey: SortKey<K>;
	sortDirection?: SortDirection;
	sortFn?: (a: T, b: T) => number;
	setSortState: (key: SortKey<K>) => void;
};

function generateContext<T extends object>(): Context<TableContext<T>> {
	return createContext({
		isSelectable: false,
		sortKey: 'unset' as const,
		setSortState: __noop,
		sortFn: () => 0,
	} as TableContext<T>);
}

const TableContext = generateContext();

/**
 * __Table state provider__
 *
 * The table context provides the data required for more complex functionality.
 *
 * - [Examples](https://atlassian.design/components/table/examples)
 */
export function TableProvider<T extends object>({
	children,
	state,
}: {
	children: React.ReactNode;
	state: TableContext<T>;
}) {
	return (
		// @ts-expect-error
		<TableContext.Provider value={state}>{children}</TableContext.Provider>
	);
}

export const useTable = <TableItem extends object>() =>
	// @ts-expect-error
	useContext(TableContext) as TableContext<TableItem>;

import React, { useMemo } from 'react';

import { type ColumnSizesMap } from '../../../issue-like-table/types';
import { useColumnResize } from '../../../issue-like-table/use-column-resize';
import { useColumnWrapping } from '../../../issue-like-table/use-column-wrapping';

import { DatasourceContext } from './DatasourceContext';

type Props = {
	initialColumnCustomSizes?: ColumnSizesMap | undefined;
	initialWrappedColumnKeys?: string[] | undefined;
};

export const DatasourceContextProvider = ({
	children,
	initialColumnCustomSizes,
	initialWrappedColumnKeys,
}: Props & {
	children: React.ReactNode;
}) => {
	const { columnCustomSizes, onColumnResize } = useColumnResize(initialColumnCustomSizes);
	const { wrappedColumnKeys, onWrappedColumnChange } = useColumnWrapping(initialWrappedColumnKeys);

	const contextValue = useMemo(
		() => ({
			columnCustomSizes,
			onColumnResize,
			wrappedColumnKeys,
			onWrappedColumnChange,
		}),
		[columnCustomSizes, onColumnResize, onWrappedColumnChange, wrappedColumnKeys],
	);

	return <DatasourceContext.Provider value={contextValue}>{children}</DatasourceContext.Provider>;
};

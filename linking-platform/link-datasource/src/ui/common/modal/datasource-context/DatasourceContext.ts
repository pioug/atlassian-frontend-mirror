import React, { useContext } from 'react';

import { type ColumnSizesMap } from '../../../issue-like-table/types';

type DatasourceContextStore = {
	columnCustomSizes?: ColumnSizesMap;
	onColumnResize: (key: string, width: number) => void;
	wrappedColumnKeys?: string[];
	onWrappedColumnChange: (key: string, isWrapped: boolean) => void;
};

export const DatasourceContext = React.createContext<DatasourceContextStore | null>(null);

export const useDatasourceContext = () => {
	const value = useContext(DatasourceContext);
	if (!value) {
		throw new Error('useDatasourceStore must be used within DatasourceContextProvider');
	}
	return value;
};

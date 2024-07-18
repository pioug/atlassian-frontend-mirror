import React, { type PropsWithChildren, useContext, useMemo, useState } from 'react';

import type { DatasourceParameters } from '@atlaskit/linking-types';

import {
	type DatasourceTableState,
	useDatasourceTableState,
} from '../../../../hooks/useDatasourceTableState';
import type { ColumnSizesMap } from '../../../issue-like-table/types';
import {
	type ColumnResizeProps,
	useColumnResize,
} from '../datasources-table-in-modal-preview/use-column-resize';
import {
	type ColumnVisibilityProps,
	useColumnVisibility,
} from '../datasources-table-in-modal-preview/use-column-visibility';
import {
	type ColumnWrappingProps,
	useColumnWrapping,
} from '../datasources-table-in-modal-preview/use-column-wrapping';

type DatasourceContextStore = ColumnVisibilityProps &
	ColumnWrappingProps &
	ColumnResizeProps & {
		tableState: DatasourceTableState;
		visibleColumnKeys?: string[];
		parameters: DatasourceParameters | undefined;
		setParameters: React.Dispatch<React.SetStateAction<DatasourceParameters | undefined>>;
	};

const DatasourceContext = React.createContext<DatasourceContextStore | null>(null);

export type Props = PropsWithChildren<{
	datasourceId: string;
	isValidParameters: (params: DatasourceParameters | undefined) => boolean;
	initialParameters: DatasourceParameters | undefined;
	initialVisibleColumnKeys?: string[] | undefined;
	initialWrappedColumnKeys?: string[] | undefined;
	initialColumnCustomSizes?: ColumnSizesMap | undefined;
}>;

export const DatasourceContextProvider = ({
	children,
	datasourceId,
	isValidParameters,
	initialParameters,
	initialVisibleColumnKeys,
	initialColumnCustomSizes,
	initialWrappedColumnKeys,
}: Props) => {
	const [parameters, setParameters] = useState<DatasourceParameters | undefined>(initialParameters);

	const [visibleColumnKeys, setVisibleColumnKeys] = useState(initialVisibleColumnKeys);
	const { columnCustomSizes, onColumnResize } = useColumnResize(initialColumnCustomSizes);
	const { wrappedColumnKeys, onWrappedColumnChange } = useColumnWrapping(initialWrappedColumnKeys);

	const tableState = useDatasourceTableState({
		datasourceId,
		parameters: isValidParameters(parameters) ? parameters : undefined,
		fieldKeys: visibleColumnKeys,
	});

	const { onVisibleColumnKeysChange, visibleColumnCount } = useColumnVisibility({
		visibleColumnKeys,
		setVisibleColumnKeys,
		defaultVisibleColumnKeys: tableState.defaultVisibleColumnKeys,
		initialVisibleColumnKeys,
	});

	const contextValue = useMemo(
		() => ({
			tableState,
			visibleColumnCount,
			visibleColumnKeys,
			onVisibleColumnKeysChange,
			columnCustomSizes,
			onColumnResize,
			wrappedColumnKeys,
			onWrappedColumnChange,
			parameters,
			setParameters,
		}),
		[
			tableState,
			visibleColumnCount,
			visibleColumnKeys,
			onVisibleColumnKeysChange,
			columnCustomSizes,
			onColumnResize,
			wrappedColumnKeys,
			onWrappedColumnChange,
			parameters,
		],
	);

	return <DatasourceContext.Provider value={contextValue}>{children}</DatasourceContext.Provider>;
};

export const useDatasourceContext = () => {
	const value = useContext(DatasourceContext);
	if (!value) {
		throw new Error('useDatasourceStore must be used within DatasourceContextProvider');
	}
	return value;
};

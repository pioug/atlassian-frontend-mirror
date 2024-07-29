import React, { type PropsWithChildren, useContext, useMemo, useState } from 'react';

import { type DatasourceAdf, type InlineCardAdf } from '@atlaskit/linking-common';
import type { DatasourceParameters } from '@atlaskit/linking-types';

import { type OnInsertFunction } from '../../../../common/types';
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

type DatasourceContextValue<Parameters extends DatasourceParameters = DatasourceParameters> =
	ColumnVisibilityProps &
		ColumnWrappingProps &
		ColumnResizeProps &
		Pick<
			DatasourceContextProviderProps<Parameters>,
			'datasourceId' | 'onInsert' | 'isValidParameters'
		> & {
			tableState: DatasourceTableState;
			visibleColumnKeys?: string[];
			parameters: Parameters | undefined;
			setParameters: React.Dispatch<React.SetStateAction<Parameters | undefined>>;
		};

const DatasourceContext = React.createContext<DatasourceContextValue | null>(null);

type DatasourceContextProviderProps<Parameters extends DatasourceParameters> = PropsWithChildren<{
	datasourceId: string;
	isValidParameters: (params: DatasourceParameters | undefined) => boolean;
	initialParameters: Parameters | undefined;
	initialVisibleColumnKeys?: string[] | undefined;
	initialWrappedColumnKeys?: string[] | undefined;
	initialColumnCustomSizes?: ColumnSizesMap | undefined;
	onInsert: OnInsertFunction<InlineCardAdf | DatasourceAdf<Parameters>>;
}>;

export const DatasourceContextProvider = <Parameters extends DatasourceParameters>({
	children,
	datasourceId,
	isValidParameters,
	initialParameters,
	initialVisibleColumnKeys,
	initialColumnCustomSizes,
	initialWrappedColumnKeys,
	onInsert,
}: DatasourceContextProviderProps<Parameters>) => {
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
			datasourceId,
			isValidParameters,
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
			onInsert: onInsert as OnInsertFunction<InlineCardAdf | DatasourceAdf<DatasourceParameters>>,
		}),
		[
			datasourceId,
			isValidParameters,
			tableState,
			visibleColumnCount,
			visibleColumnKeys,
			onVisibleColumnKeysChange,
			columnCustomSizes,
			onColumnResize,
			wrappedColumnKeys,
			onWrappedColumnChange,
			parameters,
			onInsert,
		],
	);

	return <DatasourceContext.Provider value={contextValue}>{children}</DatasourceContext.Provider>;
};

export const useDatasourceContext = <Parameters extends DatasourceParameters>() => {
	const value = useContext(DatasourceContext) as DatasourceContextValue<Parameters> | null;
	if (!value) {
		throw new Error('useDatasourceStore must be used within DatasourceContextProvider');
	}
	return value;
};

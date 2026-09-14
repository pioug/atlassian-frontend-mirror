import React, { useMemo, useState } from 'react';

import type { DatasourceAdf, InlineCardAdf } from '@atlaskit/linking-common/types';
import type { DatasourceParameters } from '@atlaskit/linking-types/datasource';

import { type OnInsertFunction } from '../../../../common/types';
import { useDatasourceTableState } from '../../../../hooks/useDatasourceTableState';
import { useColumnResize } from '../datasources-table-in-modal-preview/use-column-resize';
import { useColumnVisibility } from '../datasources-table-in-modal-preview/use-column-visibility';
import { useColumnWrapping } from '../datasources-table-in-modal-preview/use-column-wrapping';

import { DatasourceContext } from './DatasourceContext';
import type { DatasourceContextProviderProps } from './DatasourceContextProviderProps';

export const DatasourceContextProvider = <Parameters extends DatasourceParameters>({
	children,
	datasourceId,
	isValidParameters,
	initialParameters,
	initialVisibleColumnKeys,
	initialColumnCustomSizes,
	initialWrappedColumnKeys,
	onInsert,
}: DatasourceContextProviderProps<Parameters>): React.JSX.Element => {
	const [parameters, setParameters] = useState<DatasourceParameters | undefined>(initialParameters);

	const [visibleColumnKeys, setVisibleColumnKeys] = useState(initialVisibleColumnKeys);
	const { columnCustomSizes, onColumnResize } = useColumnResize(initialColumnCustomSizes);
	const { wrappedColumnKeys, onWrappedColumnChange, onWrappedColumnsChange } =
		useColumnWrapping(initialWrappedColumnKeys);

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
			onWrappedColumnsChange,
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
			onWrappedColumnsChange,
			parameters,
			onInsert,
		],
	);

	return <DatasourceContext.Provider value={contextValue}>{children}</DatasourceContext.Provider>;
};

import React from 'react';

import type { DatasourceParameters } from '@atlaskit/linking-types/datasource';

import { type DatasourceTableState } from '../../../../hooks/useDatasourceTableState';
import { type ColumnResizeProps } from '../datasources-table-in-modal-preview/use-column-resize';
import { type ColumnVisibilityProps } from '../datasources-table-in-modal-preview/use-column-visibility';
import { type ColumnWrappingProps } from '../datasources-table-in-modal-preview/use-column-wrapping';

import type { DatasourceContextProviderProps } from './DatasourceContextProviderProps';

export type DatasourceContextValue<Parameters extends DatasourceParameters = DatasourceParameters> =
	ColumnVisibilityProps &
		ColumnWrappingProps &
		ColumnResizeProps &
		Pick<
			DatasourceContextProviderProps<Parameters>,
			'datasourceId' | 'onInsert' | 'isValidParameters'
		> & {
			parameters: Parameters | undefined;
			setParameters: React.Dispatch<React.SetStateAction<Parameters | undefined>>;
			tableState: DatasourceTableState;
			visibleColumnKeys?: string[];
		};

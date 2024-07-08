import React from 'react';

import type {
	DatasourceDataResponseItem,
	DatasourceResponseSchemaProperty,
	DatasourceTableStatusType,
} from '@atlaskit/linking-types';
import { fg } from '@atlaskit/platform-feature-flags';

import type { NextPageType } from '../../hooks/useDatasourceTableState';
import { useDatasourceContext } from '../common/modal/datasource-context/DatasourceContext';
import { IssueLikeDataTableView } from '../issue-like-table';
import { type TableViewPropsRenderType } from '../issue-like-table/types';

export interface DatasourcesTableProps {
	testId?: string;
	extensionKey?: string | null;
	columns: DatasourceResponseSchemaProperty[];
	visibleColumnKeys: string[];
	hasNextPage: boolean;
	status: DatasourceTableStatusType;
	items: DatasourceDataResponseItem[];
	onNextPage: NextPageType;
	onLoadDatasourceDetails: () => void;
	renderItem?: TableViewPropsRenderType;
	onVisibleColumnKeysChange?: (visibleColumnKeys: string[]) => void;
	scrollableContainerHeight?: number;
}

const Table = (props: DatasourcesTableProps) => {
	const { columnCustomSizes, onColumnResize, wrappedColumnKeys, onWrappedColumnChange } =
		useDatasourceContext();
	return (
		<IssueLikeDataTableView
			{...props}
			columnCustomSizes={columnCustomSizes}
			onColumnResize={onColumnResize}
			wrappedColumnKeys={wrappedColumnKeys}
			onWrappedColumnChange={
				fg('platform.linking-platform.datasource-word_wrap') ? onWrappedColumnChange : undefined
			}
		/>
	);
};

export default Table;

import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

import { IssueLikeDataTableView } from '../../../issue-like-table';
import { type IssueLikeDataTableViewProps } from '../../../issue-like-table/types';
import { useDatasourceContext } from '../datasource-context';

export type DatasourcesTableProps = Pick<
	IssueLikeDataTableViewProps,
	'testId' | 'renderItem' | 'scrollableContainerHeight'
>;

const Table = (props: DatasourcesTableProps) => {
	const {
		columnCustomSizes,
		onColumnResize,
		wrappedColumnKeys,
		onWrappedColumnChange,
		visibleColumnKeys,
		onVisibleColumnKeysChange,
		tableState: {
			status,
			onNextPage,
			responseItems,
			hasNextPage,
			columns,
			defaultVisibleColumnKeys,
			loadDatasourceDetails,
			extensionKey = null,
		},
	} = useDatasourceContext();

	return (
		<IssueLikeDataTableView
			{...props}
			status={status}
			columns={columns}
			items={responseItems}
			hasNextPage={hasNextPage}
			visibleColumnKeys={visibleColumnKeys || defaultVisibleColumnKeys}
			onNextPage={onNextPage}
			onLoadDatasourceDetails={loadDatasourceDetails}
			onVisibleColumnKeysChange={onVisibleColumnKeysChange}
			extensionKey={extensionKey}
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

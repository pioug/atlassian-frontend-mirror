import React, { useCallback } from 'react';

import { DatasourceAction } from '../../../../analytics/types';
import { useUserInteractions } from '../../../../contexts/user-interactions';
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
			responseItemIds,
			hasNextPage,
			columns,
			defaultVisibleColumnKeys,
			loadDatasourceDetails,
			extensionKey = null,
		},
	} = useDatasourceContext();

	const userInteractions = useUserInteractions();
	const handleOnNextPage: typeof onNextPage = useCallback(
		(onNextPageProps = {}) => {
			userInteractions.add(DatasourceAction.NEXT_PAGE_SCROLLED);
			onNextPage(onNextPageProps);
		},
		[onNextPage, userInteractions],
	);

	return (
		<IssueLikeDataTableView
			{...props}
			status={status}
			columns={columns}
			items={responseItems}
			itemIds={responseItemIds}
			hasNextPage={hasNextPage}
			visibleColumnKeys={visibleColumnKeys || defaultVisibleColumnKeys}
			onNextPage={handleOnNextPage}
			onLoadDatasourceDetails={loadDatasourceDetails}
			onVisibleColumnKeysChange={onVisibleColumnKeysChange}
			extensionKey={extensionKey}
			columnCustomSizes={columnCustomSizes}
			onColumnResize={onColumnResize}
			wrappedColumnKeys={wrappedColumnKeys}
			onWrappedColumnChange={onWrappedColumnChange}
		/>
	);
};

export default Table;

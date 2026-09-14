import React, { useCallback } from 'react';

import { fg } from '@atlaskit/platform-feature-flags/fg';

import { DatasourceAction } from '../../../../analytics/types';
import { useUserInteractions } from '../../../../contexts/user-interactions/use-user-interactions';
import { IssueLikeDataTableView } from '../../../issue-like-table/issue-like-data-table-view';
import { type IssueLikeDataTableViewProps } from '../../../issue-like-table/types';
import { useDatasourceContext } from '../datasource-context/useDatasourceContext';

export type DatasourcesTableProps = Pick<
	IssueLikeDataTableViewProps,
	'testId' | 'renderItem' | 'scrollableContainerHeight'
>;

const Table = (props: DatasourcesTableProps): React.JSX.Element => {
	const {
		columnCustomSizes,
		onColumnResize,
		wrappedColumnKeys,
		onWrappedColumnChange,
		onWrappedColumnsChange,
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
			{...(fg('platform_lp_sllv_table_settings_menu') ? { onWrappedColumnsChange } : {})}
		/>
	);
};

export default Table;

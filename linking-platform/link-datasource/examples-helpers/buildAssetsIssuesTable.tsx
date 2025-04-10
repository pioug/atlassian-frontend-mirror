import React from 'react';

import { IntlMessagesProvider } from '@atlaskit/intl-messages-provider';
import type { DatasourceTableView } from '@atlaskit/link-datasource';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { type DatasourceParameters } from '@atlaskit/linking-types';

import { fetchMessagesForLocale } from '../src/common/utils/locale/fetch-messages-for-locale';
import { ASSETS_LIST_OF_LINKS_DATASOURCE_ID } from '../src/ui/assets-modal';
import { type AssetsDatasourceParameters } from '../src/ui/assets-modal/types';
import { DataSourceTableViewNoSuspense } from '../src/ui/datasource-table-view/datasourceTableView';

import SmartLinkClient from './smartLinkCustomClient';
import { useAssetsTableProps } from './useAssetsTableProps';

interface AssetsTableViewProps {
	parameters?: DatasourceParameters;
	mockDatasourceFetchRequest?: boolean;
	/**
	 * Used to use the lazy loaded version for examples on atlaskit
	 */
	DatasourceTable?: typeof DataSourceTableViewNoSuspense | typeof DatasourceTableView;
}

const AssetsTableView = ({
	DatasourceTable = DataSourceTableViewNoSuspense,
}: AssetsTableViewProps) => {
	const datasourceParameters: AssetsDatasourceParameters = {
		workspaceId: 'workspaceId',
		aql: 'name like a',
		schemaId: '2',
	};

	const {
		visibleColumnKeys,
		onVisibleColumnKeysChange,
		columnCustomSizes,
		onColumnResize,
		wrappedColumnKeys,
		onWrappedColumnChange,
	} = useAssetsTableProps({
		defaultColumnCustomSizes: {
			people: 100,
		},
	});

	return (
		<DatasourceTable
			datasourceId={ASSETS_LIST_OF_LINKS_DATASOURCE_ID}
			parameters={datasourceParameters}
			visibleColumnKeys={visibleColumnKeys}
			onVisibleColumnKeysChange={onVisibleColumnKeysChange}
			columnCustomSizes={columnCustomSizes}
			onColumnResize={onColumnResize}
			onWrappedColumnChange={onWrappedColumnChange}
			wrappedColumnKeys={wrappedColumnKeys}
		/>
	);
};

export const ExampleAssetsIssuesTableView = ({
	mockDatasourceFetchRequest = true,
	...props
}: AssetsTableViewProps) => {
	return (
		<IntlMessagesProvider loaderFn={fetchMessagesForLocale}>
			<SmartCardProvider client={new SmartLinkClient()}>
				<AssetsTableView {...props} />
			</SmartCardProvider>
		</IntlMessagesProvider>
	);
};

import React from 'react';

import { IntlMessagesProvider } from '@atlaskit/intl-messages-provider';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { type DatasourceParameters } from '@atlaskit/linking-types';

import { DatasourceTableView } from '../src';
import { fetchMessagesForLocale } from '../src/common/utils/locale/fetch-messages-for-locale';
import { ASSETS_LIST_OF_LINKS_DATASOURCE_ID } from '../src/ui/assets-modal';
import { type AssetsDatasourceParameters } from '../src/ui/assets-modal/types';

import SmartLinkClient from './smartLinkCustomClient';
import { useAssetsTableProps } from './useAssetsTableProps';

interface AssetsTableViewProps {
	parameters?: DatasourceParameters;
	mockDatasourceFetchRequest?: boolean;
}

const AssetsTableView = () => {
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
		<DatasourceTableView
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
}: AssetsTableViewProps) => {
	return (
		<IntlMessagesProvider loaderFn={fetchMessagesForLocale}>
			<SmartCardProvider client={new SmartLinkClient()}>
				<AssetsTableView />
			</SmartCardProvider>
		</IntlMessagesProvider>
	);
};

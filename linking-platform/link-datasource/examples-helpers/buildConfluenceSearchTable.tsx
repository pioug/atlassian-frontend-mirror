import React, { useEffect, useMemo } from 'react';

import { IntlMessagesProvider } from '@atlaskit/intl-messages-provider';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { mockDatasourceFetchRequests } from '@atlaskit/link-test-helpers/datasource';
import { type DatasourceParameters } from '@atlaskit/linking-types';

import { DatasourceTableView } from '../src';
import { fetchMessagesForLocale } from '../src/common/utils/locale/fetch-messages-for-locale';
import { type ConfluenceSearchDatasourceParameters } from '../src/ui/confluence-search-modal/types';

import SmartLinkClient from './smartLinkCustomClient';
import { useCommonTableProps } from './useCommonTableProps';

interface ConfluenceSearchTableViewProps {
	parameters?: DatasourceParameters;
	mockDatasourceFetchRequest?: boolean;
}

const ConfluenceSearchTableView = ({ parameters }: ConfluenceSearchTableViewProps) => {
	const cloudId = parameters?.cloudId || 'some-cloud-id';

	const datasourceParameters = useMemo<ConfluenceSearchDatasourceParameters>(
		() => ({
			cloudId,
			searchString: 'some-query',
		}),
		[cloudId],
	);

	const {
		visibleColumnKeys,
		onVisibleColumnKeysChange,
		columnCustomSizes,
		onColumnResize,
		wrappedColumnKeys,
		onWrappedColumnChange,
	} = useCommonTableProps({
		defaultColumnCustomSizes: {
			people: 100,
		},
	});

	return (
		<DatasourceTableView
			datasourceId={'some-datasource-id'}
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

export const ExampleConfluenceSearchTableView = ({
	parameters,
	mockDatasourceFetchRequest = true,
}: ConfluenceSearchTableViewProps) => {
	useEffect(() => {
		if (mockDatasourceFetchRequest) {
			mockDatasourceFetchRequests();
		}
	}, [mockDatasourceFetchRequest]);

	return (
		<IntlMessagesProvider loaderFn={fetchMessagesForLocale}>
			<SmartCardProvider client={new SmartLinkClient()}>
				<ConfluenceSearchTableView parameters={parameters} />
			</SmartCardProvider>
		</IntlMessagesProvider>
	);
};

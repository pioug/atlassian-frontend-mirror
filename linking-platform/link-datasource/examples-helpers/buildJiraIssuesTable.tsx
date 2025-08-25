import React, { useMemo } from 'react';

import { IntlMessagesProvider } from '@atlaskit/intl-messages-provider';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { mockDatasourceFetchRequests } from '@atlaskit/link-test-helpers/datasource';
import { type DatasourceParameters } from '@atlaskit/linking-types';

import { type DatasourceTableView } from '../src';
import { fetchMessagesForLocale } from '../src/common/utils/locale/fetch-messages-for-locale';
import { DatasourceExperienceIdProvider } from '../src/contexts/datasource-experience-id';
import { DataSourceTableViewNoSuspense } from '../src/ui/datasource-table-view/datasourceTableView';
import { type JiraIssueDatasourceParameters } from '../src/ui/jira-issues-modal/types';

import SmartLinkClient from './smartLinkCustomClient';
import { useCommonTableProps } from './useCommonTableProps';

type JiraIssuesTableViewProps = {
	/**
	 * Used to use the lazy loaded version for examples on atlaskit
	 */
	DatasourceTable?: typeof DataSourceTableViewNoSuspense | typeof DatasourceTableView;
	mockDatasourceFetchRequest?: boolean;
	parameters?: DatasourceParameters;
};

const JiraIssuesTableView = ({
	parameters,
	DatasourceTable = DataSourceTableViewNoSuspense,
}: JiraIssuesTableViewProps) => {
	const cloudId = parameters?.cloudId || 'some-cloud-id';

	const datasourceParameters = useMemo<JiraIssueDatasourceParameters>(
		() => ({
			cloudId,
			jql: 'some-jql',
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
			summary: 180,
			link: 350,
			labels: 100,
			priority: 200,
		},
	});

	return (
		<DatasourceTable
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

export const ExampleJiraIssuesTableView = ({
	parameters,
	mockDatasourceFetchRequest = true,
	...props
}: JiraIssuesTableViewProps) => {
	if (mockDatasourceFetchRequest) {
		mockDatasourceFetchRequests();
	}

	return (
		<DatasourceExperienceIdProvider>
			<IntlMessagesProvider loaderFn={fetchMessagesForLocale}>
				<SmartCardProvider client={new SmartLinkClient()}>
					<JiraIssuesTableView parameters={parameters} {...props} />
				</SmartCardProvider>
			</IntlMessagesProvider>
		</DatasourceExperienceIdProvider>
	);
};

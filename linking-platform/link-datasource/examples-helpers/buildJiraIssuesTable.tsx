import React, { useMemo } from 'react';

import { IntlMessagesProvider } from '@atlaskit/intl-messages-provider';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { mockDatasourceFetchRequests } from '@atlaskit/link-test-helpers/datasource';

import { type DatasourceTableView } from '../src';
import { fetchMessagesForLocale } from '../src/common/utils/locale/fetch-messages-for-locale';
import { DatasourceExperienceIdProvider } from '../src/contexts/datasource-experience-id';
import { DataSourceTableViewNoSuspense } from '../src/ui/datasource-table-view/datasourceTableView';
import type { DatasourceTableViewProps } from '../src/ui/datasource-table-view/types';

import SmartLinkClient from './smartLinkCustomClient';
import { useCommonTableProps } from './useCommonTableProps';

type JiraIssuesTableViewProps = {
	/**
	 * Used to use the lazy loaded version for examples on atlaskit
	 */
	DatasourceTable?: typeof DataSourceTableViewNoSuspense | typeof DatasourceTableView;
	mockDatasourceFetchRequest?: boolean;
} & Partial<
	Pick<DatasourceTableViewProps, 'parameters' | 'scrollableContainerHeight' | 'visibleColumnKeys'>
>;

const JiraIssuesTableView = ({
	DatasourceTable = DataSourceTableViewNoSuspense,
	...props
}: Omit<JiraIssuesTableViewProps, 'mockDatasourceFetchRequest'>) => {
	const {
		parameters: { cloudId = 'some-cloud-id', jql = 'some-jql' } = {},
		scrollableContainerHeight,
		visibleColumnKeys: initialVisibleColumnKeys,
	} = props;

	const parameters = useMemo(
		() => ({
			cloudId,
			jql,
		}),
		[cloudId, jql],
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
			description: 650,
		},
		visibleColumnKeys: initialVisibleColumnKeys,
	});

	return (
		<DatasourceTable
			datasourceId={'some-datasource-id'}
			parameters={parameters}
			visibleColumnKeys={visibleColumnKeys}
			onVisibleColumnKeysChange={onVisibleColumnKeysChange}
			columnCustomSizes={columnCustomSizes}
			onColumnResize={onColumnResize}
			onWrappedColumnChange={onWrappedColumnChange}
			wrappedColumnKeys={wrappedColumnKeys}
			scrollableContainerHeight={scrollableContainerHeight}
		/>
	);
};

export const ExampleJiraIssuesTableView = ({
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
					<JiraIssuesTableView {...props} />
				</SmartCardProvider>
			</IntlMessagesProvider>
		</DatasourceExperienceIdProvider>
	);
};

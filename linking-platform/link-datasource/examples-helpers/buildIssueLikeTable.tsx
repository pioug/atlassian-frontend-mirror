/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useMemo } from 'react';

import { jsx, styled } from '@compiled/react';

import { IntlMessagesProvider } from '@atlaskit/intl-messages-provider';
import { SmartCardProvider } from '@atlaskit/link-provider';
import { mockDatasourceFetchRequests } from '@atlaskit/link-test-helpers/datasource';
import { Text } from '@atlaskit/primitives/compiled';

import { fetchMessagesForLocale } from '../src/common/utils/locale/fetch-messages-for-locale';
import { DatasourceExperienceIdProvider } from '../src/contexts/datasource-experience-id';
import { useDatasourceTableState } from '../src/hooks/useDatasourceTableState';
import { IssueLikeDataTableView } from '../src/ui/issue-like-table';
import { type JiraIssueDatasourceParameters } from '../src/ui/jira-issues-modal/types';

import SmartLinkClient from './smartLinkCustomClient';
import { useCommonTableProps } from './useCommonTableProps';

type Props = {
	canControlWrapping?: boolean;
	canResizeColumns?: boolean;
	cloudId?: string;
	forceLoading?: boolean;
	isReadonly?: boolean;
	skipIntl?: boolean;
	visibleColumnKeys?: string[];
} & Parameters<typeof mockDatasourceFetchRequests>[0];

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const TableViewWrapper = styled.div({
	display: 'flex',
	flexDirection: 'column',
	overflow: 'scroll',
	width: '100%',
	height: '100%',
});

const ExampleBody = ({
	isReadonly,
	canResizeColumns = true,
	canControlWrapping = true,
	forceLoading = false,
	visibleColumnKeys: overrideVisibleColumnKeys,
	mockExecutionDelay = 600,
	cloudId,
}: Props) => {
	const parameters = useMemo<JiraIssueDatasourceParameters>(
		() => ({
			cloudId: cloudId ?? 'some-cloud-id',
			jql: 'some-jql',
		}),
		[cloudId],
	);

	useEffect(() => {
		mockDatasourceFetchRequests({ mockExecutionDelay });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const {
		status,
		onNextPage,
		responseItems,
		responseItemIds,
		hasNextPage,
		defaultVisibleColumnKeys,
		columns,
		loadDatasourceDetails,
	} = useDatasourceTableState({
		datasourceId: 'some-datasource-id',
		parameters,
	});

	const {
		visibleColumnKeys,
		onVisibleColumnKeysChange,
		columnCustomSizes,
		onColumnResize,
		wrappedColumnKeys,
		onWrappedColumnChange,
	} = useCommonTableProps({
		defaultColumnCustomSizes: {
			summary: 180,
			link: 350,
			labels: 100,
		},
	});

	useEffect(() => {
		if (overrideVisibleColumnKeys) {
			onVisibleColumnKeysChange(overrideVisibleColumnKeys);
		} else if (visibleColumnKeys.length === 0 && defaultVisibleColumnKeys.length > 0) {
			onVisibleColumnKeysChange(defaultVisibleColumnKeys);
		}
	}, [
		visibleColumnKeys,
		defaultVisibleColumnKeys,
		onVisibleColumnKeysChange,
		overrideVisibleColumnKeys,
	]);

	return (
		<TableViewWrapper>
			{visibleColumnKeys.length > 0 && columns.length > 0 ? (
				<IssueLikeDataTableView
					testId="link-datasource"
					items={forceLoading ? [] : responseItems}
					itemIds={forceLoading ? [] : responseItemIds}
					onNextPage={onNextPage}
					onLoadDatasourceDetails={loadDatasourceDetails}
					hasNextPage={hasNextPage}
					status={forceLoading ? 'loading' : status}
					columns={columns}
					visibleColumnKeys={visibleColumnKeys}
					onVisibleColumnKeysChange={isReadonly ? undefined : onVisibleColumnKeysChange}
					onColumnResize={isReadonly || !canResizeColumns ? undefined : onColumnResize}
					columnCustomSizes={columnCustomSizes}
					onWrappedColumnChange={canControlWrapping ? onWrappedColumnChange : undefined}
					wrappedColumnKeys={wrappedColumnKeys}
				/>
			) : (
				<Text as="span">Loading ...</Text>
			)}
		</TableViewWrapper>
	);
};

export const ExampleIssueLikeTableExample = (props: Props) => {
	return (
		<DatasourceExperienceIdProvider>
			<IntlMessagesProvider loaderFn={fetchMessagesForLocale}>
				<SmartCardProvider client={new SmartLinkClient()}>
					<ExampleBody {...props} />
				</SmartCardProvider>
			</IntlMessagesProvider>
		</DatasourceExperienceIdProvider>
	);
};

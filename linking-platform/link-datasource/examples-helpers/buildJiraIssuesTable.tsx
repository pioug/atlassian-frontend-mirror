import React, { useEffect, useMemo } from 'react';

import { IntlProvider } from 'react-intl-next';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { mockDatasourceFetchRequests } from '@atlaskit/link-test-helpers/datasource';
import { DatasourceParameters } from '@atlaskit/linking-types';

import { DatasourceTableView } from '../src';
import { JiraIssueDatasourceParameters } from '../src/ui/jira-issues-modal/types';

import SmartLinkClient from './smartLinkCustomClient';
import { useCommonTableProps } from './useCommonTableProps';

interface JiraIssuesTableViewProps {
  parameters?: DatasourceParameters;
  mockDatasourceFetchRequest?: boolean;
}

const JiraIssuesTableView = ({ parameters }: JiraIssuesTableViewProps) => {
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

export const ExampleJiraIssuesTableView = ({
  parameters,
  mockDatasourceFetchRequest = true,
}: JiraIssuesTableViewProps) => {
  useEffect(() => {
    if (mockDatasourceFetchRequest) {
      mockDatasourceFetchRequests();
    }
  }, [mockDatasourceFetchRequest]);

  return (
    <IntlProvider locale="en">
      <SmartCardProvider client={new SmartLinkClient()}>
        <JiraIssuesTableView parameters={parameters} />
      </SmartCardProvider>
    </IntlProvider>
  );
};

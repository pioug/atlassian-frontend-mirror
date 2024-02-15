import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { IntlProvider } from 'react-intl-next';

import { SmartCardProvider } from '@atlaskit/link-provider';
import {
  defaultInitialVisibleColumnKeys,
  mockDatasourceFetchRequests,
} from '@atlaskit/link-test-helpers/datasource';
import { DatasourceParameters } from '@atlaskit/linking-types';

import { DatasourceTableView } from '../src';
import { ColumnSizesMap } from '../src/ui/issue-like-table/types';
import { JiraIssueDatasourceParameters } from '../src/ui/jira-issues-modal/types';

import SmartLinkClient from './smartLinkCustomClient';

interface JiraIssuesTableViewProps {
  parameters?: DatasourceParameters;
  mockDatasourceFetchRequest?: boolean;
}

const JiraIssuesTableView = ({ parameters }: JiraIssuesTableViewProps) => {
  const cloudId = parameters?.cloudId || 'some-cloud-id';

  const [visibleColumnKeys, setVisibleColumnKeys] = useState<string[]>(
    defaultInitialVisibleColumnKeys,
  );

  const datasourceParameters = useMemo<JiraIssueDatasourceParameters>(
    () => ({
      cloudId,
      jql: 'some-jql',
    }),
    [cloudId],
  );

  const [columnCustomSizes, setColumnCustomSizes] = useState<
    ColumnSizesMap | undefined
  >({
    people: 100,
  });

  const onColumnResize = useCallback(
    (key: string, width: number) => {
      setColumnCustomSizes({ ...columnCustomSizes, [key]: width });
    },
    [columnCustomSizes],
  );

  return (
    <DatasourceTableView
      datasourceId={'some-datasource-id'}
      parameters={datasourceParameters}
      visibleColumnKeys={visibleColumnKeys}
      onVisibleColumnKeysChange={setVisibleColumnKeys}
      columnCustomSizes={columnCustomSizes}
      onColumnResize={onColumnResize}
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

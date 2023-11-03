import React, { useCallback, useMemo, useState } from 'react';

import {
  defaultInitialVisibleColumnKeys,
  mockDatasourceFetchRequests,
} from '@atlaskit/link-test-helpers/datasource';

import { DatasourceTableView } from '../src';
import { ColumnSizesMap } from '../src/ui/issue-like-table/types';
import { JiraIssueDatasourceParameters } from '../src/ui/jira-issues-modal/types';

mockDatasourceFetchRequests();

export const ExampleJiraIssuesTableView = () => {
  const cloudId = 'some-cloud-id';

  const [visibleColumnKeys, setVisibleColumnKeys] = useState<string[]>(
    defaultInitialVisibleColumnKeys,
  );

  const parameters = useMemo<JiraIssueDatasourceParameters>(
    () => ({
      cloudId,
      jql: 'some-jql',
    }),
    [cloudId],
  );

  const [columnCustomSizes, setColumnCustomSizes] = useState<
    ColumnSizesMap | undefined
  >();

  const onColumnResize = useCallback(
    (key: string, width: number) => {
      setColumnCustomSizes({ ...columnCustomSizes, [key]: width });
    },
    [columnCustomSizes],
  );

  return (
    <DatasourceTableView
      datasourceId={'some-datasource-id'}
      parameters={parameters}
      visibleColumnKeys={visibleColumnKeys}
      onVisibleColumnKeysChange={setVisibleColumnKeys}
      columnCustomSizes={columnCustomSizes}
      onColumnResize={onColumnResize}
    />
  );
};

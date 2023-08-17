import React, { useMemo, useState } from 'react';

import {
  defaultInitialVisibleColumnKeys,
  mockDatasourceFetchRequests,
} from '@atlaskit/link-test-helpers/datasource';

import { DatasourceTableView } from '../src';
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

  return (
    <DatasourceTableView
      datasourceId={'some-datasource-id'}
      parameters={parameters}
      visibleColumnKeys={visibleColumnKeys}
      onVisibleColumnKeysChange={setVisibleColumnKeys}
    />
  );
};

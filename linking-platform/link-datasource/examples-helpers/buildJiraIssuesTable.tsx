import React, { useMemo, useState } from 'react';

import { JiraIssuesTableView } from '../src/ui/jira-issues/tableView';
import { JiraIssueDatasourceParameters } from '../src/ui/jira-issues/types';

import { MOCK_DATASOURCE_ID } from './setupDatasourcesMocks';

export const ExampleJiraIssuesTableView = () => {
  const cloudId = 'some-cloud-id';
  const parameterType = 'jql';
  const parameterValue = 'some-jql';

  const [visibleColumnKeys, setVisibleColumnKeys] = useState<string[]>([]);

  const parameters = useMemo<JiraIssueDatasourceParameters>(() => {
    return {
      cloudId,
      type: parameterType,
      value: parameterValue,
    };
  }, [cloudId, parameterType, parameterValue]);

  return (
    <JiraIssuesTableView
      datasourceId={MOCK_DATASOURCE_ID}
      parameters={parameters}
      visibleColumnKeys={visibleColumnKeys}
      onVisibleColumnKeysChange={setVisibleColumnKeys}
    />
  );
};

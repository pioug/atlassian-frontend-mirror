export interface JiraIssuesTableViewProps {
  datasourceId: string;
  parameters: JiraIssueDatasourceParameters;
  fields?: string[];
  onVisibleColumnKeysChange?: (visibleColumnKeys: string[]) => void;
  visibleColumnKeys?: string[];
}

export type JiraIssueDatasourceParameterType = 'jql' | 'textQuery' | 'filter';

export interface JiraIssueDatasourceParameters {
  cloudId: string;
  value: string;
  type: JiraIssueDatasourceParameterType;
}

export type JiraIssueViewModes = 'issue' | 'count';

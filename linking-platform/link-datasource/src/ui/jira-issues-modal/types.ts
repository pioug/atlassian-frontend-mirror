import { DatasourceAdf } from '@atlaskit/linking-common/types';

type XOR<T1, T2> =
  | (T1 & {
      [k in Exclude<keyof T2, keyof T1>]?: never;
    })
  | (T2 & {
      [k in Exclude<keyof T1, keyof T2>]?: never;
    });

export type JiraIssueDatasourceParametersQuery = XOR<
  { jql: string },
  { filter: string }
>;

export type JiraIssueDatasourceParameters = {
  cloudId: string;
} & JiraIssueDatasourceParametersQuery;

export type JiraIssuesDatasourceAdf =
  DatasourceAdf<JiraIssueDatasourceParameters>;

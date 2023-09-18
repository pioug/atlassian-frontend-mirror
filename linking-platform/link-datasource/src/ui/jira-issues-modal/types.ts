import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { DatasourceAdf, InlineCardAdf } from '@atlaskit/linking-common/types';

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

export type JiraIssueViewModes = 'issue' | 'count';

export interface JiraIssuesDatasourceAdf extends DatasourceAdf {
  attrs: {
    url?: string;
    datasource: {
      id: string;
      parameters: JiraIssueDatasourceParameters;
      views: [
        {
          type: 'table';
          properties?: {
            columns: { key: string }[];
          };
        },
      ];
    };
  };
}

export interface JiraIssuesConfigModalProps {
  datasourceId: string;
  visibleColumnKeys?: string[];
  parameters?: JiraIssueDatasourceParameters;
  onCancel: () => void;
  onInsert: (
    adf: InlineCardAdf | JiraIssuesDatasourceAdf,
    analyticsEvent?: UIAnalyticsEvent,
  ) => void;
}

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

export interface Site {
  cloudId: string;
  displayName: string;
  url: string;
}

export type JiraIssuesDatasourceAdf =
  DatasourceAdf<JiraIssueDatasourceParameters>;

export interface JiraIssuesConfigModalProps {
  /** Unique identifier for which type of datasource is being rendered and for making its requests */
  datasourceId: string;
  /** The keys for each of the visible columns to the shown in the rendered table */
  visibleColumnKeys?: string[];
  columnCustomSizes?: { [key: string]: number };
  /** The url that was used to insert a Jira List of Links */
  url?: string;
  /** Parameters for making the data requests necessary to render data within the table */
  parameters?: JiraIssueDatasourceParameters;
  /** Callback function to be invoked when the modal is closed either via cancel button click, esc keydown, or modal blanket click */
  onCancel: () => void;
  /** Callback function to be invoked when the insert issues button is clicked */
  onInsert: (
    adf: InlineCardAdf | JiraIssuesDatasourceAdf,
    analyticsEvent?: UIAnalyticsEvent,
  ) => void;
  /** The view mode that the modal will show on open:
   * - Table = Displays a list of links in table format
   * - Inline link = Presents a smart link that shows the count of query results. However, if there's only one result, it converts to an inline smart link of that issue.

   * The view modes in 'JiraIssueViewModes' have not been changed from 'count' to 'inline link' and 'issue' to 'table'
   * because it will introduce breaking changes to the public API requiring a major version bump*/
  viewMode?: JiraIssueViewModes;
}

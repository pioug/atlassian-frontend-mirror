import { DatasourceAdf, InlineCardAdf } from '@atlaskit/linking-common/types';

import { ConfigModalProps } from '../../common/types';

export interface ConfluenceSearchConfigModalProps
  extends ConfigModalProps<
    InlineCardAdf | ConfluenceSearchDatasourceAdf,
    ConfluenceSearchDatasourceParameters
  > {}

export type ConfluenceSearchDatasourceParameters = {
  cloudId: string;
  searchString?: string;
  entityTypes?: string[];
  contentARIs?: string[];
  spaceKeys?: string[];
  contributorAccountIds?: string[];
  labels?: string[];
  ancestorPageIds?: string[];
  containerStatus?: string[];
  contentStatuses?: string[];
  creatorAccountIds?: string[];
  lastModified?:
    | 'today'
    | 'yesterday'
    | 'past7Days'
    | 'past30Days'
    | 'pastYear'
    | 'custom';
  lastModifiedFrom?: string;
  lastModifiedTo?: string;
  shouldMatchTitleOnly?: boolean;
};

export type ConfluenceSearchDatasourceAdf =
  DatasourceAdf<ConfluenceSearchDatasourceParameters>;

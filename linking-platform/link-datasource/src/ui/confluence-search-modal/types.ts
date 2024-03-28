import { DatasourceAdf } from '@atlaskit/linking-common/types';

import { ConfigModalProps } from '../../common/types';

export interface ConfluenceSearchConfigModalProps
  extends ConfigModalProps<
    ConfluenceSearchDatasourceAdf,
    { cloudId: string; searchString?: string }
  > {}

export type ConfluenceSearchDatasourceParameters = {
  cloudId: string;
  searchString?: string;
};

export type ConfluenceSearchDatasourceAdf =
  DatasourceAdf<ConfluenceSearchDatasourceParameters>;

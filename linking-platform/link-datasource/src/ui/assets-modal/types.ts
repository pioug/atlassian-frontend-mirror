import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { DatasourceAdf, InlineCardAdf } from '@atlaskit/linking-common/types';

export type AssetsDatasourceParameters = {
  workspaceId: string;
  aql: string;
  schemaId: string;
};

export type AssetsDatasourceAdf = DatasourceAdf<AssetsDatasourceParameters>;

export interface AssetsConfigModalProps {
  datasourceId: string;
  visibleColumnKeys?: string[];
  parameters?: AssetsDatasourceParameters;
  onCancel: () => void;
  onInsert: (
    adf: InlineCardAdf | AssetsDatasourceAdf,
    analyticsEvent?: UIAnalyticsEvent,
  ) => void;
}

import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import {
  DatasourceAdf,
  DatasourceAdfView,
  InlineCardAdf,
} from '@atlaskit/linking-common/types';
export interface AssetsDatasourceParameters {
  workspaceId: string;
  aql: string;
  schemaId: string;
}
export interface AssetsDatasourceAdf extends DatasourceAdf {
  attrs: {
    url?: string;
    datasource: {
      id: string;
      parameters: AssetsDatasourceParameters;
      views: DatasourceAdfView[];
    };
  };
}
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

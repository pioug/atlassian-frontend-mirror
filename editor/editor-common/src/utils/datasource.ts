import {
  ASSETS_LIST_OF_LINKS_DATASOURCE_ID,
  CONFLUENCE_SEARCH_DATASOURCE_ID,
  JIRA_LIST_OF_LINKS_DATASOURCE_ID,
} from '@atlaskit/link-datasource';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import type { DatasourceModalType } from '../types';

export const getDatasourceType = (
  datasourceId: string,
): DatasourceModalType | undefined => {
  switch (datasourceId) {
    case JIRA_LIST_OF_LINKS_DATASOURCE_ID:
      return 'jira';
    case ASSETS_LIST_OF_LINKS_DATASOURCE_ID:
      return 'assets';
    case CONFLUENCE_SEARCH_DATASOURCE_ID:
      return 'confluence-search';
    default:
      return undefined;
  }
};

export const canRenderDatasource = (
  datasourceId: string,
  defaultValue: boolean = true,
): boolean => {
  const datasourceType = getDatasourceType(datasourceId);

  switch (datasourceType) {
    case 'jira':
      return true;
    case 'assets':
      if (getBooleanFF('platform.linking-platform.datasource-assets_objects')) {
        return true;
      }
      return false;
    default:
      return defaultValue;
  }
};

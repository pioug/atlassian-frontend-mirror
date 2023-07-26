import {
  ASSETS_LIST_OF_LINKS_DATASOURCE_ID,
  JIRA_LIST_OF_LINKS_DATASOURCE_ID,
} from '@atlaskit/link-datasource';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { DatasourceModalType } from '../types';

const getDatasourceType = (
  datasourceId: string,
): DatasourceModalType | undefined => {
  switch (datasourceId) {
    case JIRA_LIST_OF_LINKS_DATASOURCE_ID:
      return 'jira';
    case ASSETS_LIST_OF_LINKS_DATASOURCE_ID:
      return 'assets';
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
      if (getBooleanFF('platform.linking-platform.datasource-jira_issues')) {
        return true;
      }
      return false;
    case 'assets':
      if (getBooleanFF('platform.linking-platform.datasource-assets_objects')) {
        return true;
      }
      return false;
    default:
      return defaultValue;
  }
};

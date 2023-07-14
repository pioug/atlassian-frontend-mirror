import { JIRA_LIST_OF_LINKS_DATASOURCE_ID } from '@atlaskit/link-datasource';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { DatasourceModalType } from '../types';

const getDatasourceType = (
  datasourceId: string,
): DatasourceModalType | undefined => {
  switch (datasourceId) {
    case JIRA_LIST_OF_LINKS_DATASOURCE_ID:
      return 'jira';

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

    default:
      return defaultValue;
  }
};

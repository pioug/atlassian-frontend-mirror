import { DatasourceAttributeProperties } from '@atlaskit/adf-schema/schema';
import { JIRA_LIST_OF_LINKS_DATASOURCE_ID } from '@atlaskit/link-datasource';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

const getDatasourceType = (
  datasource: DatasourceAttributeProperties,
): 'jira' | undefined => {
  switch (datasource.id) {
    case JIRA_LIST_OF_LINKS_DATASOURCE_ID:
      return 'jira';

    default:
      return undefined;
  }
};

export const canRenderDatasource = (
  datasource: DatasourceAttributeProperties,
  defaultValue: boolean = true,
): boolean => {
  const datasourceType = getDatasourceType(datasource);

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

import {
  ASSETS_LIST_OF_LINKS_DATASOURCE_ID,
  JIRA_LIST_OF_LINKS_DATASOURCE_ID,
} from '@atlaskit/link-datasource';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { canRenderDatasource } from '../datasource';

const mockDatasourceParameters = {
  id: 'datasource-id',
  parameters: { jql: 'EDM=jql', cloudId: 'cloud-id' },
  views: [
    {
      type: 'table',
      properties: { columns: [{ key: 'col1' }, { key: 'col2' }] },
    },
  ],
};

const mockDatasourceParametersWithRealJiraId = {
  ...mockDatasourceParameters,
  id: JIRA_LIST_OF_LINKS_DATASOURCE_ID,
};
const mockDatasourceParametersWithRealAssetsId = {
  ...mockDatasourceParameters,
  id: ASSETS_LIST_OF_LINKS_DATASOURCE_ID,
};

describe('canRenderDatasource()', () => {
  it('should return true when datasource id is not the real one', () => {
    const returnValue = canRenderDatasource(mockDatasourceParameters.id);

    expect(returnValue).toEqual(true);
  });

  it.each<boolean>([true, false])(
    'should return default value "%s" when it is passed and when datasource id is not the real one',
    (defaultValue) => {
      const returnValue = canRenderDatasource(
        mockDatasourceParameters.id,
        defaultValue,
      );

      expect(returnValue).toEqual(defaultValue);
    },
  );

  describe('when using a real datasource id', () => {
    it('should return true for jira datasource id', () => {
      const returnValue = canRenderDatasource(
        mockDatasourceParametersWithRealJiraId.id,
      );

      expect(returnValue).toEqual(true);
    });

    describe('along with feature flag', () => {
      ffTest(
        'platform.linking-platform.datasource-assets_objects',
        () => {
          const returnValue = canRenderDatasource(
            mockDatasourceParametersWithRealAssetsId.id,
          );

          expect(returnValue).toEqual(true);
        },
        () => {
          const returnValue = canRenderDatasource(
            mockDatasourceParametersWithRealAssetsId.id,
          );

          expect(returnValue).toEqual(false);
        },
      );
    });
  });
});

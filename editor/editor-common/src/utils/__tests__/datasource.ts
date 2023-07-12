import { JIRA_LIST_OF_LINKS_DATASOURCE_ID } from '@atlaskit/link-datasource';
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

describe('canRenderDatasource()', () => {
  it('should return true when datasource id is not the real one', () => {
    const returnValue = canRenderDatasource(mockDatasourceParameters);

    expect(returnValue).toEqual(true);
  });

  it.each<boolean>([true, false])(
    'should return default value "%s" when it is passed and when datasource id is not the real one',
    (defaultValue) => {
      const returnValue = canRenderDatasource(
        mockDatasourceParameters,
        defaultValue,
      );

      expect(returnValue).toEqual(defaultValue);
    },
  );

  describe('when using feature flag', () => {
    ffTest(
      'platform.linking-platform.datasource-jira_issues',
      () => {
        const returnValue = canRenderDatasource(
          mockDatasourceParametersWithRealJiraId,
        );

        expect(returnValue).toEqual(true);
      },
      () => {
        const returnValue = canRenderDatasource(
          mockDatasourceParametersWithRealJiraId,
        );

        expect(returnValue).toEqual(false);
      },
    );
  });
});

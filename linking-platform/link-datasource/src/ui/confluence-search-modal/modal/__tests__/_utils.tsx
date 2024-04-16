import { setupFactory } from '../../../../common/__tests__/_utils';
import { ConfigModalProps } from '../../../../common/types';
import {
  ConfluenceSearchDatasourceAdf,
  ConfluenceSearchDatasourceParameters,
} from '../../types';
import { ConfluenceSearchConfigModal } from '../index';

export const getDefaultParameters: () => ConfluenceSearchDatasourceParameters =
  () => ({
    cloudId: '67899',
    searchString: '',
  });

type InsertArgs = {
  parameters?: ConfluenceSearchDatasourceParameters;
  properties?: ConfluenceSearchDatasourceAdf['attrs']['datasource']['views'][0]['properties'];
  url?: string;
};

const {
  setup,
  getAvailableSites,
  getDefaultHookState,
  getErrorHookState,
  getEmptyHookState,
  getInsertAnalyticPayload,
  getLoadingHookState,
  getSingleResponseItemHookState,
  getUnauthorisedHookState,
  IssueLikeDataTableView,
  useDatasourceTableState,
} = setupFactory<
  ConfluenceSearchDatasourceParameters,
  InsertArgs,
  ConfluenceSearchDatasourceAdf
>(
  'confluence-search',
  ConfluenceSearchConfigModal as React.ForwardRefExoticComponent<
    ConfigModalProps<
      ConfluenceSearchDatasourceAdf,
      ConfluenceSearchDatasourceParameters
    >
  >,
  getDefaultParameters,
  args => {
    const adf: ConfluenceSearchDatasourceAdf = {
      type: 'blockCard',
      attrs: {
        url: args?.url,
        datasource: {
          id: 'some-confluence-search-datasource-id',
          parameters: {
            ...args.parameters,
            cloudId: args.parameters?.cloudId || '67899',
            searchString: args.parameters?.searchString || 'some-query',
          },
          views: [
            {
              type: 'table',
              properties: args.properties || {
                columns: [{ key: 'myColumn' }],
              },
            },
          ],
        },
      },
    };
    return adf;
  },
);

export {
  setup,
  getAvailableSites,
  getDefaultHookState,
  getErrorHookState,
  getEmptyHookState,
  getInsertAnalyticPayload,
  getLoadingHookState,
  getSingleResponseItemHookState,
  getUnauthorisedHookState,
  IssueLikeDataTableView,
  useDatasourceTableState,
};

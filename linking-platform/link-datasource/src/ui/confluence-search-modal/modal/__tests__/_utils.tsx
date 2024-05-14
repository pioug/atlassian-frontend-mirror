import { setupFactory } from '../../../../common/__tests__/_utils';
import { type ConfigModalProps } from '../../../../common/types';
import {
  type ConfluenceSearchDatasourceAdf,
  type ConfluenceSearchDatasourceParameters,
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
    const {
      cloudId = '67899',
      lastModified,
      lastModifiedFrom,
      lastModifiedTo,
      searchString,
    } = args.parameters || {};

    const adf: ConfluenceSearchDatasourceAdf = {
      type: 'blockCard',
      attrs: {
        url: args?.url,
        datasource: {
          id: 'some-confluence-search-datasource-id',
          parameters: {
            ...args.parameters,
            cloudId,
            searchString,
            lastModified,
            lastModifiedFrom,
            lastModifiedTo,
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

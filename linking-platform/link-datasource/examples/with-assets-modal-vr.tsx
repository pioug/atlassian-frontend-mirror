import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { mockAssetsClientFetchRequests } from '@atlaskit/link-test-helpers/assets';
import { mockDatasourceFetchRequests } from '@atlaskit/link-test-helpers/datasource';

import SmartLinkClient from '../examples-helpers/smartLinkCustomClient';
import {
  ASSETS_LIST_OF_LINKS_DATASOURCE_ID,
  AssetsDatasourceParameters,
} from '../src';
import JSMAssetsConfigModal from '../src/ui/assets-modal';

mockDatasourceFetchRequests(ASSETS_LIST_OF_LINKS_DATASOURCE_ID);
mockAssetsClientFetchRequests();
const mockParameters: AssetsDatasourceParameters = {
  aql: 'dummy aql',
  cloudId: '',
  schemaId: '1',
};
export default () => (
  <IntlProvider locale="en">
    <SmartCardProvider client={new SmartLinkClient()}>
      <JSMAssetsConfigModal
        datasourceId={ASSETS_LIST_OF_LINKS_DATASOURCE_ID}
        visibleColumnKeys={undefined}
        parameters={mockParameters}
        onCancel={() => {}}
        onInsert={() => {}}
      />
    </SmartCardProvider>
  </IntlProvider>
);

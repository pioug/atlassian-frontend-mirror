import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { mockDatasourceFetchRequests } from '@atlaskit/link-test-helpers/datasource';

import SmartLinkClient from '../examples-helpers/smartLinkCustomClient';
import { ASSETS_LIST_OF_LINKS_DATASOURCE_ID } from '../src';
import JSMAssetsConfigModal from '../src/ui/assets-modal';

mockDatasourceFetchRequests(ASSETS_LIST_OF_LINKS_DATASOURCE_ID);
export default () => (
  <IntlProvider locale="en">
    <SmartCardProvider client={new SmartLinkClient()}>
      <JSMAssetsConfigModal
        datasourceId={ASSETS_LIST_OF_LINKS_DATASOURCE_ID}
        visibleColumnKeys={undefined}
        parameters={undefined}
        onCancel={() => {}}
        onInsert={() => {}}
      />
    </SmartCardProvider>
  </IntlProvider>
);

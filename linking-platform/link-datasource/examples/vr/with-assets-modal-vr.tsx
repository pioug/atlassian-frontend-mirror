import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { mockAssetsClientFetchRequests } from '@atlaskit/link-test-helpers/assets';

import SmartLinkClient from '../../examples-helpers/smartLinkCustomClient';
import {
  ASSETS_LIST_OF_LINKS_DATASOURCE_ID,
  AssetsDatasourceParameters,
} from '../../src';
import JSMAssetsConfigModal from '../../src/ui/assets-modal';

const mockParameters: AssetsDatasourceParameters = {
  aql: 'dummy aql',
  workspaceId: '',
  schemaId: '1',
};

const visibleColumnKeys = [
  'Key',
  'Label',
  'Created',
  'Is Virtual',
  'Hardware Components',
  'Applications',
  'Software Services',
  'Number of Slots',
  'Primary Capability',
  'Owners',
  'Notes',
];

export default () => {
  mockAssetsClientFetchRequests({ delayedResponse: false });
  return (
    <IntlProvider locale="en">
      <SmartCardProvider client={new SmartLinkClient()}>
        <JSMAssetsConfigModal
          datasourceId={ASSETS_LIST_OF_LINKS_DATASOURCE_ID}
          visibleColumnKeys={visibleColumnKeys}
          parameters={mockParameters}
          onCancel={() => {}}
          onInsert={() => {}}
        />
      </SmartCardProvider>
    </IntlProvider>
  );
};

import React, { useState } from 'react';

import Button from '@atlaskit/button/standard-button';
import { SmartCardProvider } from '@atlaskit/link-provider';
import {
  defaultInitialVisibleConfluenceColumnKeys,
  mockBasicFilterAGGFetchRequests,
  mockDatasourceFetchRequests,
  mockSiteData,
} from '@atlaskit/link-test-helpers/datasource';

import SmartLinkClient from '../../examples-helpers/smartLinkCustomClient';
import { CONFLUENCE_SEARCH_DATASOURCE_ID } from '../../src/ui/confluence-search-modal';
import { ConfluenceSearchConfigModal } from '../../src/ui/confluence-search-modal/modal';
import { type ConfluenceSearchDatasourceParameters } from '../../src/ui/confluence-search-modal/types';

mockDatasourceFetchRequests({
  type: 'confluence',
  delayedResponse: false,
  shouldMockORSBatch: true,
  availableSitesOverride: mockSiteData.filter(
    site => !['test1', 'test2', 'test4'].includes(site.displayName),
  ),
});
mockBasicFilterAGGFetchRequests();

export default () => {
  const [showModal, setShowModal] = useState(false);
  const [parameters] = useState<ConfluenceSearchDatasourceParameters>({
    cloudId: '67899',
    searchString: 'Searched something',
  });
  const [visibleColumnKeys] = useState<string[] | undefined>(
    defaultInitialVisibleConfluenceColumnKeys,
  );

  const toggleIsOpen = () => setShowModal(prevOpenState => !prevOpenState);
  const closeModal = () => setShowModal(false);

  return (
    <SmartCardProvider client={new SmartLinkClient()}>
      <Button appearance="primary" onClick={toggleIsOpen}>
        Toggle Modal
      </Button>
      {showModal && (
        <ConfluenceSearchConfigModal
          datasourceId={CONFLUENCE_SEARCH_DATASOURCE_ID}
          visibleColumnKeys={visibleColumnKeys}
          parameters={parameters}
          onCancel={closeModal}
          onInsert={closeModal}
        />
      )}
    </SmartCardProvider>
  );
};

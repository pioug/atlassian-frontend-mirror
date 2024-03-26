import React, { useState } from 'react';

import Button from '@atlaskit/button';
import { SmartCardProvider } from '@atlaskit/link-provider';
import {
  defaultInitialVisibleJiraColumnKeys,
  forceBaseUrl,
} from '@atlaskit/link-test-helpers/datasource';

import SmartLinkClient from '../examples-helpers/smartLinkCustomClient';
import { CONFLUENCE_SEARCH_DATASOURCE_ID } from '../src/ui/confluence-search-modal';
import { ConfluenceSearchConfigModal } from '../src/ui/confluence-search-modal/modal';

forceBaseUrl('https://pug.jira-dev.com');

export const ConfluenceSearchConfigModalRealBackend = () => {
  const [showModal, setShowModal] = useState(true);

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
          visibleColumnKeys={defaultInitialVisibleJiraColumnKeys}
          onCancel={closeModal}
          onInsert={() => {}}
        />
      )}
    </SmartCardProvider>
  );
};

export default ConfluenceSearchConfigModalRealBackend;

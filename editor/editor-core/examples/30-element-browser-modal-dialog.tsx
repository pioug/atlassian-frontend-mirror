import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import {
  AnalyticsEventPayload,
  AnalyticsListener,
} from '@atlaskit/analytics-next';
import Button from '@atlaskit/button';
import Modal, { ModalTransition } from '@atlaskit/modal-dialog';
import InlineDialog from '@atlaskit/inline-dialog/src/InlineDialog';
import ElementBrowser from '../src/ui/ElementBrowser';
import { extensionProviderToQuickInsertProvider } from '../src/utils/extensions';
import { getConfluenceMacrosExtensionProvider } from '../example-helpers/confluence-macros';
import EditorActions from '../src/actions';

export default () => {
  const [showModal, setModalVisibility] = useState(false);
  const [showInlineModal, setInlineModalVisibility] = useState(false);

  const handleAnalytics = useCallback((event: AnalyticsEventPayload) => {
    console.groupCollapsed('gasv3 event:', event.payload.action);
    console.log(event.payload);
    console.groupEnd();
  }, []);

  return (
    <ModalExampleWrapper>
      <AnalyticsListener channel="editor" onEvent={handleAnalytics}>
        <Button onClick={() => setModalVisibility(true)}>
          Open Modal Dialog
        </Button>
        <ModalTransition>
          {showModal && (
            <Modal onClose={() => setModalVisibility(false)} width="x-large">
              <ElementBrowser
                quickInsertProvider={quickInsertProvider}
                showSearch={true}
                showCategories={true}
                mode="full"
              />
            </Modal>
          )}
        </ModalTransition>
        <InlineDialog
          onClose={() => setInlineModalVisibility(false)}
          content={
            <InlineBrowserWrapper>
              <ElementBrowser
                quickInsertProvider={quickInsertProvider}
                showSearch={true}
                showCategories={false}
                mode="inline"
              />
            </InlineBrowserWrapper>
          }
          isOpen={showInlineModal}
        >
          <Button
            isSelected={showInlineModal}
            onClick={() => setInlineModalVisibility(show => !show)}
          >
            {showInlineModal ? 'Close' : 'Open'} Inline Browser
          </Button>
        </InlineDialog>
      </AnalyticsListener>
    </ModalExampleWrapper>
  );
};

const quickInsertProvider = extensionProviderToQuickInsertProvider(
  getConfluenceMacrosExtensionProvider({} as EditorActions),
  {} as EditorActions,
);

const ModalExampleWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 50%;
`;

const InlineBrowserWrapper = styled.div`
  display: flex;
  max-height: inherit;
  width: 320px;
  margin: -8px -16px;
`;

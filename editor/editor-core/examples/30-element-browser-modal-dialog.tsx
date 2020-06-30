import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import {
  AnalyticsEventPayload,
  AnalyticsListener,
} from '@atlaskit/analytics-next';
import { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
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
            <Modal
              onClose={() => setModalVisibility(false)}
              height="720px"
              width="x-large"
              autoFocus={false}
              components={{
                Body: RenderElementBrowser,
              }}
            />
          )}
        </ModalTransition>
        <InlineDialog
          onClose={() => setInlineModalVisibility(false)}
          content={
            <InlineBrowserWrapper>
              <ElementBrowser
                categories={categoriesList}
                quickInsertProvider={quickInsertProvider}
                showSearch={true}
                showCategories={false}
                mode="inline"
                onSelectItem={onSelectItem}
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

const onSelectItem = (item: QuickInsertItem) => {
  console.log('Selected item ', item);
};

const RenderElementBrowser = () => (
  <ModalBrowserWrapper>
    <ElementBrowser
      categories={categoriesList}
      quickInsertProvider={quickInsertProvider}
      showSearch={true}
      showCategories={true}
      mode="full"
      defaultCategory="all"
      onSelectItem={onSelectItem}
    />
  </ModalBrowserWrapper>
);

const ModalBrowserWrapper = styled.div`
  flex: 1 1 auto;
  height: 100%;
  margin: 24px;
  overflow: hidden;
`;

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
  min-height: inherit;
  max-height: inherit;
  width: 320px;
  margin: 0 -16px;
`;

const categoriesList = [
  { title: 'All', name: 'all' },
  { title: 'Formatting', name: 'formatting' },
  { title: 'Confluence content', name: 'confluence-content' },
  { title: 'Media', name: 'media' },
  { title: 'Visuals & images', name: 'visuals' },
  { title: 'Navigation', name: 'navigation' },
  { title: 'External content', name: 'external-content' },
  { title: 'Communication', name: 'communication' },
  { title: 'Reporting', name: 'reporting' },
  { title: 'Administration', name: 'admin' },
  { title: 'Development', name: 'development' },
];

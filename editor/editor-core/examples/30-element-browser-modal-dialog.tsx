import React, { useState, useCallback } from 'react';
import { IntlProvider } from 'react-intl';
import styled from 'styled-components';
import {
  AnalyticsEventPayload,
  AnalyticsListener,
} from '@atlaskit/analytics-next';
import { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import Button from '@atlaskit/button/standard-button';
import InlineDialog from '@atlaskit/inline-dialog/src/InlineDialog';
import ElementBrowser from '../src/ui/ElementBrowser';
import ModalElementBrowser from '../src/ui/ElementBrowser/ModalElementBrowser';
import { useDefaultQuickInsertGetItems } from '../example-helpers/use-default-quickinsert-get-items';

export default () => {
  const getItems = useDefaultQuickInsertGetItems();
  const [showModal, setModalVisibility] = useState(false);
  const [showInlineModal, setInlineModalVisibility] = useState(false);

  const handleAnalytics = useCallback((event: AnalyticsEventPayload) => {
    console.groupCollapsed('gasv3 event:', event.payload.action);
    console.log(event.payload);
    console.groupEnd();
  }, []);

  const onInlineDialogClose = React.useCallback(
    () => setInlineModalVisibility(false),
    [setInlineModalVisibility],
  );

  const onEscapeKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onInlineDialogClose();
      }
    },
    [onInlineDialogClose],
  );

  return (
    <ModalExampleWrapper>
      <AnalyticsListener channel="editor" onEvent={handleAnalytics}>
        <Button
          onClick={() => setModalVisibility(true)}
          testId="ModalElementBrowser__example__open_button"
        >
          Open Modal Dialog
        </Button>
        <IntlProvider locale="en">
          <>
            <ModalElementBrowser
              getItems={getItems}
              onInsertItem={onInsertItem}
              isOpen={showModal}
              onClose={() => setModalVisibility(false)}
            />

            <div onKeyDown={onEscapeKeyDown}>
              <InlineDialog
                onClose={() => setInlineModalVisibility(false)}
                content={
                  <InlineBrowserWrapper>
                    <ElementBrowser
                      getItems={getItems}
                      showSearch={true}
                      showCategories={false}
                      mode="inline"
                      onInsertItem={onInsertItem}
                    />
                  </InlineBrowserWrapper>
                }
                isOpen={showInlineModal}
              >
                <Button
                  isSelected={showInlineModal}
                  onClick={() => setInlineModalVisibility((show) => !show)}
                  testId="InlineElementBrowser__example__open_button"
                >
                  {showInlineModal ? 'Close' : 'Open'} Inline Browser
                </Button>
              </InlineDialog>
            </div>
          </>
        </IntlProvider>
      </AnalyticsListener>
    </ModalExampleWrapper>
  );
};

const onInsertItem = (item: QuickInsertItem) => {
  console.log('Inserting item ', item);
};

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
  height: 480px; // The internal AutoSizer component for react-virtualized needs a fixed height from parent level.
  margin: -16px -24px;
`;

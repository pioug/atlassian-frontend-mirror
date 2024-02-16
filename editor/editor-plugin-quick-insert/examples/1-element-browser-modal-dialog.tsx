/** @jsx jsx */
import React, { Fragment, useCallback, useState } from 'react';

import { css, jsx } from '@emotion/react';
import { IntlProvider } from 'react-intl-next';

import type { AnalyticsEventPayload } from '@atlaskit/analytics-next';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import Button from '@atlaskit/button/standard-button';
import { ElementBrowser } from '@atlaskit/editor-common/element-browser';
import type { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import { EditorContext } from '@atlaskit/editor-core';
import { useDefaultQuickInsertGetItems } from '@atlaskit/editor-core/example-helpers/use-default-quickinsert-get-items';
import InlineDialog from '@atlaskit/inline-dialog';
import { token } from '@atlaskit/tokens';

import ModalElementBrowser from '../src/ui/ModalElementBrowser/ModalElementBrowser';

const modalExampleWrapperStyles = css({
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  height: '50%',
});

const inlineBrowserWrapperStyles = css({
  display: 'flex',
  minHeight: 'inherit',
  maxHeight: 'inherit',
  width: '320px',
  height: '480px', // The internal AutoSizer component for react-virtualized needs a fixed height from parent level.
  margin: `${token('space.negative.200', '-16px')} ${token(
    'space.negative.300',
    '-24px',
  )}`,
});

const onInsertItem = (item: QuickInsertItem) => {
  console.log('Inserting item ', item);
};

const ElementBrowserModalDialog = () => {
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
    <div css={modalExampleWrapperStyles}>
      <AnalyticsListener channel="editor" onEvent={handleAnalytics}>
        <Button
          onClick={() => setModalVisibility(true)}
          testId="ModalElementBrowser__example__open_button"
        >
          Open Modal Dialog
        </Button>
        <IntlProvider locale="en">
          <Fragment>
            <ModalElementBrowser
              getItems={getItems}
              onInsertItem={onInsertItem}
              isOpen={showModal}
              onClose={() => setModalVisibility(false)}
              onCloseComplete={() => {}}
            />

            <div onKeyDown={onEscapeKeyDown}>
              <InlineDialog
                onClose={() => setInlineModalVisibility(false)}
                content={
                  <div css={inlineBrowserWrapperStyles}>
                    <ElementBrowser
                      getItems={getItems}
                      showSearch={true}
                      showCategories={false}
                      mode="inline"
                      onInsertItem={onInsertItem}
                    />
                  </div>
                }
                isOpen={showInlineModal}
              >
                <Button
                  isSelected={showInlineModal}
                  onClick={() => setInlineModalVisibility(show => !show)}
                  testId="InlineElementBrowser__example__open_button"
                >
                  {showInlineModal ? 'Close' : 'Open'} Inline Browser
                </Button>
              </InlineDialog>
            </div>
          </Fragment>
        </IntlProvider>
      </AnalyticsListener>
    </div>
  );
};

export default () => (
  <EditorContext>
    <ElementBrowserModalDialog />
  </EditorContext>
);

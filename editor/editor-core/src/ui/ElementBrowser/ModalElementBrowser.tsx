import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import { DN50, N0 } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { borderRadius } from '@atlaskit/theme/constants';
import { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';

import Button from '@atlaskit/button/custom-theme-button';
import Modal, {
  ModalFooter,
  ModalTransition,
  FooterComponentProps,
} from '@atlaskit/modal-dialog';

import ElementBrowser from './components/ElementBrowserLoader';
import { getCategories } from './categories';
import { MODAL_WRAPPER_PADDING } from './constants';

export interface State {
  isOpen: boolean;
}

export interface Props {
  getItems: (query?: string, category?: string) => QuickInsertItem[];
  onInsertItem: (item: QuickInsertItem) => void;
  isOpen?: boolean;
  onClose: () => void;
}

const ModalElementBrowser = (props: Props & InjectedIntlProps) => {
  const [selectedItem, setSelectedItem] = useState<QuickInsertItem>();

  const onSelectItem = useCallback(
    (item: QuickInsertItem) => {
      setSelectedItem(item);
    },
    [setSelectedItem],
  );

  const onInsertItem = useCallback(
    (item: QuickInsertItem) => {
      props.onInsertItem(item);
    },
    [props],
  );

  const RenderFooter = useCallback(
    (footerProps: FooterComponentProps) => (
      <Footer {...footerProps} onInsert={() => onInsertItem(selectedItem!)} />
    ),
    [onInsertItem, selectedItem],
  );

  // Since Modal uses stackIndex it's shouldCloseOnEscapePress prop doesn't work.
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        props.onClose();
      }
    },
    [props],
  );

  const RenderBody = useCallback(
    () => (
      <Wrapper>
        <ElementBrowser
          categories={getCategories(props.intl)}
          getItems={props.getItems}
          showSearch={true}
          showCategories
          mode="full"
          onSelectItem={onSelectItem}
          onInsertItem={onInsertItem}
        />
      </Wrapper>
    ),
    [props.intl, props.getItems, onSelectItem, onInsertItem],
  );

  const components = {
    Body: RenderBody,
    Footer: RenderFooter,
  };

  return (
    <div data-editor-popup={true} onClick={onModalClick} onKeyDown={onKeyDown}>
      <ModalTransition>
        {props.isOpen && (
          <Modal
            stackIndex={
              1 /** setting stackIndex 1 disables focus control in the modal dialog which was causing conflicts with insertion methods from prosemirror */
            }
            key="element-browser-modal"
            onClose={props.onClose}
            height="664px"
            width="x-large"
            autoFocus={false}
            components={components}
            // defaults to true and doesn't work along with stackIndex=1.
            // packages/design-system/modal-dialog/src/components/Content.tsx Line 287
            shouldCloseOnEscapePress={false}
          />
        )}
      </ModalTransition>
    </div>
  );
};

ModalElementBrowser.displayName = 'ModalElementBrowser';

// Prevent ModalElementBrowser click propagation through to the editor.
const onModalClick = (e: React.MouseEvent) => e.stopPropagation();

const Footer = ({
  onInsert,
  onClose,
  showKeyline,
}: FooterComponentProps & { onInsert: () => void }) => {
  return (
    <ModalFooter
      showKeyline={showKeyline}
      style={{ padding: MODAL_WRAPPER_PADDING }}
    >
      <span />
      <Actions>
        <ActionItem>
          <Button
            appearance="primary"
            onClick={onInsert}
            testId="ModalElementBrowser__insert-button"
          >
            Insert
          </Button>
        </ActionItem>
        <ActionItem>
          <Button
            appearance="subtle"
            onClick={onClose}
            testId="ModalElementBrowser__close-button"
          >
            Close
          </Button>
        </ActionItem>
      </Actions>
    </ModalFooter>
  );
};

const Actions = styled.div`
  display: inline-flex;
  margin: 0 -4px;
`;

const ActionItem = styled.div`
  flex: 1 0 auto;
  margin: 0 4px;
`;

const Wrapper = styled.div`
  display: flex;
  flex: 1 1 auto;
  box-sizing: border-box;
  padding: ${MODAL_WRAPPER_PADDING}px ${MODAL_WRAPPER_PADDING}px 0 10px;
  overflow: hidden;
  background-color: ${themed({ light: N0, dark: DN50 })()};
  border-radius: ${borderRadius()}px;
`;

export default injectIntl(ModalElementBrowser);

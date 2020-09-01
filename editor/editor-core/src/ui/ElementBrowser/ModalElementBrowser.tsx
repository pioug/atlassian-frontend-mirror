import React, { useRef, useCallback } from 'react';
import styled from 'styled-components';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import { DN50, N0 } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { borderRadius } from '@atlaskit/theme/constants';
import { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';

import Button from '@atlaskit/button';
import Modal, {
  ModalFooter,
  ModalTransition,
  FooterComponentProps,
} from '@atlaskit/modal-dialog';

import ElementBrowser from './components/ElementBrowserLoader';
import { getCategories } from './categories';
import { GRID_SIZE } from './constants';

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
  let selectedItemRef = useRef<QuickInsertItem>();

  const onSelectItem = useCallback(
    (item: QuickInsertItem) => {
      selectedItemRef.current = item;
    },
    [selectedItemRef],
  );

  const onInsertItem = useCallback(
    (item: QuickInsertItem) => {
      props.onInsertItem(item);
    },
    [props],
  );

  return (
    <ModalTransition>
      {props.isOpen && (
        <Modal
          stackIndex={
            1 /** setting stackIndex 1 disables focus control in the modal dialog which was causing conflicts with insertion methods from prosemirror */
          }
          key="element-browser-modal"
          onClose={props.onClose}
          height="720px"
          width="x-large"
          autoFocus={false}
          components={{
            Body: () => (
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
            Footer: footerProps => (
              <Footer
                {...footerProps}
                onInsert={() => onInsertItem(selectedItemRef.current!)}
              />
            ),
          }}
        />
      )}
    </ModalTransition>
  );
};

ModalElementBrowser.displayName = 'ModalElementBrowser';

const Footer = ({
  onInsert,
  onClose,
  showKeyline,
}: FooterComponentProps & { onInsert: () => void }) => {
  return (
    <ModalFooter showKeyline={showKeyline}>
      <span />
      <Actions>
        <ActionItem>
          <Button
            appearance="primary"
            onClick={onInsert}
            data-testid="ModalElementBrowser__insert-button"
          >
            Insert
          </Button>
        </ActionItem>
        <ActionItem>
          <Button
            appearance="subtle"
            onClick={onClose}
            data-testid="ModalElementBrowser__cancel-button"
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
  margin: 0 -${GRID_SIZE / 2}px;
`;

const ActionItem = styled.div`
  flex: 1 0 auto;
  margin: 0 ${GRID_SIZE / 2}px;
`;

const Wrapper = styled.div`
  flex: 1 1 auto;
  height: 100%;
  padding: 24px 24px 0 24px;
  overflow: hidden;
  background-color: ${themed({ light: N0, dark: DN50 })()};
  border-radius: ${borderRadius()}px;
`;

export default injectIntl(ModalElementBrowser);

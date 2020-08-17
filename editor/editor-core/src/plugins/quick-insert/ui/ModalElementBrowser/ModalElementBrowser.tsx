import React from 'react';
import styled from 'styled-components';

import { DN50, N0, N30A, N60A } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { borderRadius } from '@atlaskit/theme/constants';
import { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';

import Modal, { ModalTransition } from '@atlaskit/modal-dialog';
import ElementBrowser from '../../../../ui/ElementBrowser';

const ModalBrowserWrapper = styled.div`
  flex: 1 1 auto;
  height: 100%;
  padding: 24px;
  overflow: hidden;
  background-color: ${themed({ light: N0, dark: DN50 })()};
  border-radius: ${borderRadius()}px;
  box-shadow: 0 0 0 1px ${N30A}, 0 2px 1px ${N30A}, 0 0 20px -6px ${N60A};
`;

export interface State {
  isOpen: boolean;
}

export interface Props {
  getItems: (
    query?: string,
    category?: string,
  ) => QuickInsertItem[] | Promise<QuickInsertItem[]>;
  onSelectItem: (item: QuickInsertItem) => void;
  isOpen?: boolean;
  onClose: () => void;
}

const categories = [
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

const ModalElementBrowser = (props: Props) => (
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
        isChromeless
      >
        <ModalBrowserWrapper>
          <ElementBrowser
            categories={categories}
            getItems={props.getItems}
            showSearch={true}
            showCategories
            mode="full"
            onSelectItem={props.onSelectItem}
          />
        </ModalBrowserWrapper>
      </Modal>
    )}
  </ModalTransition>
);

export default ModalElementBrowser;

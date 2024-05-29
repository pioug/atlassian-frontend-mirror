/** @jsx jsx */

import { jsx } from '@emotion/react';

import { FormattedMessage } from 'react-intl-next';

import Button from '@atlaskit/button/new';
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '@atlaskit/modal-dialog';

import { messages } from '../../../messages';
import { type RelatedLinksBaseModalProps } from './types';

const RelatedLinksBaseModal = ({
  onClose,
  showModal,
  children,
}: RelatedLinksBaseModalProps) => {
  return (
    <ModalTransition>
      {showModal && (
        <Modal
          onClose={onClose}
          width={"small"}
        >
          <ModalHeader>
            <ModalTitle>
              <FormattedMessage
                {...messages.related_links_modal_title}
              />
            </ModalTitle>
          </ModalHeader>
          <ModalBody>
            {children}
          </ModalBody>
          <ModalFooter>
            <Button appearance="primary" onClick={onClose}>
              <FormattedMessage {...messages.close} />
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </ModalTransition>
  );
};

export default RelatedLinksBaseModal;

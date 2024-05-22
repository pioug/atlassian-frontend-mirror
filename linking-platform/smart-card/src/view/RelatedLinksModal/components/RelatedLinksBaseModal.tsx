import React from 'react';
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
import { type RelatedLinksModalProps } from '../types';

const RelatedLinksModal = ({
  onClose,
  showModal,
  children,
}: RelatedLinksModalProps) => {
  return (
    <ModalTransition>
      {showModal && (
        <Modal onClose={onClose}>
          <ModalHeader>
            <ModalTitle>
              <FormattedMessage
                {...messages.related_links_modal_title_nonfinal}
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

export default RelatedLinksModal;

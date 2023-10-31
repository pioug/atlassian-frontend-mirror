import React from 'react';

import { useIntl } from 'react-intl-next';

import Button from '@atlaskit/button';
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '@atlaskit/modal-dialog';

import messages from './messages';

export type ConfirmDismissDialogProps = {
  active: boolean;
  onCancelDismiss?: () => void;
  onConfirmDismiss?: () => void;
};

export const ConfirmDismissDialog = ({
  active,
  onCancelDismiss,
  onConfirmDismiss,
}: ConfirmDismissDialogProps) => {
  const intl = useIntl();

  return (
    <ModalTransition>
      {active && (
        <Modal
          testId="link-create-confirm-dismiss-dialog"
          onClose={onCancelDismiss}
          width="small"
        >
          <ModalHeader>
            <ModalTitle>{intl.formatMessage(messages.title)}</ModalTitle>
          </ModalHeader>
          <ModalBody>{intl.formatMessage(messages.description)}</ModalBody>
          <ModalFooter>
            <Button appearance="subtle" onClick={onCancelDismiss}>
              {intl.formatMessage(messages.cancelButtonLabel)}
            </Button>
            <Button appearance="primary" onClick={onConfirmDismiss}>
              {intl.formatMessage(messages.confirmButtonLabel)}
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </ModalTransition>
  );
};

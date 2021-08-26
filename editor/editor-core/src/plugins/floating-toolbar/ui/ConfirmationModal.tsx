import React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import Button from '@atlaskit/button/standard-button';

import Modal, {
  ModalTransition,
  ModalBody,
  ModalTitle,
  ModalHeader,
  ModalFooter,
} from '@atlaskit/modal-dialog';

import messages from './messages';
import { ConfirmDialogOptions } from '../types';

type ConfirmationDialogProps = {
  onConfirm: () => void;
  onClose: () => void;
  options?: ConfirmDialogOptions;
  testId?: string;
};

const ConfirmationModalImpl = (
  props: ConfirmationDialogProps & InjectedIntlProps,
) => {
  const {
    onConfirm,
    onClose,
    options,
    intl: { formatMessage },
    testId,
  } = props;

  const heading =
    options?.title || formatMessage(messages.confirmModalDefaultHeading);
  const okButtonLabel =
    options?.okButtonLabel || formatMessage(messages.confirmModalOK);
  const cancelButtonLabel =
    options?.cancelButtonLabel || formatMessage(messages.confirmModalCancel);

  return (
    <ModalTransition>
      {options && (
        <Modal onClose={onClose} testId={testId}>
          <ModalHeader>
            <ModalTitle appearance="warning">{heading}</ModalTitle>
          </ModalHeader>

          <ModalBody>
            <p>{options.message}</p>
          </ModalBody>
          <ModalFooter>
            <Button
              appearance="default"
              onClick={onClose}
              testId={testId ? `${testId}-cancel-button` : undefined}
            >
              {cancelButtonLabel}
            </Button>
            <Button
              appearance="warning"
              onClick={onConfirm}
              testId={testId ? `${testId}-confirm-button` : undefined}
            >
              {okButtonLabel}
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </ModalTransition>
  );
};

export const ConfirmationModal = injectIntl(ConfirmationModalImpl);

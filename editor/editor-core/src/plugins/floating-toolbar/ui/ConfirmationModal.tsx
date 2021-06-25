import React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import Modal, { ModalTransition, ActionProps } from '@atlaskit/modal-dialog';

import messages from './messages';
import { ConfirmDialogOptions } from '../types';

type ConfirmationDialogProps = {
  onConfirm: () => void;
  onClose: () => void;
  options?: ConfirmDialogOptions;
};

const ConfirmationModalImpl = (
  props: ConfirmationDialogProps & InjectedIntlProps,
) => {
  const {
    onConfirm,
    onClose,
    options,
    intl: { formatMessage },
  } = props;

  const heading =
    options?.title || formatMessage(messages.confirmModalDefaultHeading);
  const okButtonLabel =
    options?.okButtonLabel || formatMessage(messages.confirmModalOK);
  const cancelButtonLabel =
    options?.cancelButtonLabel || formatMessage(messages.confirmModalCancel);

  const actionButtons: ActionProps[] = [
    {
      text: cancelButtonLabel,
      appearance: 'default',
      onClick: onClose,
    },
    {
      text: okButtonLabel,
      appearance: 'warning',
      onClick: onConfirm,
    },
  ];

  return (
    <ModalTransition>
      {options && (
        <Modal
          actions={actionButtons}
          onClose={onClose}
          heading={heading}
          appearance="warning"
        >
          <p>{options.message}</p>
        </Modal>
      )}
    </ModalTransition>
  );
};

export const ConfirmationModal = injectIntl(ConfirmationModalImpl);

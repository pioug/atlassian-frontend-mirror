import React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import Modal, { ModalTransition, ActionProps } from '@atlaskit/modal-dialog';

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

  const actionButtons: ActionProps[] = [
    {
      text: cancelButtonLabel,
      appearance: 'default',
      onClick: onClose,
      testId: testId ? `${testId}-cancel-button` : undefined,
    },
    {
      text: okButtonLabel,
      appearance: 'warning',
      onClick: onConfirm,
      testId: testId ? `${testId}-confirm-button` : undefined,
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
          testId={testId}
        >
          <p>{options.message}</p>
        </Modal>
      )}
    </ModalTransition>
  );
};

export const ConfirmationModal = injectIntl(ConfirmationModalImpl);

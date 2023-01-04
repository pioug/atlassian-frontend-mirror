import React from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl-next';
import { ConfirmationDialogProps } from './types';
import { SimpleModal } from './SimpleModal';
import { CheckboxModal } from './CheckboxModal';
import { ModalTransition } from '@atlaskit/modal-dialog';

const ConfirmationModalImpl = (
  props: ConfirmationDialogProps & WrappedComponentProps,
) => {
  const { options } = props;

  const renderModel = (isReferentialityDialog: boolean = false) =>
    isReferentialityDialog ? (
      <CheckboxModal {...props} />
    ) : (
      <SimpleModal {...props} />
    );

  return options ? (
    <ModalTransition>
      {renderModel(options?.isReferentialityDialog)}
    </ModalTransition>
  ) : null;
};

export const ConfirmationModal = injectIntl(ConfirmationModalImpl);

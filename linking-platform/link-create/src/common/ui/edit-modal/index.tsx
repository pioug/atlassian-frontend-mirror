import React from 'react';

import { ModalTransition } from '@atlaskit/modal-dialog';

import { type CreatePayload, type LinkCreatePlugin } from '../../types';
import { Modal } from '../ModalDialog';

type EditModalProps = {
  onClose: () => void;
  onCloseComplete?: React.ComponentProps<typeof Modal>['onCloseComplete'];
  editViewPayload?: CreatePayload;
  activePlugin?: LinkCreatePlugin<string> | null;
};

const SCREEN = 'linkCreateEditScreen';

export const EditModal = ({
  onClose,
  onCloseComplete,
  editViewPayload,
  activePlugin,
}: EditModalProps) => (
  <ModalTransition>
    {!!editViewPayload && (
      <>
        <Modal
          testId="link-create-edit-modal"
          screen={SCREEN}
          onClose={onClose}
          shouldScrollInViewport={true}
          width="calc(100vw - 120px)"
          height="calc(100vh - 120px)"
          onCloseComplete={onCloseComplete}
        >
          {activePlugin?.editView?.({ payload: editViewPayload, onClose })}
        </Modal>
      </>
    )}
  </ModalTransition>
);

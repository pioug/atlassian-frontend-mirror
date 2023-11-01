import React from 'react';

import Modal, { ModalTransition } from '@atlaskit/modal-dialog';

import { useEditPostCreateModal } from '../../../controllers/edit-post-create-context';

export const EditModal = ({ onClose }: { onClose?: () => void }) => {
  const { editViewPayload } = useEditPostCreateModal();

  return (
    <ModalTransition>
      {!!editViewPayload && (
        <Modal
          testId="link-create-edit-modal"
          onClose={onClose}
          shouldScrollInViewport={true}
          width="calc(100vw - 120px)"
          height="calc(100vh - 120px)"
        ></Modal>
      )}
    </ModalTransition>
  );
};

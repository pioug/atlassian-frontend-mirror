import React from 'react';

import Modal, { ModalTransition } from '@atlaskit/modal-dialog';

import { useEditPostCreateModal } from '../../../controllers/edit-post-create-context';
import { useLinkCreatePlugins } from '../../../controllers/plugin-context';

type EditModalProps = {
  onClose: () => void;
  onCloseComplete?: React.ComponentProps<typeof Modal>['onCloseComplete'];
};

export const EditModal = ({ onClose, onCloseComplete }: EditModalProps) => {
  const { editViewPayload } = useEditPostCreateModal();
  const { activePlugin } = useLinkCreatePlugins();

  return (
    <ModalTransition>
      {!!editViewPayload && (
        <Modal
          testId="link-create-edit-modal"
          onClose={onClose}
          shouldScrollInViewport={true}
          width="calc(100vw - 120px)"
          height="calc(100vh - 120px)"
          onCloseComplete={onCloseComplete}
        >
          {activePlugin?.editView?.({ payload: editViewPayload, onClose })}
        </Modal>
      )}
    </ModalTransition>
  );
};

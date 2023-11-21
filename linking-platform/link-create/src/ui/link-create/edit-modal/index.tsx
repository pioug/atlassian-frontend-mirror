import React from 'react';

import { ModalTransition } from '@atlaskit/modal-dialog';

import { Modal } from '../../../common/ui/ModalDialog';
import { useEditPostCreateModal } from '../../../controllers/edit-post-create-context';
import { useLinkCreatePlugins } from '../../../controllers/plugin-context';

type EditModalProps = {
  onClose: () => void;
  onCloseComplete?: React.ComponentProps<typeof Modal>['onCloseComplete'];
};

const SCREEN = 'linkCreateEditScreen';
export const EditModal = ({ onClose, onCloseComplete }: EditModalProps) => {
  const { editViewPayload } = useEditPostCreateModal();
  const { activePlugin } = useLinkCreatePlugins();

  return (
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
};

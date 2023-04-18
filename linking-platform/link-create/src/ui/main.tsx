/** @jsx jsx */
import { jsx } from '@emotion/react';

import Modal, {
  ModalBody,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '@atlaskit/modal-dialog';

import { LinkCreateCallbackProvider } from '../controllers/callback-context';

import { LinkCreateProps } from './types';

export default function LinkCreate({
  plugins,
  testId,
  groupKey,
  entityKey,
  onCreate,
  onFailure,
  onCancel,
  active,
}: LinkCreateProps) {
  const chosenOne = plugins.find(plugin => plugin.key === entityKey);

  if (!chosenOne) {
    throw new Error('Make sure you specified a valid entityKey');
  }

  return (
    <ModalTransition>
      {!!active && (
        <Modal onClose={onCancel} testId={testId}>
          <ModalHeader>
            <ModalTitle>Create New</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <LinkCreateCallbackProvider
              onCreate={onCreate}
              onFailure={onFailure}
              onCancel={onCancel}
            >
              {chosenOne.form}
            </LinkCreateCallbackProvider>
          </ModalBody>
        </Modal>
      )}
    </ModalTransition>
  );
}

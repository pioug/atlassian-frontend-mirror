/** @jsx jsx */
import { memo } from 'react';

import { jsx } from '@emotion/react';

import Modal, {
  ModalBody,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '@atlaskit/modal-dialog';

import { LinkCreateCallbackProvider } from '../controllers/callback-context';

import { ErrorBoundary } from './error-boundary';
import { LinkCreateProps } from './types';

function ComposedLinkCreate({
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
    <LinkCreateCallbackProvider
      onCreate={onCreate}
      onFailure={onFailure}
      onCancel={onCancel}
    >
      {chosenOne.form}
    </LinkCreateCallbackProvider>
  );
}

const LinkCreate = memo((props: LinkCreateProps) => {
  return (
    <ModalTransition>
      {!!props.active && (
        <Modal
          onClose={props.onCancel}
          testId={props.testId}
          shouldScrollInViewport={true}
        >
          <ModalHeader>
            <ModalTitle>Create New</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <ErrorBoundary>
              <ComposedLinkCreate {...props} />
            </ErrorBoundary>
          </ModalBody>
        </Modal>
      )}
    </ModalTransition>
  );
});

export default LinkCreate;

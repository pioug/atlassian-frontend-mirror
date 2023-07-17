/** @jsx jsx */
import { Fragment, useCallback } from 'react';

import { jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';

import Modal, {
  ModalBody,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '@atlaskit/modal-dialog';

import { CREATE_FORM_MAX_WIDTH_IN_PX } from '../../common/constants';
import {
  CreatePayload,
  LinkCreateProps,
  LinkCreateWithModalProps,
} from '../../common/types';
import { LinkCreateCallbackProvider } from '../../controllers/callback-context';
import {
  useFormContext,
  withLinkCreateFormContext,
} from '../../controllers/form-context';

import { ErrorBoundary } from './error-boundary';
import { messages } from './messages';
import TrackMount from './track-mount';

export const TEST_ID = 'link-create';

const LinkCreateContent = ({ plugins, entityKey }: LinkCreateProps) => {
  const chosenOne = plugins.find(plugin => plugin.key === entityKey);

  if (!chosenOne) {
    throw new Error('Make sure you specified a valid entityKey');
  }

  return <Fragment>{chosenOne.form}</Fragment>;
};

const LinkCreate = withLinkCreateFormContext(
  ({
    testId = TEST_ID,
    onCreate,
    onFailure,
    onCancel,
    ...restProps
  }: LinkCreateProps) => {
    const { setFormErrorMessage } = useFormContext();

    const handleCreate = useCallback(
      async (result: CreatePayload) => {
        // Reset the form error message
        setFormErrorMessage(undefined);
        if (onCreate) {
          await onCreate(result);
        }
      },
      [onCreate, setFormErrorMessage],
    );

    const handleFailure = useCallback(
      (errorMessage: string) => {
        // Set the form error message
        setFormErrorMessage(errorMessage);
        onFailure && onFailure(errorMessage);
      },
      [onFailure, setFormErrorMessage],
    );

    return (
      <div data-testid={testId}>
        <ErrorBoundary>
          <LinkCreateCallbackProvider
            onCancel={onCancel}
            onCreate={handleCreate}
            onFailure={handleFailure}
          >
            <TrackMount />
            <LinkCreateContent {...restProps} />
          </LinkCreateCallbackProvider>
        </ErrorBoundary>
      </div>
    );
  },
);

const LinkCreateWithModal = ({
  active,
  modalTitle,
  onOpenComplete,
  onCloseComplete,
  ...createProps
}: LinkCreateWithModalProps) => {
  const intl = useIntl();

  return (
    <ModalTransition>
      {!!active && (
        <Modal
          testId="link-create-modal"
          onClose={createProps.onCancel}
          shouldScrollInViewport={true}
          onOpenComplete={onOpenComplete}
          onCloseComplete={onCloseComplete}
          width={`${CREATE_FORM_MAX_WIDTH_IN_PX}px`}
        >
          <ModalHeader>
            <ModalTitle>
              {modalTitle || intl.formatMessage(messages.heading)}
            </ModalTitle>
          </ModalHeader>
          <ModalBody>
            <LinkCreate {...createProps} />
          </ModalBody>
        </Modal>
      )}
    </ModalTransition>
  );
};

export default LinkCreateWithModal;

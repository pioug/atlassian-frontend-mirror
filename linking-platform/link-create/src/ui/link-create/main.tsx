/** @jsx jsx */
import { Fragment, useCallback, useState } from 'react';

import { jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';

import Modal, {
  ModalBody,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '@atlaskit/modal-dialog';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { Box } from '@atlaskit/primitives';

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

import { ConfirmDismissDialog } from './confirm-dismiss-dialog';
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

const LinkCreate = ({
  testId = TEST_ID,
  onCreate,
  onFailure,
  onCancel,
  triggeredFrom,
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
    (error: Error) => {
      // Set the form error message
      setFormErrorMessage(error.message);
      onFailure && onFailure(error);
    },
    [onFailure, setFormErrorMessage],
  );

  return (
    <Box testId={testId}>
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
    </Box>
  );
};

const LinkCreateWithModal = ({
  active,
  modalTitle,
  onCancel,
  onOpenComplete,
  onCloseComplete,
  ...createProps
}: LinkCreateWithModalProps) => {
  const [dismissDialog, setDismissDialog] = useState(false);

  const { isFormDirty } = useFormContext();
  const intl = useIntl();

  const handleCancel = useCallback(() => {
    if (
      getBooleanFF(
        'platform.linking-platform.link-create.confirm-dismiss-dialog',
      )
    ) {
      if (isFormDirty()) {
        return setDismissDialog(true);
      }
    }

    onCancel && onCancel();
  }, [onCancel, isFormDirty]);

  const handleCancelDismiss = useCallback(() => {
    setDismissDialog(false);
  }, []);

  const handleConfirmDismiss = useCallback(() => {
    setDismissDialog(false);
    onCancel && onCancel();
  }, [onCancel]);

  return (
    <Fragment>
      <ModalTransition>
        {!!active && (
          <Modal
            testId="link-create-modal"
            onClose={handleCancel}
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
              <LinkCreate {...createProps} onCancel={handleCancel} />
            </ModalBody>
          </Modal>
        )}
      </ModalTransition>
      <ConfirmDismissDialog
        active={dismissDialog}
        onCancelDismiss={handleCancelDismiss}
        onConfirmDismiss={handleConfirmDismiss}
      />
    </Fragment>
  );
};

export default withLinkCreateFormContext(LinkCreateWithModal);

/** @jsx jsx */
import { useCallback, useLayoutEffect, useRef, useState } from 'react';

import { jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';

import {
  ModalBody,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '@atlaskit/modal-dialog';
import { Box } from '@atlaskit/primitives';

import { CREATE_FORM_MAX_WIDTH_IN_PX } from '../../common/constants';
import type { LinkCreateWithModalProps } from '../../common/types';
import { ConfirmDismissDialog } from '../../common/ui/confirm-dismiss-dialog';
import { EditModal } from '../../common/ui/edit-modal';
import { ErrorBoundary } from '../../common/ui/error-boundary';
import { LinkCreateContent } from '../../common/ui/link-create-content';
import { ModalHero } from '../../common/ui/modal-hero';
import { Modal } from '../../common/ui/ModalDialog';
import { LinkCreateCallbackProvider } from '../../controllers/callback-context';
import {
  EditPostCreateModalProvider,
  useEditPostCreateModal,
} from '../../controllers/edit-post-create-context';
import {
  ExitWarningModalProvider,
  useExitWarningModal,
} from '../../controllers/exit-warning-modal-context';
import { FormContextProvider } from '../../controllers/form-context';
import {
  LinkCreatePluginsProvider,
  useLinkCreatePlugins,
} from '../../controllers/plugin-context';

import { messages } from './messages';

export const TEST_ID = 'link-create';
const SCREEN_ID = 'linkCreateScreen';

const LinkCreateWithModal = ({
  active,
  modalTitle,
  onCreate,
  onFailure,
  onCancel,
  onComplete,
  onOpenComplete,
  onCloseComplete,
  testId = TEST_ID,
  plugins,
  entityKey,
  modalHero,
}: LinkCreateWithModalProps) => {
  const intl = useIntl();

  const { getShouldShowWarning } = useExitWarningModal();
  const [showExitWarning, setShowExitWarning] = useState(false);

  const { editViewPayload } = useEditPostCreateModal();
  const { activePlugin } = useLinkCreatePlugins();

  const handleCancel = useCallback(() => {
    if (getShouldShowWarning() && !showExitWarning) {
      setShowExitWarning(true);
      return;
    }

    onCancel?.();
  }, [onCancel, getShouldShowWarning, showExitWarning]);

  const handleCloseExitWarning = useCallback(
    () => setShowExitWarning(false),
    [],
  );

  return (
    <LinkCreateCallbackProvider
      onCreate={onCreate}
      onFailure={onFailure}
      onCancel={handleCancel}
    >
      <ModalTransition>
        {active && (
          <Modal
            testId="link-create-modal"
            screen={SCREEN_ID}
            onClose={handleCancel}
            shouldScrollInViewport={true}
            onOpenComplete={onOpenComplete}
            onCloseComplete={onCloseComplete}
            width={`${CREATE_FORM_MAX_WIDTH_IN_PX}px`}
          >
            <ModalHero hero={modalHero} />
            <ModalHeader>
              <ModalTitle>
                {modalTitle || intl.formatMessage(messages.heading)}
              </ModalTitle>
            </ModalHeader>
            <ModalBody>
              <Box testId={testId}>
                <ErrorBoundary>
                  <LinkCreateContent plugins={plugins} entityKey={entityKey} />
                </ErrorBoundary>
              </Box>
            </ModalBody>
          </Modal>
        )}
      </ModalTransition>
      {onComplete && (
        <EditModal
          onCloseComplete={onCloseComplete}
          onClose={onComplete}
          editViewPayload={editViewPayload}
          activePlugin={activePlugin}
        />
      )}
      <ConfirmDismissDialog
        active={showExitWarning}
        onClose={handleCloseExitWarning}
        onCancel={onCancel}
      />
    </LinkCreateCallbackProvider>
  );
};

const LinkCreateModal = (props: LinkCreateWithModalProps) => {
  const shouldCallCloseComplete = useRef(!props.active);

  // modal calls onCloseComplete in a useEffect(), so we can track whether
  // or not we should execute it based on the active prop in a
  // useLayoutEffect() which will be run before child useEffect()s
  useLayoutEffect(() => {
    // onCloseComplete should only be called when it is not active
    shouldCallCloseComplete.current = !props.active;
  }, [props.active]);

  return (
    <LinkCreatePluginsProvider
      plugins={props.plugins}
      entityKey={props.entityKey}
    >
      {pluginsProvider => (
        <EditPostCreateModalProvider active={!!props.active}>
          {({
            setEditViewPayload,
            editViewPayload,
            shouldActivateEditView,
            enableEditView,
          }) => (
            <FormContextProvider
              enableEditView={
                pluginsProvider?.activePlugin?.editView && props?.onComplete
                  ? enableEditView
                  : undefined
              }
            >
              <ExitWarningModalProvider>
                <LinkCreateWithModal
                  {...props}
                  active={props.active && !editViewPayload}
                  onCreate={async payload => {
                    await props.onCreate?.(payload);

                    // if onComplete exists then there is an edit flow
                    if (props.onComplete) {
                      if (shouldActivateEditView()) {
                        //edit button is pressed
                        setEditViewPayload(payload);
                      } else {
                        //create button is pressed
                        props.onComplete();
                      }
                    }
                  }}
                  onCloseComplete={(...args) => {
                    if (shouldCallCloseComplete.current) {
                      props.onCloseComplete?.(...args);
                    }
                  }}
                />
              </ExitWarningModalProvider>
            </FormContextProvider>
          )}
        </EditPostCreateModalProvider>
      )}
    </LinkCreatePluginsProvider>
  );
};

export default LinkCreateModal;

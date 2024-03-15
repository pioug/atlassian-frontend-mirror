/** @jsx jsx */
import {
  Fragment,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';

import {
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
  LinkCreatePlugin,
  LinkCreateWithModalProps,
} from '../../common/types';
import { Modal } from '../../common/ui/ModalDialog';
import { LinkCreateCallbackProvider } from '../../controllers/callback-context';
import { EditPostCreateModalProvider } from '../../controllers/edit-post-create-context';
import {
  ExitWarningModalProvider,
  useExitWarningModal,
} from '../../controllers/exit-warning-modal-context';
import {
  FormContextProvider,
  useFormContext,
} from '../../controllers/form-context';
import { LinkCreatePluginsProvider } from '../../controllers/plugin-context';

import { ConfirmDismissDialog } from './confirm-dismiss-dialog';
import { EditModal } from './edit-modal';
import { ErrorBoundary } from './error-boundary';
import { messages } from './messages';
import { ModalHero } from './modal-hero';

export const TEST_ID = 'link-create';
const SCREEN_ID = 'linkCreateScreen';

type LinkCreateContentProps = {
  plugins: LinkCreatePlugin[];
  entityKey: string;
};

const LinkCreateContent = ({ plugins, entityKey }: LinkCreateContentProps) => {
  const chosenOne = plugins.find(plugin => plugin.key === entityKey);

  if (!chosenOne) {
    throw new Error('Make sure you specified a valid entityKey');
  }

  return <Fragment>{chosenOne.form}</Fragment>;
};

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
    (error: unknown) => {
      // Set the form error message
      if (error instanceof Error) {
        setFormErrorMessage(error.message);
      }
      onFailure && onFailure(error);
    },
    [onFailure, setFormErrorMessage],
  );

  const { getShouldShowWarning } = useExitWarningModal();
  const [showExitWarning, setShowExitWarning] = useState(false);

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
      onCreate={
        getBooleanFF(
          'platform.linking-platform.link-create.better-observability',
        )
          ? onCreate
          : handleCreate
      }
      onFailure={
        getBooleanFF(
          'platform.linking-platform.link-create.better-observability',
        )
          ? onFailure
          : handleFailure
      }
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
        <EditModal onCloseComplete={onCloseComplete} onClose={onComplete} />
      )}
      <ConfirmDismissDialog
        active={showExitWarning}
        onClose={handleCloseExitWarning}
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

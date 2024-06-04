/** @jsx jsx */
import { useCallback, useState } from 'react';

import { jsx } from '@emotion/react';

import { Box } from '@atlaskit/primitives';

import type { LinkCreateProps } from '../../common/types';
import { ConfirmDismissDialog } from '../../common/ui/confirm-dismiss-dialog';
import { EditModal } from '../../common/ui/edit-modal';
import { ErrorBoundary } from '../../common/ui/error-boundary';
import { LinkCreateContent } from '../../common/ui/link-create-content';
import {
  LinkCreateCallbackProvider,
  // useLinkCreateCallback,
} from '../../controllers/callback-context';
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

export const TEST_ID = 'link-create';
// todo: EDM-10075 trigger the screen.viewed_linkCreateScreen event when inline-create is mounted
// const SCREEN_ID = 'linkCreateScreen';

const InlineCreateContent = ({
  onCreate,
  onFailure,
  onCancel,
  onComplete,
  plugins,
  entityKey,
  testId,
}: LinkCreateProps) => {
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
      <ErrorBoundary>
        <Box testId={testId}>
          <LinkCreateContent plugins={plugins} entityKey={entityKey} />
        </Box>
      </ErrorBoundary>

      {onComplete && (
        <EditModal
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

const InlineCreate = (props: LinkCreateProps) => {
  return (
    <LinkCreatePluginsProvider
      plugins={props.plugins}
      entityKey={props.entityKey}
    >
      {pluginsProvider => (
        <EditPostCreateModalProvider active={true}>
          {({ setEditViewPayload, shouldActivateEditView, enableEditView }) => (
            <FormContextProvider
              enableEditView={
                pluginsProvider?.activePlugin?.editView && props?.onComplete
                  ? enableEditView
                  : undefined
              }
            >
              <ExitWarningModalProvider>
                <InlineCreateContent
                  {...props}
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
                />
              </ExitWarningModalProvider>
            </FormContextProvider>
          )}
        </EditPostCreateModalProvider>
      )}
    </LinkCreatePluginsProvider>
  );
};

export default InlineCreate;

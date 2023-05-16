/** @jsx jsx */
import { memo, useCallback } from 'react';

import { jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';

import { AnalyticsContext, useAnalyticsEvents } from '@atlaskit/analytics-next';
import Modal, {
  ModalBody,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '@atlaskit/modal-dialog';

import { ANALYTICS_CHANNEL, COMPONENT_NAME } from '../common/constants';
import { LinkCreateProps } from '../common/types';
import { withLinkCreateAnalyticsContext } from '../common/utils/analytics';
import createEventPayload, {
  PackageMetaDataType,
} from '../common/utils/analytics/analytics.codegen';
import { LinkCreateCallbackProvider } from '../controllers/callback-context';
import {
  FormContextProvider,
  useFormContext,
} from '../controllers/form-context';
import {
  name as packageName,
  version as packageVersion,
} from '../version.json';

import { ErrorBoundary } from './error-boundary';
import { messages } from './messages';

const withFormContext =
  (Component: React.FC<LinkCreateProps>) => (props: LinkCreateProps) =>
    (
      <FormContextProvider>
        <Component {...props} />
      </FormContextProvider>
    );

const LinkCreate = withFormContext(
  ({ plugins, entityKey, onCreate, onFailure, onCancel }: LinkCreateProps) => {
    const chosenOne = plugins.find(plugin => plugin.key === entityKey);

    const { setFormErrorMessage } = useFormContext();

    if (!chosenOne) {
      throw new Error('Make sure you specified a valid entityKey');
    }

    const handleCreate = useCallback(
      (result: { url: string; objectId: string; objectType: string }) => {
        // Reset the form error message
        setFormErrorMessage(undefined);
        onCreate && onCreate(result.url);
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
      <LinkCreateCallbackProvider
        onCreate={handleCreate}
        onFailure={handleFailure}
        onCancel={onCancel}
      >
        {chosenOne.form}
      </LinkCreateCallbackProvider>
    );
  },
);

const LinkCreateWithModal = (props: LinkCreateProps) => {
  const { testId, onCancel, active } = props;
  const { createAnalyticsEvent } = useAnalyticsEvents();
  const intl = useIntl();

  const handleOpenComplete = useCallback(() => {
    createAnalyticsEvent(
      createEventPayload('screen.linkCreateScreen.viewed', {}),
    ).fire(ANALYTICS_CHANNEL);
  }, [createAnalyticsEvent]);

  const handleCloseComplete = useCallback(() => {
    createAnalyticsEvent(
      createEventPayload('screen.linkCreateScreen.closed', {}),
    ).fire(ANALYTICS_CHANNEL);
  }, [createAnalyticsEvent]);

  return (
    <ModalTransition>
      {!!active && (
        <Modal
          onClose={onCancel}
          testId={testId}
          shouldScrollInViewport={true}
          onOpenComplete={handleOpenComplete}
          onCloseComplete={handleCloseComplete}
        >
          <ModalHeader>
            <ModalTitle>{intl.formatMessage(messages.heading)}</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <ErrorBoundary>
              <FormContextProvider>
                <LinkCreate {...props} />
              </FormContextProvider>
            </ErrorBoundary>
          </ModalBody>
        </Modal>
      )}
    </ModalTransition>
  );
};

const LinkCreateWithAnalyticsContext = withLinkCreateAnalyticsContext(
  memo(({ ...props }: LinkCreateProps) => {
    return <LinkCreateWithModal {...props} />;
  }),
);

export const PACKAGE_DATA: PackageMetaDataType = {
  packageName,
  packageVersion,
  componentName: COMPONENT_NAME,
  source: COMPONENT_NAME,
};

const ComposedLinkCreate = memo((props: LinkCreateProps) => {
  return (
    <AnalyticsContext data={PACKAGE_DATA}>
      <LinkCreateWithAnalyticsContext {...props} />
    </AnalyticsContext>
  );
});

export default ComposedLinkCreate;

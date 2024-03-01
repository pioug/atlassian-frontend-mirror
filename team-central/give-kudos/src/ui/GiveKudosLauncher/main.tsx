/**  @jsx jsx */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { css, jsx } from '@emotion/react';
import { FormattedMessage, useIntl } from 'react-intl-next';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import Button from '@atlaskit/button/standard-button';
import Drawer from '@atlaskit/drawer';
import ArrowLeft from '@atlaskit/icon/glyph/arrow-left';
import SuccessIcon from '@atlaskit/icon/glyph/check-circle';
import { IntlMessagesProvider } from '@atlaskit/intl-messages-provider';
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '@atlaskit/modal-dialog';
import Portal from '@atlaskit/portal';
import { G300 } from '@atlaskit/theme/colors';
import { layers } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { fetchMessagesForLocale } from '../../common/utils/fetch-messages-for-locale';
import i18nEN from '../../i18n/en';
import messages from '../../messages';
import {
  Flag,
  FlagEvent,
  FlagEventType,
  GiveKudosDrawerProps,
  isFlagEventTypeValue,
} from '../../types';

const iframeStyles = css({
  border: 0,
});

const sidebarDivStyles = css({
  position: 'absolute',
  margin: `${token('space.200', '16px')} 0 0 ${token('space.200', '16px')}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const sidebarButtonStyles = css({
  padding: 0,
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  background: 0,
  borderRadius: '50%',
  lineHeight: 1,
});

const ANALYTICS_CHANNEL = 'atlas';

const GiveKudosLauncher = (props: GiveKudosDrawerProps) => {
  const [isCloseConfirmModalOpen, setIsCloseConfirmModalOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const iframeEl = useRef(null);
  const messageListenerEventHandler = useRef((e: any) => {});
  const unloadEventHandler = useRef((e: any) => {});
  const intl = useIntl();
  const { createAnalyticsEvent } = useAnalyticsEvents();

  const { addFlag, teamCentralBaseUrl, analyticsSource, onClose, testId } =
    props;

  const shouldBlockTransition = useCallback(
    (e: Event & { returnValue: any }) => {
      e.preventDefault();
      e.returnValue = intl.formatMessage(messages.unsavedKudosWarning);
    },
    [intl],
  );

  const sendAnalytic = useCallback(
    (action: string, options: {}) => {
      const analyticsEvent = createAnalyticsEvent({
        action: action,
        actionSubject: 'createKudos',
        attributes: { ...options, analyticsSource },
      });
      analyticsEvent.fire(ANALYTICS_CHANNEL);
    },
    [analyticsSource, createAnalyticsEvent],
  );

  const closeDrawer = useCallback(() => {
    setIsDirty(false);
    setIsCloseConfirmModalOpen(false);
    onClose();
  }, [onClose]);

  const closeWarningModal = () => {
    setIsCloseConfirmModalOpen(false);
  };

  const createFlagWithJsonStringifiedInput = useCallback(
    (flagEvent: FlagEvent) => {
      const handleCreateOrFail = (addFlagConfig: Flag) => {
        closeDrawer();
        sendAnalytic('created', {});
        if (flagEvent.kudosUuid || flagEvent.jiraKudosUrl) {
          addFlag && addFlag(addFlagConfig);
        }
      };

      switch (flagEvent.eventType) {
        case FlagEventType.KUDOS_CREATED:
          handleCreateOrFail({
            title: <FormattedMessage {...messages.kudosCreatedFlag} />,
            id: `kudosCreatedFlag-${flagEvent.kudosUuid}`,
            description: (
              <FormattedMessage
                {...messages.kudosCreatedDescriptionFlag}
                values={{
                  a: (s: string) => (
                    <a
                      href={`${teamCentralBaseUrl}/people/kudos/${flagEvent.kudosUuid}`}
                    >
                      {s}
                    </a>
                  ),
                }}
              />
            ),
            icon: (
              <SuccessIcon
                label={intl.formatMessage(messages.successIconLabel)}
                primaryColor={token('color.icon.success', G300)}
              />
            ),
          });
          break;
        case FlagEventType.JIRA_KUDOS_CREATED:
          handleCreateOrFail({
            title: <FormattedMessage {...messages.JiraKudosCreatedFlag} />,
            id: `kudosCreatedFlag-${flagEvent.kudosUuid}`,
            description: (
              <FormattedMessage {...messages.JiraKudosCreatedDescriptionFlag} />
            ),
            icon: (
              <SuccessIcon
                label={intl.formatMessage(messages.successIconLabel)}
                primaryColor={token('color.icon.success', G300)}
              />
            ),
            actions: [
              {
                content: 'Track gift request',
                href: flagEvent.jiraKudosUrl,
              },
              {
                content: 'View kudos',
                href: `${teamCentralBaseUrl}/people/kudos/${flagEvent.kudosUuid}`,
              },
            ],
          });
          break;
        case FlagEventType.JIRA_KUDOS_FAILED:
          handleCreateOrFail({
            title: (
              <FormattedMessage {...messages.JiraKudosCreationFailedFlag} />
            ),
            id: `jiraKudosCreationFailedFlag-${flagEvent.kudosUuid}`,
            description: (
              <FormattedMessage
                {...messages.JiraKudosCreationFailedDescriptionFlag}
                values={{
                  a: (s: string) => (
                    <a href={flagEvent.jiraKudosFormUrl}>{s}</a>
                  ),
                }}
              />
            ),
            type: 'warning',
            actions: [
              {
                content: 'Visit go/kudos',
                href: flagEvent.jiraKudosFormUrl,
              },
              {
                content: 'View kudos',
                href: `${teamCentralBaseUrl}/people/kudos/${flagEvent.kudosUuid}`,
              },
            ],
          });
          break;
        case FlagEventType.DIRTY:
          setIsDirty(true);
          break;
        case FlagEventType.CLOSE:
          closeDrawer();
          break;
        default:
          // Not a known FlagEventType
          return;
      }
    },
    [addFlag, closeDrawer, sendAnalytic, teamCentralBaseUrl, intl],
  );

  const messageListener = useCallback(
    event => {
      if (!props.isOpen) {
        return;
      }

      if (
        String(event.data).startsWith('kudos-created-') ||
        event.data === 'dirty' ||
        event.data === 'close'
      ) {
        if (String(event.data).startsWith('kudos-created-')) {
          const uuid = String(event.data).replace(/^(kudos-created-)/, '');

          closeDrawer();
          sendAnalytic('created', {});
          addFlag &&
            addFlag({
              title: <FormattedMessage {...messages.kudosCreatedFlag} />,
              id: `kudosCreatedFlag-${uuid}`,
              description: (
                <FormattedMessage
                  {...messages.kudosCreatedDescriptionFlag}
                  values={{
                    a: (s: string) => (
                      <a href={`${teamCentralBaseUrl}/people/kudos/${uuid}`}>
                        {s}
                      </a>
                    ),
                  }}
                />
              ),
              icon: (
                <SuccessIcon
                  label={intl.formatMessage(messages.successIconLabel)}
                  primaryColor={token('color.icon.success', G300)}
                />
              ),
            });
        } else if (event.data === 'dirty') {
          setIsDirty(true);
        } else if (event.data === 'close') {
          closeDrawer();
        }
      } else {
        try {
          const eventData = JSON.parse(event.data);
          if (
            eventData.eventType &&
            isFlagEventTypeValue(eventData.eventType)
          ) {
            createFlagWithJsonStringifiedInput(eventData);
          }
        } catch (e) {
          // Swallow any errors
        }
      }
    },
    [
      props.isOpen,
      closeDrawer,
      sendAnalytic,
      addFlag,
      teamCentralBaseUrl,
      createFlagWithJsonStringifiedInput,
      intl,
    ],
  );

  useEffect(() => {
    window.removeEventListener('message', messageListenerEventHandler.current);
    messageListenerEventHandler.current = messageListener;
    window.addEventListener(
      'message',
      messageListenerEventHandler.current,
      false,
    );
    return () => {
      window.removeEventListener(
        'message',
        messageListenerEventHandler.current,
      );
    };
  }, [messageListener]);

  useEffect(() => {
    window.removeEventListener('beforeunload', unloadEventHandler.current);
    if (isDirty) {
      unloadEventHandler.current = shouldBlockTransition;
      window.addEventListener(
        'beforeunload',
        unloadEventHandler.current,
        false,
      );
    }
    return () => {
      window.removeEventListener('beforeunload', unloadEventHandler.current);
    };
  }, [isDirty, shouldBlockTransition]);

  const sendCancelAnalytic = () => {
    sendAnalytic('cancelled', {});
  };

  const handleCloseDrawerClickedFunc = () => {
    if (!isDirty) {
      sendCancelAnalytic();
      closeDrawer();
      return;
    }

    setIsCloseConfirmModalOpen(true);
  };

  const handleCloseDrawerClickedFuncRef = useRef(handleCloseDrawerClickedFunc);

  useEffect(() => {
    handleCloseDrawerClickedFuncRef.current = handleCloseDrawerClickedFunc;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty]);

  const renderIframe = () => {
    return (
      <iframe
        src={giveKudosUrl}
        ref={iframeEl}
        width="100%"
        height="100%"
        frameBorder="0"
        allow="camera;microphone"
        css={iframeStyles}
      />
    );
  };

  const handleCloseDrawerClicked = () => {
    handleCloseDrawerClickedFuncRef.current();
  };

  const renderSidebar = () => {
    return (
      <div css={sidebarDivStyles}>
        <Button onClick={handleCloseDrawerClicked} css={sidebarButtonStyles}>
          <ArrowLeft
            label={intl.formatMessage(messages.closeDrawerButtonLabel)}
          />
        </Button>
      </div>
    );
  };

  const renderDrawer = useMemo(() => {
    if (props.isOpen) {
      sendAnalytic('opened', {});
    }
    return (
      <Drawer
        width="full"
        isOpen={props.isOpen}
        zIndex={layers.modal()}
        onClose={handleCloseDrawerClicked}
        // eslint-disable-next-line @atlaskit/design-system/no-deprecated-apis
        overrides={{
          Content: {
            component: renderIframe,
          },
          Sidebar: {
            component: renderSidebar,
          },
        }}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.recipient?.recipientId, props.isOpen]);

  const recipientParam = props.recipient
    ? `&type=${props.recipient.type}&recipientId=${props.recipient.recipientId}`
    : '';
  const giveKudosUrl = `${props.teamCentralBaseUrl}/give-kudos?cloudId=${
    props.cloudId
  }${recipientParam}&unsavedMessage=${intl.formatMessage(
    messages.unsavedKudosWarning,
  )}`;

  return (
    <IntlMessagesProvider
      loaderFn={fetchMessagesForLocale}
      defaultMessages={i18nEN}
    >
      <Portal zIndex={layers.modal()}>
        <div data-testid={testId}>
          <ModalTransition>
            {isCloseConfirmModalOpen && (
              <Modal onClose={closeWarningModal} width="small">
                <ModalHeader>
                  <ModalTitle>
                    <FormattedMessage {...messages.confirmCloseTitle} />
                  </ModalTitle>
                </ModalHeader>
                <ModalBody>
                  <FormattedMessage {...messages.unsavedKudosWarning} />
                </ModalBody>
                <ModalFooter>
                  <Button
                    appearance="subtle"
                    onClick={closeWarningModal}
                    autoFocus
                  >
                    <FormattedMessage
                      {...messages.unsavedKudosWarningCancelButton}
                    />
                  </Button>
                  <Button
                    appearance="primary"
                    onClick={() => {
                      sendCancelAnalytic();
                      closeDrawer();
                    }}
                  >
                    <FormattedMessage
                      {...messages.unsavedKudosWarningCloseButton}
                    />
                  </Button>
                </ModalFooter>
              </Modal>
            )}
          </ModalTransition>
          {renderDrawer}
        </div>
      </Portal>
    </IntlMessagesProvider>
  );
};

export default GiveKudosLauncher;

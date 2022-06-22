import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { FormattedMessage, useIntl } from 'react-intl-next';
import styled from 'styled-components';

import Button from '@atlaskit/button/standard-button';
import Drawer from '@atlaskit/drawer';
import ArrowLeft from '@atlaskit/icon/glyph/arrow-left';
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTransition,
} from '@atlaskit/modal-dialog';

import messages from '../../messages';
import { GiveKudosDrawerProps } from '../../types';

import { SidebarContainer } from './styled';

const GiveKudosDrawerWrapper = styled.span`
  > Drawer > iframe {
    border: 0;
  }
`;

const GiveKudosLauncher = (props: GiveKudosDrawerProps) => {
  const [isCloseConfirmModalOpen, setIsCloseConfirmModalOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const iframeEl = useRef(null);
  const messageListenerEventHandler = useRef((e: any) => {});
  const unloadEventHandler = useRef((e: any) => {});
  const intl = useIntl();
  const {
    addFlag,
    teamCentralBaseUrl,
    analytics,
    analyticsSource,
    onClose,
    testId,
  } = props;

  const shouldBlockTransition = useCallback(
    (e: Event & { returnValue: any }) => {
      e.preventDefault();
      e.returnValue = intl.formatMessage(messages.unsavedKudosWarning);
    },
    [intl],
  );

  const sendAnalytic = useCallback(
    (action: string, options: {}) => {
      if (analytics && analyticsSource) {
        // TODO analytics(`${analyticsSource}.${action}`, options);
      }
    },
    [analytics, analyticsSource],
  );

  const closeDrawer = useCallback(() => {
    setIsDirty(false);
    setIsCloseConfirmModalOpen(false);
    onClose();
  }, [onClose]);

  const closeWarningModal = () => {
    setIsCloseConfirmModalOpen(false);
  };
  const messageListener = useCallback(
    event => {
      if (!props.isOpen) {
        return;
      }

      if (String(event.data).startsWith('kudos-created-')) {
        const uuid = String(event.data).replace(/^(kudos-created-)/, '');

        closeDrawer();
        sendAnalytic('created', {
          id: 'createKudos',
        });
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
            icon: <></>,
          });
      } else if (event.data === 'dirty') {
        setIsDirty(true);
      } else if (event.data === 'close') {
        closeDrawer();
      }
    },
    [props.isOpen, addFlag, teamCentralBaseUrl, sendAnalytic, closeDrawer],
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
    sendAnalytic('cancelled', {
      id: 'createKudos',
    });
    // props.analytics.pushTrackEvent({
    //   source: props.analyticsSource,
    //   actionSubject: 'createKudos',
    //   action: 'cancelled',
    // });
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
      />
    );
  };

  const handleCloseDrawerClicked = () => {
    handleCloseDrawerClickedFuncRef.current();
  };

  const renderSidebar = () => {
    return (
      <SidebarContainer>
        <Button onClick={handleCloseDrawerClicked}>
          <ArrowLeft label="Close drawer" />
        </Button>
      </SidebarContainer>
    );
  };

  const renderDrawer = useMemo(() => {
    return (
      <Drawer
        width="full"
        isOpen={props.isOpen}
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
    <GiveKudosDrawerWrapper data-testid={testId}>
      <ModalTransition>
        {isCloseConfirmModalOpen && (
          <Modal onClose={closeWarningModal} width="small">
            <ModalHeader>
              <ModalTitle>Confirm Close</ModalTitle>
            </ModalHeader>
            <ModalBody>
              <FormattedMessage {...messages.unsavedKudosWarning} />
            </ModalBody>
            <ModalFooter>
              <Button appearance="subtle" onClick={closeWarningModal} autoFocus>
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
    </GiveKudosDrawerWrapper>
  );
};

export default GiveKudosLauncher;

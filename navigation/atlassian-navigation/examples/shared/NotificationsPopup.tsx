/** @jsx jsx */
import { useState } from 'react';

import { jsx } from '@emotion/core';

import { Notifications as NotificationsIframe } from '@atlaskit/atlassian-notifications';
import { NotificationIndicator } from '@atlaskit/notification-indicator';
import { NotificationLogClient } from '@atlaskit/notification-log-client';
import Popup from '@atlaskit/popup';

import { Notifications } from '../../src';

const wrapperCSS = {
  width: 540,
  height: 'calc(100vh - 200px)',
  paddingTop: 18,
  paddingLeft: 18,
  display: 'flex',
};

const NotificationsContent = () => (
  <div css={wrapperCSS}>
    <NotificationsIframe
      // _url="https://start.stg.atlassian.com/notificationsDrawer/iframe.html?scope=user&product=uchi&locale=en"
      _url="https://start.stg.atlassian.com/notificationsDrawer/iframe.html"
      locale="en"
      product="jira"
      testId="jira-notifications"
      title="Notifications"
    />
  </div>
);

class MockNotificationLogClient extends NotificationLogClient {
  mockedCount = 0;
  constructor(mockedCount: number) {
    super('', '');
    this.mockedCount = mockedCount;
  }

  public async countUnseenNotifications() {
    return Promise.resolve({ count: this.mockedCount });
  }
}

const client = new MockNotificationLogClient(5);
const emptyClient = new MockNotificationLogClient(0);

export const NotificationsPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const [buttonLabel, setButtonLabel] = useState<number | undefined>();

  const NotificationsBadge = () => (
    <NotificationIndicator
      onCountUpdated={updateButtonLabel}
      // force a zero-count after the drawer has been opened
      notificationLogProvider={Promise.resolve(
        interacted ? emptyClient : client,
      )}
    />
  );

  const updateButtonLabel = ({
    newCount,
    oldCount,
    source,
  }: {
    newCount: number;
    oldCount?: number;
    source?: string;
  }) => {
    setButtonLabel(newCount || 0);
  };

  const onClick = () => {
    // let the badge icon know to clear its count
    setInteracted(true);
    setIsOpen(!isOpen);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <Popup
      placement="bottom-start"
      content={NotificationsContent}
      isOpen={isOpen}
      onClose={onClose}
      trigger={(triggerProps) => (
        <Notifications
          badge={NotificationsBadge}
          onClick={onClick}
          tooltip={`Notifications (${buttonLabel})`}
          isSelected={isOpen}
          {...triggerProps}
        />
      )}
    />
  );
};

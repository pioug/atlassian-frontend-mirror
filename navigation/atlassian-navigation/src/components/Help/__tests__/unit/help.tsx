import React from 'react';

import { render, wait } from '@testing-library/react';

import { NotificationIndicator } from '@atlaskit/notification-indicator';
import { NotificationLogClient } from '@atlaskit/notification-log-client';

import { Help } from '../../index';

const NUMBER_OF_NOTIFICATIONS = 5;
const MAX_NUMBER_OF_NOTIFICATIONS = 3;

// Mockup notification Promise
class MockNotificationLogClient extends NotificationLogClient {
  notificationCounter: number;

  constructor(notificationCounter: number = NUMBER_OF_NOTIFICATIONS) {
    super('', '');

    this.notificationCounter = notificationCounter;
  }

  public async countUnseenNotifications() {
    return Promise.resolve({ count: this.notificationCounter });
  }
}

describe('Help', () => {
  it('Should display badge if the "badge" prop is defined and the number of notification is > 0', async () => {
    const notificationsClient = new MockNotificationLogClient();
    const notificationLogProvider = Promise.resolve(notificationsClient);
    const NotificationsBadge = () => (
      <NotificationIndicator
        max={MAX_NUMBER_OF_NOTIFICATIONS}
        notificationLogProvider={Promise.resolve(notificationLogProvider)}
      />
    );

    const { queryByText } = render(
      <Help tooltip={`Help button`} badge={NotificationsBadge} />,
    );

    await wait(() => notificationLogProvider);

    const notificationCounterElm = queryByText(
      `${MAX_NUMBER_OF_NOTIFICATIONS}+`,
    );
    expect(notificationCounterElm).not.toBeNull();
  });

  it('Should not display badge if the "badge" prop is defined and the number of notification is === 0', async () => {
    const numberOfNotifications = 0;
    const notificationsClient = new MockNotificationLogClient(
      numberOfNotifications,
    );
    const notificationLogProvider = Promise.resolve(notificationsClient);
    const NotificationsBadge = () => (
      <NotificationIndicator
        max={MAX_NUMBER_OF_NOTIFICATIONS}
        notificationLogProvider={Promise.resolve(notificationLogProvider)}
      />
    );

    const { queryByText } = render(
      <Help tooltip={`Help button`} badge={NotificationsBadge} />,
    );

    await wait(() => notificationLogProvider);

    const notificationCounterElm = queryByText(`${numberOfNotifications}`);
    expect(notificationCounterElm).toBeNull();
  });

  it('Should not display badge if is not passed as a prop', async () => {
    const { queryByText } = render(<Help tooltip={`Help button`} />);

    const notificationCounterElm = queryByText(
      `${MAX_NUMBER_OF_NOTIFICATIONS}+`,
    );
    expect(notificationCounterElm).toBeNull();
  });
});

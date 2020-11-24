import React from 'react';

import { NotificationLogClient } from '@atlaskit/notification-log-client';

import { NotificationIndicator } from '../src';

class MockNotificationLogClient extends NotificationLogClient {
  constructor() {
    super('', '');
  }

  public async countUnseenNotifications() {
    return Promise.resolve({ count: 5 });
  }
}

export default function Example() {
  const client = new MockNotificationLogClient();

  return (
    <NotificationIndicator notificationLogProvider={Promise.resolve(client)} />
  );
}

import React from 'react';

import {
  NotificationLogClient,
  NotificationCountResponse,
} from '@atlaskit/notification-log-client';

import { NotificationIndicator } from '../src';

class MockNotificationLogClient extends NotificationLogClient {
  private response?: Promise<NotificationCountResponse>;

  constructor() {
    super('', '');
  }

  public async countUnseenNotifications() {
    return (
      this.response ||
      Promise.resolve({
        count: 5,
      })
    );
  }

  public setResponse(response: Promise<NotificationCountResponse>) {
    this.response = response;
  }
}

function returnCount(count: number): Promise<NotificationCountResponse> {
  return Promise.resolve({ count });
}

function returnError(): Promise<NotificationCountResponse> {
  return Promise.reject(new Error());
}

function renderNotificationIndicator(
  response: Promise<NotificationCountResponse>,
  props: Object = {},
  client: MockNotificationLogClient = new MockNotificationLogClient(),
) {
  client.setResponse(response);

  return (
    <NotificationIndicator
      notificationLogProvider={Promise.resolve(client)}
      {...props}
    />
  );
}

export default function Example() {
  const refreshingClient = new MockNotificationLogClient();
  let count = 1;
  window.setInterval(() => {
    count = (count % 10) + 1;
    refreshingClient.setResponse(Promise.resolve({ count }));
  }, 950);

  return (
    <div>
      <h5>Has new notifications</h5>
      {renderNotificationIndicator(returnCount(5))}

      <h5>Has too many new notifications</h5>
      {renderNotificationIndicator(returnCount(99))}

      <h5>New notifications with higher max</h5>
      {renderNotificationIndicator(returnCount(99), { max: 20 })}

      <h5>New notifications with different appearance</h5>
      {renderNotificationIndicator(returnCount(99), { appearance: 'primary' })}

      <h5>Auto refresh with new notifications every 1 second</h5>
      {renderNotificationIndicator(
        returnCount(count),
        { refreshRate: 1000 },
        refreshingClient,
      )}

      <h5>No new notification (Should not render anything)</h5>
      {renderNotificationIndicator(returnCount(0))}

      <h5>Has error fetching notifications (Should not render anything)</h5>
      {renderNotificationIndicator(returnError())}
    </div>
  );
}

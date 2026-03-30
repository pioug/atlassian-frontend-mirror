import React from 'react';

import { type NotificationLogProvider } from '@atlaskit/notification-log-client';

import { NotificationIndicator } from '../src';

class MockNotificationLogClient implements NotificationLogProvider {
	public async countUnseenNotifications() {
		return Promise.resolve({ count: 5 });
	}
}

export default function Example(): React.JSX.Element {
	const client = new MockNotificationLogClient();

	return <NotificationIndicator notificationLogProvider={Promise.resolve(client)} />;
}

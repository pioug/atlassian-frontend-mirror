import React from 'react';

import { NotificationIndicator } from '@atlaskit/notification-indicator';

import { type NotificationLogProvider } from '../src';

class MockNotificationLogClient implements NotificationLogProvider {
	public async countUnseenNotifications() {
		return Promise.resolve({ count: 5 });
	}
}

export default function Example(): React.JSX.Element {
	/**
	 * We are using a mock version here because we don't want to call out to the real service to get a working example.
	 * Typically this would be:
	 *
	 * const notificationLogClient = new NotificationLogClient({
	 *   cloudId: 'cloud-id',
	 * });
	 */
	const notificationLogClient = new MockNotificationLogClient();
	const providerPromise = Promise.resolve(notificationLogClient);

	return (
		<div>
			<div>Initialise client and render a NotificationIndicator badge.</div>

			<NotificationIndicator notificationLogProvider={providerPromise} />
		</div>
	);
}

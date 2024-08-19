import React from 'react';
import Heading from '@atlaskit/heading';

import {
	NotificationLogClient,
	type NotificationCountResponse,
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

	return <NotificationIndicator notificationLogProvider={Promise.resolve(client)} {...props} />;
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
			<Heading size="xsmall">Has new notifications</Heading>
			{renderNotificationIndicator(returnCount(5))}

			<Heading size="xsmall">Has too many new notifications</Heading>
			{renderNotificationIndicator(returnCount(99))}

			<Heading size="xsmall">New notifications with higher max</Heading>
			{renderNotificationIndicator(returnCount(99), { max: 20 })}

			<Heading size="xsmall">New notifications with different appearance</Heading>
			{renderNotificationIndicator(returnCount(99), { appearance: 'primary' })}

			<Heading size="xsmall">Auto refresh with new notifications every 1 second</Heading>
			{renderNotificationIndicator(returnCount(count), { refreshRate: 1000 }, refreshingClient)}

			<Heading size="xsmall">No new notification (Should not render anything)</Heading>
			{renderNotificationIndicator(returnCount(0))}

			<Heading size="xsmall">Has error fetching notifications (Should not render anything)</Heading>
			{renderNotificationIndicator(returnError())}
		</div>
	);
}

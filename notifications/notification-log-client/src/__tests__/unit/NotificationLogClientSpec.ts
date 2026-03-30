import fetchMock from 'fetch-mock/cjs/client';
import { NotificationLogClient, type NotificationCountResponse } from '../..';

describe('NotificationLogClient', () => {
	const cloudIdResponse: NotificationCountResponse = {
		count: 5,
	};
	const userCentricResponse: NotificationCountResponse = {
		count: 10,
	};
	const mockGraphQLResponse = (response: NotificationCountResponse) => {
		fetchMock.mock({
			matcher: 'begin:/gateway/api/graphql',
			response: {
				data: {
					notifications: {
						unseenNotificationCount: response.count,
					},
				},
			},
			name: 'graphql-notification-log',
		});
	};

	afterEach(fetchMock.restore);

	it('should resolve count unseen notifications with cloudId', () => {
		mockGraphQLResponse(cloudIdResponse);

		const provider = new NotificationLogClient({ cloudId: '123' });
		return provider.countUnseenNotifications().then(({ count }) => {
			expect(count).toEqual(5);
		});
	});

	it('should accept undefined cloud id', () => {
		mockGraphQLResponse(userCentricResponse);

		const provider = new NotificationLogClient();
		return provider.countUnseenNotifications().then(({ count }) => {
			expect(count).toEqual(10);
		});
	});
});

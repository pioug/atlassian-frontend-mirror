import fetchMock from 'fetch-mock/cjs/client';
import { NotificationLogClient, type NotificationCountResponse, DEFAULT_SOURCE } from '../..';

const notificationLogUrl = 'http://notification-log';

describe('NotificationLogClient', () => {
	const cloudIdResponse: NotificationCountResponse = {
		count: 5,
	};
	const userCentricResponse: NotificationCountResponse = {
		count: 10,
	};
	const mockTenantExperience = () => {
		// Fire-and-forget call made internally to post-office unseen count endpoint
		fetchMock.mock({
			matcher: `/gateway/api/post-office/api/v1/in-app-notifications/unseen/count`,
			response: { status: 204 },
			name: 'post-office-unseen-tenant',
		});

		fetchMock.mock({
			matcher: `${notificationLogUrl}/api/3/notifications/count/unseen?cloudId=123&source=atlaskitNotificationLogClient`,
			response: cloudIdResponse,
			name: 'notification-log',
		});
	};
	const mockUserCentricExperience = () => {
		// Fire-and-forget call made internally to post-office unseen count endpoint (no cloudId)
		fetchMock.mock({
			matcher: `/gateway/api/post-office/api/v1/in-app-notifications/unseen/count`,
			response: { status: 204 },
			name: 'post-office-unseen-user-centric',
		});

		fetchMock.mock({
			matcher: `${notificationLogUrl}/api/3/notifications/count/unseen?source=atlaskitNotificationLogClient`,
			response: userCentricResponse,
			name: 'notification-log',
		});
	};

	afterEach(fetchMock.restore);

	it('should resolve count unseen notifications', () => {
		mockTenantExperience();

		const provider = new NotificationLogClient(notificationLogUrl, '123');
		return provider.countUnseenNotifications().then(({ count }) => {
			expect(count).toEqual(5);
		});
	});

	it('should accept a null cloud id', () => {
		mockUserCentricExperience();

		const provider = new NotificationLogClient(notificationLogUrl);
		return provider.countUnseenNotifications().then(({ count }) => {
			expect(count).toEqual(10);
		});
	});

	it('should add the app version header', () => {
		mockTenantExperience();
		const provider = new NotificationLogClient(notificationLogUrl, '123');
		return provider.countUnseenNotifications().then(() => {
			expect(fetchMock.lastOptions().headers['x-app-version']).toEqual(
				`${process.env._PACKAGE_VERSION_}-${DEFAULT_SOURCE}`,
			);
		});
	});
});

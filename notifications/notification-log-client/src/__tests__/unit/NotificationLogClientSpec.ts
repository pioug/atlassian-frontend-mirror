import fetchMock from 'fetch-mock/cjs/client';
import { version as npmPackageVersion } from '../../version.json';
import {
  NotificationLogClient,
  NotificationCountResponse,
  DEFAULT_SOURCE,
} from '../..';

const notificationLogUrl = 'http://notification-log';

describe('NotificationLogClient', () => {
  const cloudIdResponse: NotificationCountResponse = {
    count: 5,
  };
  const userCentricResponse: NotificationCountResponse = {
    count: 10,
  };
  const mockTenantExperience = () => {
    fetchMock.mock({
      matcher: `${notificationLogUrl}/api/2/notifications/count/unseen?cloudId=123&source=atlaskitNotificationLogClient`,
      response: cloudIdResponse,
      name: 'notification-log',
    });
  };
  const mockUserCentricExperience = () => {
    fetchMock.mock({
      matcher: `${notificationLogUrl}/api/2/notifications/count/unseen?source=atlaskitNotificationLogClient`,
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
        `${npmPackageVersion}-${DEFAULT_SOURCE}`,
      );
    });
  });
});

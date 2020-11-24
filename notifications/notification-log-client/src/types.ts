import { RequestServiceOptions } from '@atlaskit/util-service-support';

export interface NotificationCountResponse {
  count: number;
}

export interface NotificationLogProvider {
  countUnseenNotifications(
    options?: RequestServiceOptions,
  ): Promise<NotificationCountResponse>;
}

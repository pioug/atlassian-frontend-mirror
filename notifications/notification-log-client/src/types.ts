import { RequestServiceOptions } from '@atlaskit/util-service-support';

export interface NotificationCountResponse {
  count: number;
}

export interface CountUnseenRequestServiceOptions
  extends RequestServiceOptions {
  useV3NotificationsApi?: boolean;
}

export interface NotificationLogProvider {
  countUnseenNotifications(
    options?: CountUnseenRequestServiceOptions,
  ): Promise<NotificationCountResponse>;
}

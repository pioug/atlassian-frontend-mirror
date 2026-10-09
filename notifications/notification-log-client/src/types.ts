import type { RequestServiceOptions } from '@atlaskit/util-service-support/types';

export interface NotificationCountResponse {
	count: number;
}
export interface NotificationLogProvider {
	countUnseenNotifications(options?: RequestServiceOptions): Promise<NotificationCountResponse>;
}

export interface NotificationLogGraphQLResponse {
	data: {
		notifications: {
			unseenNotificationCount: number;
		};
	};
}

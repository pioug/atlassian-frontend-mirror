import {
	type RequestServiceOptions,
	type ServiceConfig,
	utils,
} from '@atlaskit/util-service-support';
import { fg } from '@atlaskit/platform-feature-flags';
import {
	type NotificationLogProvider,
	type NotificationCountResponse,
	type NotificationLogGraphQLResponse,
} from './types';

export const DEFAULT_SOURCE = 'atlaskitNotificationLogClient';

export default class NotificationLogClient implements NotificationLogProvider {
	private serviceConfig: ServiceConfig;
	private cloudId?: string;
	private source: string;

	constructor(baseUrl: string, cloudId?: string, source: string = DEFAULT_SOURCE) {
		this.serviceConfig = { url: baseUrl };
		this.cloudId = cloudId;
		this.source = source;
	}

	public async countUnseenNotifications(
		options: RequestServiceOptions = {},
	): Promise<NotificationCountResponse> {
		const mergedOptions: RequestServiceOptions = {
			path: '/api/3/notifications/count/unseen',
			...options,
			queryParams: {
				...(this.cloudId && { cloudId: this.cloudId }),
				source: this.source,
				...(options.queryParams || {}),
			},
			requestInit: {
				mode: 'cors',
				headers: {
					'x-app-version': `${process.env._PACKAGE_VERSION_}-${DEFAULT_SOURCE}`,
				},
				...(options.requestInit || {}),
			},
		};

		// https://switcheroo.atlassian.com/ui/gates/2bb857fa-a92c-43b4-9f07-79ab8b9f7610/key/post-office_enable-notification-components-graphql
		if (fg('post-office_enable-notification-components-graphql')) {
			const query = `
query NotificationLogClientUnseenCount($workspaceId: String) {
  notifications {
    unseenNotificationCount(workspaceId: $workspaceId)
  }
}`;
			const response = await utils.requestService<NotificationLogGraphQLResponse>(
				{
					// Base URL cannot be overridden until REST API is removed
					url: '/gateway/api/graphql',
				},
				{
					// Don't add trailing slash, it causes 404s
					path: '',
					...options,
					queryParams: {
						query: this.source,
						...options.queryParams,
					},
					requestInit: {
						mode: 'cors',
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							...options.requestInit?.headers,
						},
						body: JSON.stringify({
							query: query,
							variables: {
								workspaceId: this.cloudId,
							},
						}),
						...options.requestInit,
					},
				},
			);
			return { count: response.data.notifications.unseenNotificationCount };
		}

		return utils.requestService(
			this.serviceConfig,
			mergedOptions,
		) as Promise<NotificationCountResponse>;
	}
}

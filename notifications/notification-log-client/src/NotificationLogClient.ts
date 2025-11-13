import {
	type RequestServiceOptions,
	type ServiceConfig,
	utils,
} from '@atlaskit/util-service-support';
import { fg } from '@atlaskit/platform-feature-flags';
import { type NotificationLogProvider, type NotificationCountResponse } from './types';

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

		//switcheroo.atlassian.com/ui/gates/4fd47923-2911-4f71-86df-f97a5b2b9ed8/key/post-office_enable_fetching_unseen-count_dummy
		if (fg('post-office_enable_fetching_unseen-count_dummy')) {
			void utils
				.requestService(
					{
						url: '/gateway/api/post-office/api/v1/in-app-notifications/unseen/count',
					},
					mergedOptions,
				)
				.catch(() => {});
		}

		return utils.requestService(
			this.serviceConfig,
			mergedOptions,
		) as Promise<NotificationCountResponse>;
	}
}

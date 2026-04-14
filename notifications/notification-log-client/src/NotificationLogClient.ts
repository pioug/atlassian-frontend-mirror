import { type RequestServiceOptions, utils } from '@atlaskit/util-service-support';
import {
	type NotificationLogProvider,
	type NotificationCountResponse,
	type NotificationLogGraphQLResponse,
} from './types';

export const DEFAULT_SOURCE = 'atlaskitNotificationLogClient';
export const DEFAULT_GRAPHQL_BASE_URL = '/gateway/api/graphql';

export default class NotificationLogClient implements NotificationLogProvider {
	private graphQLBaseUrl: string;
	private cloudId?: string;
	private source: string;
	private collabContextRoutingAri?: string;

	constructor({
		graphQLBaseUrl = DEFAULT_GRAPHQL_BASE_URL,
		cloudId,
		source = DEFAULT_SOURCE,
		collabContextRoutingAri,
	}: {
		cloudId?: string;
		collabContextRoutingAri?: string;
		graphQLBaseUrl?: string;
		source?: string;
	} = {}) {
		this.graphQLBaseUrl = graphQLBaseUrl;
		this.cloudId = cloudId;
		this.source = source;
		this.collabContextRoutingAri = collabContextRoutingAri;
	}

	public async countUnseenNotifications(
		options: RequestServiceOptions = {},
	): Promise<NotificationCountResponse> {
		const query = /* GraphQL */ `
			query NotificationLogClientUnseenCount(
				$workspaceId: String
				$collabContextRoutingAri: String
			) {
				notifications {
					unseenNotificationCount(
						workspaceId: $workspaceId
						collabContextRoutingAri: $collabContextRoutingAri
					)
				}
			}
		`;
		const response = await utils.requestService<NotificationLogGraphQLResponse>(
			{
				url: this.graphQLBaseUrl,
			},
			{
				// Don't add trailing slash, it causes 404s
				path: '',
				...options,
				queryParams: {
					q: this.source,
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
							collabContextRoutingAri: this.collabContextRoutingAri,
						},
					}),
					...options.requestInit,
				},
			},
		);
		return { count: response.data.notifications.unseenNotificationCount };
	}
}

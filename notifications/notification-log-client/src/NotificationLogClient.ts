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
	private routingWorkspaceId?: string;

	constructor({
		graphQLBaseUrl = DEFAULT_GRAPHQL_BASE_URL,
		cloudId,
		source = DEFAULT_SOURCE,
		routingWorkspaceId,
	}: {
		cloudId?: string;
		graphQLBaseUrl?: string;
		routingWorkspaceId?: string;
		source?: string;
	} = {}) {
		this.graphQLBaseUrl = graphQLBaseUrl;
		this.cloudId = cloudId;
		this.source = source;
		this.routingWorkspaceId = routingWorkspaceId;
	}

	public async countUnseenNotifications(
		options: RequestServiceOptions = {},
	): Promise<NotificationCountResponse> {
		const query = /* GraphQL */ `
			query NotificationLogClientUnseenCount($workspaceId: String, $routingWorkspaceId: String) {
				notifications {
					unseenNotificationCount(
						workspaceId: $workspaceId
						routingWorkspaceId: $routingWorkspaceId
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
							routingWorkspaceId: this.routingWorkspaceId,
						},
					}),
					...options.requestInit,
				},
			},
		);
		return { count: response.data.notifications.unseenNotificationCount };
	}
}

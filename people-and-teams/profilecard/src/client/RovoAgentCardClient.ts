import { type AnalyticsEventPayload } from '@atlaskit/analytics-next';
import { fg } from '@atlaskit/platform-feature-flags';

import type { AgentIdType, AgentPermissions, ProfileClientOptions, RovoAgent } from '../types';
import { agentRequestAnalytics } from '../util/analytics';
import { getPageTime } from '../util/performance';

import CachingClient from './CachingClient';
import { getErrorAttributes } from './errorUtils';

const createHeaders = (product: string, cloudId?: string, isBodyJson?: boolean): Headers => {
	const headers = new Headers({
		'X-Product': product,
		'X-Experience-Id': 'profile-card',
		'X-Cloudid': cloudId || '',
	});

	if (isBodyJson) {
		headers.set('Content-Type', 'application/json');
	}

	return headers;
};

export default class RovoAgentCardClient extends CachingClient<RovoAgent> {
	options: ProfileClientOptions;

	constructor(options: ProfileClientOptions) {
		super(options);
		this.options = options;
	}

	private basePath() {
		return fg('pt-deprecate-assistance-service')
			? '/gateway/api/assist/rovo/v1/agents'
			: '/gateway/api/assist/agents/v1';
	}

	makeRequest(id: AgentIdType, cloudId: string): Promise<RovoAgent> {
		const product = this.options.productIdentifier || 'rovo';
		const headers = createHeaders(product, this.options.cloudId);
		if (id.type === 'identity') {
			return fetch(
				new Request(`${this.basePath()}/accountid/${id.value}`, {
					method: 'GET',
					credentials: 'include',
					mode: 'cors',
					headers,
				}),
			).then((response) => response.json());
		}
		return fetch(
			new Request(`${this.basePath()}/${id.value}`, {
				method: 'GET',
				credentials: 'include',
				mode: 'cors',
				headers,
			}),
		).then((response) => response.json());
	}

	getProfile(
		id: AgentIdType,
		analytics?: (event: AnalyticsEventPayload) => void,
	): Promise<RovoAgent> {
		if (!id.value) {
			return Promise.reject(new Error('Id is missing'));
		}

		if (!this.options.cloudId) {
			return Promise.reject(new Error('cloudId is missing'));
		}

		const cache = this.getCachedProfile(id.value);

		if (cache) {
			return Promise.resolve(cache);
		}

		return new Promise((resolve, reject) => {
			const startTime = getPageTime();

			if (analytics) {
				analytics(agentRequestAnalytics('triggered'));
			}

			this.makeRequest(id, this.options.cloudId || '')
				.then((data: RovoAgent) => {
					if (this.cache) {
						this.setCachedProfile(id.value, data);
					}
					if (analytics) {
						analytics(
							agentRequestAnalytics('succeeded', 'request', {
								duration: getPageTime() - startTime,
								gateway: true,
							}),
						);
					}
					resolve(data);
				})
				.catch((error: unknown) => {
					if (analytics) {
						analytics(
							agentRequestAnalytics('failed', 'request', {
								duration: getPageTime() - startTime,
								...getErrorAttributes(error),
								gateway: true,
							}),
						);
					}
					reject(error);
				});
		});
	}

	deleteAgent(agentId: string, analytics?: (event: AnalyticsEventPayload) => void): Promise<void> {
		if (!this.options.cloudId) {
			return Promise.reject(new Error('cloudId is missing'));
		}

		return new Promise((resolve, reject) => {
			const startTime = getPageTime();
			const product = this.options.productIdentifier || 'rovo';

			if (analytics) {
				analytics(agentRequestAnalytics('triggered'));
			}

			const headers = createHeaders(product, this.options.cloudId);

			fetch(
				new Request(`${this.basePath()}/${agentId}`, {
					method: 'DELETE',
					credentials: 'include',
					mode: 'cors',
					headers,
				}),
			)
				.then(() => {
					if (analytics) {
						analytics(
							agentRequestAnalytics('succeeded', 'deleteAgent', {
								duration: getPageTime() - startTime,
								gateway: true,
							}),
						);
					}
					resolve();
				})
				.catch((error: unknown) => {
					if (analytics) {
						analytics(
							agentRequestAnalytics('failed', 'deleteAgent', {
								duration: getPageTime() - startTime,
								...getErrorAttributes(error),
								gateway: true,
							}),
						);
					}
					reject(error);
				});
		});
	}

	setFavouriteAgent(
		agentId: string,
		isFavourite: boolean,
		analytics?: (event: AnalyticsEventPayload) => void,
	): Promise<void> {
		if (!this.options.cloudId) {
			return Promise.reject(new Error('cloudId is missing'));
		}

		return new Promise(async (resolve, reject) => {
			const startTime = getPageTime();
			const product = this.options.productIdentifier || 'rovo';

			const actionSubjectId = isFavourite ? 'favourite' : 'unfavourite';
			const requestMethod = isFavourite ? 'POST' : 'DELETE';

			if (analytics) {
				analytics(agentRequestAnalytics('triggered', 'actionSubjectId'));
			}

			const headers = createHeaders(product, this.options.cloudId);

			await fetch(
				new Request(`${this.basePath()}/${agentId}/favourite`, {
					method: requestMethod,
					credentials: 'include',
					mode: 'cors',
					headers,
				}),
			)
				.then(() => {
					if (analytics) {
						analytics(
							agentRequestAnalytics('succeeded', actionSubjectId, {
								duration: getPageTime() - startTime,
								gateway: true,
							}),
						);
					}
					resolve();
				})
				.catch((error: unknown) => {
					if (analytics) {
						analytics(
							agentRequestAnalytics('failed', actionSubjectId, {
								duration: getPageTime() - startTime,
								...getErrorAttributes(error),
								gateway: true,
							}),
						);
					}
					reject(error);
				});
		});
	}

	getPermissions(
		id: string,
		fireAnalytics?: (event: AnalyticsEventPayload) => void,
	): Promise<AgentPermissions> {
		if (!this.options.cloudId) {
			return Promise.reject(new Error('cloudId is missing'));
		}

		return new Promise((resolve, reject) => {
			const startTime = getPageTime();
			const product = this.options.productIdentifier || 'rovo';

			if (fireAnalytics) {
				fireAnalytics(agentRequestAnalytics('triggered'));
			}

			const headers = createHeaders(product, this.options.cloudId, true);

			fetch(
				new Request(`/gateway/api/assist/api/rovo/v2/permissions/agents/${id}`, {
					method: 'POST',
					credentials: 'include',
					mode: 'cors',
					headers,
					body: JSON.stringify({
						permission_ids: [
							'AGENT_CREATE',
							'AGENT_UPDATE',
							'AGENT_DELETE',
							'AGENT_DEACTIVATE',
							'AGENT_READ',
						],
					}),
				}),
			)
				.then((response) => response.json())
				.then((data: AgentPermissions) => {
					if (fireAnalytics) {
						fireAnalytics(
							agentRequestAnalytics('succeeded', 'getAgentPermissions', {
								duration: getPageTime() - startTime,
								gateway: true,
							}),
						);
					}
					resolve(data);
				})
				.catch((error: unknown) => {
					if (fireAnalytics) {
						fireAnalytics(
							agentRequestAnalytics('failed', 'getAgentPermissions', {
								duration: getPageTime() - startTime,
								...getErrorAttributes(error),
								gateway: true,
							}),
						);
					}
					reject(error);
				});
		});
	}
}

import { type AnalyticsEventPayload } from '@atlaskit/analytics-next';

import type { AgentIdType, ProfileClientOptions, RovoAgent } from '../types';
import { agentRequestAnalytics } from '../util/analytics';
import { getPageTime } from '../util/performance';

import CachingClient from './CachingClient';
import { getErrorAttributes } from './errorUtils';

const createHeaders = (product: string, cloudId?: string): Headers => {
	const config = {
		headers: {
			'X-Product': product,
			'X-Experience-Id': 'profile-card',
			'X-Cloudid': cloudId || '',
		},
	};

	return new Headers({
		...(config.headers || {}),
	});
};

export default class RovoAgentCardClient extends CachingClient<RovoAgent> {
	options: ProfileClientOptions;

	constructor(options: ProfileClientOptions) {
		super(options);
		this.options = options;
	}

	makeRequest(id: AgentIdType, cloudId: string): Promise<RovoAgent> {
		const product = this.options.productIdentifier || 'rovo';
		const headers = createHeaders(product, this.options.cloudId);
		if (id.type === 'identity') {
			return fetch(
				new Request(`/gateway/api/assist/agents/v1/accountid/${id.value}`, {
					method: 'GET',
					credentials: 'include',
					mode: 'cors',
					headers,
				}),
			).then((response) => response.json());
		}
		return fetch(
			new Request(`/gateway/api/assist/agents/v1/${id.value}`, {
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
				new Request(`/gateway/api/assist/agents/v1/${agentId}`, {
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
				new Request(`/gateway/api/assist/agents/v1/${agentId}/favourite`, {
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
}

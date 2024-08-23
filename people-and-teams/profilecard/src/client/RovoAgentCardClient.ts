import { type AnalyticsEventPayload } from '@atlaskit/analytics-next';

import type { AgentIdType, ProfileClientOptions, RovoAgent } from '../types';
import { agentRequestAnalytics } from '../util/analytics';
import { getPageTime } from '../util/performance';

import CachingClient from './CachingClient';
import { getErrorAttributes } from './errorUtils';
import { getAgentDetailsByAgentId, getAgentDetailsByUserId } from './getAgentInfo';

export default class RovoAgentCardClient extends CachingClient<RovoAgent> {
	options: ProfileClientOptions;

	constructor(options: ProfileClientOptions) {
		super(options);
		this.options = options;
	}

	makeRequest(id: AgentIdType, cloudId: string): Promise<RovoAgent> {
		if (id.type === 'identity') {
			return getAgentDetailsByUserId(id.value, this.options.productIdentifier || 'rovo', cloudId);
		}
		return getAgentDetailsByAgentId(id.value, this.options.productIdentifier || 'rovo', cloudId);
	}

	getProfile(
		id: AgentIdType,
		analytics?: (event: AnalyticsEventPayload) => void,
	): Promise<RovoAgent> {
		if (!id.value) {
			return Promise.reject(new Error('IF is missing'));
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
							agentRequestAnalytics('succeeded', {
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
							agentRequestAnalytics('failed', {
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

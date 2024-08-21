import { type AnalyticsEventPayload } from '@atlaskit/analytics-next';

import type { ProfileClientOptions, RovoAgent } from '../types';
import { agentRequestAnalytics } from '../util/analytics';
import { getPageTime } from '../util/performance';

import CachingClient from './CachingClient';
import { getErrorAttributes } from './errorUtils';
import { getAgentDetailsByAgentId } from './getAgentInfo';

export default class RovoAgentCardClient extends CachingClient<RovoAgent> {
	options: ProfileClientOptions;

	constructor(options: ProfileClientOptions) {
		super(options);
		this.options = options;
	}

	makeRequest(agentId: string, cloudId: string): Promise<RovoAgent> {
		if (!this.options.productIdentifier) {
			throw new Error('Trying to fetch agents data with no specified config.productIdentifier');
		}
		return getAgentDetailsByAgentId(agentId, this.options.productIdentifier, cloudId);
	}

	getProfile(
		agentId: string,
		analytics?: (event: AnalyticsEventPayload) => void,
	): Promise<RovoAgent> {
		if (!agentId) {
			return Promise.reject(new Error('agentId is missing'));
		}

		if (!this.options.cloudId) {
			return Promise.reject(new Error('cloudId is missing'));
		}

		const cache = this.getCachedProfile(agentId);

		if (cache) {
			return Promise.resolve(cache);
		}

		return new Promise((resolve, reject) => {
			const startTime = getPageTime();

			if (analytics) {
				analytics(agentRequestAnalytics('triggered'));
			}

			this.makeRequest(agentId, this.options.cloudId || '')
				.then((data: RovoAgent) => {
					if (this.cache) {
						this.setCachedProfile(agentId, data);
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

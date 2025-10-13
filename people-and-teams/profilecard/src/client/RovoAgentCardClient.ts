import { type AnalyticsEventPayload } from '@atlaskit/analytics-next';
import { fg } from '@atlaskit/platform-feature-flags';
import { type FireEventType } from '@atlaskit/teams-app-internal-analytics';

import type {
	AgentIdType,
	AgentPermissions,
	ProfileClientOptions,
	RovoAgent,
	RovoAgentAgg,
	RovoAgentCardClientResult,
} from '../types';
import { agentRequestAnalytics, PACKAGE_META_DATA } from '../util/analytics';
import { getPageTime } from '../util/performance';

import CachingClient from './CachingClient';
import { DEPRECATED_getErrorAttributes, getErrorAttributes } from './errorUtils';
import { AGGQuery } from './graphqlUtils';

const buildActivationIdQuery = (cloudId: string, product: string) => ({
	query: `
		query RovoAgentProfileCard_ActivationQuery($cloudId: ID!, $product: String!) {
			tenantContexts(cloudIds: [$cloudId]) {
				activationIdByProduct(product: $product) {
					active
				}
			}
		}
	`,
	variables: {
		cloudId,
		product,
	},
});

const buildRovoAgentQueryByAri = (agentAri: string) => ({
	query: `
	  query RovoAgentProfileCard_AgentQueryByAri($agentAri: ID!) {
			agentStudio_agentById(id: $agentAri) @optIn(to: "AgentStudio") {
			  __typename
				... on AgentStudioAssistant {
					authoringTeam {
						displayName
					}
				}
				... on QueryError {
					message
				}
			}
		}
	`,
	variables: {
		agentAri,
	},
});

const buildRovoAgentQueryByAccountId = (identityAccountId: string, cloudId: string) => ({
	query: `
		query RovoAgentProfileCard_AgentQueryByAccountId($identityAccountId: ID!, $cloudId: ID!) {
			agentStudio_agentByIdentityAccountId(identityAccountId: $identityAccountId, cloudId: $cloudId) @optIn(to: "AgentStudio") {
			  __typename
				... on AgentStudioAssistant {
					authoringTeam {
						displayName
						profileUrl
					}
				}
				... on QueryError {
					message
				}
			}
		}
	`,
	variables: {
		identityAccountId,
		cloudId,
	},
});

type AgentAggResponse =
	| ({
			__typename: 'AgentStudioAssistant';
	  } & RovoAgentAgg)
	| {
			__typename: 'QueryError';
			message: string | null | undefined;
	  };

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

export default class RovoAgentCardClient extends CachingClient<RovoAgentCardClientResult> {
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

	private async getActivationId(cloudId: string, product: string): Promise<string | null> {
		const response = await AGGQuery<{
			tenantContexts: (
				| {
						activationIdByProduct:
							| {
									active: string | null | undefined;
							  }
							| null
							| undefined;
				  }
				| null
				| undefined
			)[];
		}>('/gateway/api/graphql', buildActivationIdQuery(cloudId, product));
		return response?.tenantContexts?.[0]?.activationIdByProduct?.active ?? null;
	}

	private async getAgentByARIAgg(agentAri: string): Promise<RovoAgentAgg | null | undefined> {
		const response = await AGGQuery<{
			agentStudio_agentById: AgentAggResponse | null | undefined;
		}>('/gateway/api/graphql', buildRovoAgentQueryByAri(agentAri));

		if (response.agentStudio_agentById?.__typename === 'QueryError') {
			throw new Error(
				`ProfileCard agentStudio_agentById returning QueryError: ${response.agentStudio_agentById.message}`,
			);
		}

		return response?.agentStudio_agentById;
	}

	private async getAgentByAccountIdAgg(
		identityAccountId: string,
		cloudId: string,
	): Promise<RovoAgentAgg | null | undefined> {
		const response = await AGGQuery<{
			agentStudio_agentByIdentityAccountId: AgentAggResponse | null | undefined;
		}>('/gateway/api/graphql', buildRovoAgentQueryByAccountId(identityAccountId, cloudId));

		if (response.agentStudio_agentByIdentityAccountId?.__typename === 'QueryError') {
			throw new Error(
				`ProfileCard agentStudio_agentByIdentityAccountId returning QueryError: ${response.agentStudio_agentByIdentityAccountId.message}`,
			);
		}

		return response?.agentStudio_agentByIdentityAccountId;
	}

	makeRequest(id: AgentIdType, analyticsNext?: FireEventType): Promise<RovoAgentCardClientResult> {
		const product = this.options.productIdentifier || 'rovo';
		const headers = createHeaders(product, this.options.cloudId);

		let restPromise: Promise<RovoAgent>;
		if (id.type === 'identity') {
			restPromise = fetch(
				new Request(`${this.basePath()}/accountid/${id.value}`, {
					method: 'GET',
					credentials: 'include',
					mode: 'cors',
					headers,
				}),
			).then((response) => response.json());
		} else {
			restPromise = fetch(
				new Request(`${this.basePath()}/${id.value}`, {
					method: 'GET',
					credentials: 'include',
					mode: 'cors',
					headers,
				}),
			).then((response) => response.json());
		}

		if (!fg('agent_studio_permissions_settings_m3_profiles')) {
			return restPromise.then((restData) => ({ restData, aggData: null }));
		}

		const aggStartTime = getPageTime();
		const aggPromise = this.getActivationId(
			this.options.cloudId || '',
			this.options.productIdentifier || 'rovo',
		)
			.then((activationId) => {
				if (!activationId) {
					throw new Error('ProfileCard Activation ID not found');
				}

				if (id.type === 'identity') {
					return this.getAgentByAccountIdAgg(id.value, this.options.cloudId || '');
				} else {
					const agentAri = `ari:cloud:rovo::agent/activation/${activationId}/${id.value}`;
					return this.getAgentByARIAgg(agentAri);
				}
			})
			// We are not going to break the flow if the AGG endpoint fails for now
			// @TODO once all the data moved to AGG, we can remove this catch
			.catch((error) => {
				if (analyticsNext) {
					analyticsNext('operational.rovoAgentProfilecard.failed.request', {
						...getErrorAttributes(error),
						errorType: 'RovoAgentProfileCardAggError',
						duration: getPageTime() - aggStartTime,
						gateway: true,
						firedAt: Math.round(getPageTime()),
						...PACKAGE_META_DATA,
					});
				}

				return Promise.resolve(null);
			});

		return Promise.all([restPromise, aggPromise]).then(([restData, aggData]) => ({
			restData,
			aggData,
		}));
	}

	/**
	 * This function will call both REST and AGG endpoints to get the agent profile
	 * There are some data that is only available in the AGG endpoint, so we need to call both
	 * For any new fields, please only add them to the AGG endpoint
	 *
	 * @TODO migrate everything to AGG endpoint
	 */
	getProfile(
		id: AgentIdType,
		analytics?: (event: AnalyticsEventPayload) => void,
		analyticsNext?: FireEventType,
	): Promise<RovoAgentCardClientResult> {
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

			if (fg('ptc-enable-profile-card-analytics-refactor')) {
				if (analyticsNext) {
					analyticsNext('operational.rovoAgentProfilecard.triggered.request', {
						firedAt: Math.round(getPageTime()),
						...PACKAGE_META_DATA,
					});
				}
			} else {
				if (analytics) {
					analytics(agentRequestAnalytics('triggered'));
				}
			}

			this.makeRequest(id, analyticsNext)
				.then((data) => {
					if (this.cache) {
						this.setCachedProfile(id.value, data);
					}
					if (fg('ptc-enable-profile-card-analytics-refactor')) {
						if (analyticsNext) {
							analyticsNext('operational.rovoAgentProfilecard.succeeded.request', {
								duration: getPageTime() - startTime,
								gateway: true,
								firedAt: Math.round(getPageTime()),
								...PACKAGE_META_DATA,
							});
						}
					} else {
						if (analytics) {
							analytics(
								agentRequestAnalytics('succeeded', 'request', {
									duration: getPageTime() - startTime,
									gateway: true,
								}),
							);
						}
					}
					resolve(data);
				})
				.catch((error: unknown) => {
					if (fg('ptc-enable-profile-card-analytics-refactor')) {
						if (analyticsNext) {
							analyticsNext('operational.rovoAgentProfilecard.failed.request', {
								duration: getPageTime() - startTime,
								...getErrorAttributes(error),
								gateway: true,
								firedAt: Math.round(getPageTime()),
								...PACKAGE_META_DATA,
							});
						}
					} else {
						if (analytics) {
							analytics(
								agentRequestAnalytics('failed', 'request', {
									duration: getPageTime() - startTime,
									...DEPRECATED_getErrorAttributes(error),
									gateway: true,
								}),
							);
						}
					}
					reject(error);
				});
		});
	}

	deleteAgent(
		agentId: string,
		analytics?: (event: AnalyticsEventPayload) => void,
		analyticsNext?: FireEventType,
	): Promise<void> {
		if (!this.options.cloudId) {
			return Promise.reject(new Error('cloudId is missing'));
		}

		return new Promise((resolve, reject) => {
			const startTime = getPageTime();
			const product = this.options.productIdentifier || 'rovo';

			if (fg('ptc-enable-profile-card-analytics-refactor')) {
				if (analyticsNext) {
					analyticsNext('operational.rovoAgentProfilecard.triggered.request', {
						firedAt: Math.round(getPageTime()),
						...PACKAGE_META_DATA,
					});
				}
			} else {
				if (analytics) {
					analytics(agentRequestAnalytics('triggered'));
				}
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
					if (fg('ptc-enable-profile-card-analytics-refactor')) {
						if (analyticsNext) {
							analyticsNext('operational.rovoAgentProfilecard.succeeded.deleteAgent', {
								duration: getPageTime() - startTime,
								gateway: true,
								firedAt: Math.round(getPageTime()),
								...PACKAGE_META_DATA,
							});
						}
					} else {
						if (analytics) {
							analytics(
								agentRequestAnalytics('succeeded', 'deleteAgent', {
									duration: getPageTime() - startTime,
									gateway: true,
								}),
							);
						}
					}
					resolve();
				})
				.catch((error: unknown) => {
					if (fg('ptc-enable-profile-card-analytics-refactor')) {
						if (analyticsNext) {
							analyticsNext('operational.rovoAgentProfilecard.failed.deleteAgent', {
								duration: getPageTime() - startTime,
								...getErrorAttributes(error),
								gateway: true,
								firedAt: Math.round(getPageTime()),
								...PACKAGE_META_DATA,
							});
						}
					} else {
						if (analytics) {
							analytics(
								agentRequestAnalytics('failed', 'deleteAgent', {
									duration: getPageTime() - startTime,
									...DEPRECATED_getErrorAttributes(error),
									gateway: true,
								}),
							);
						}
					}
					reject(error);
				});
		});
	}

	setFavouriteAgent(
		agentId: string,
		isFavourite: boolean,
		analytics?: (event: AnalyticsEventPayload) => void,
		analyticsNext?: FireEventType,
	): Promise<void> {
		if (!this.options.cloudId) {
			return Promise.reject(new Error('cloudId is missing'));
		}

		return new Promise(async (resolve, reject) => {
			const startTime = getPageTime();
			const product = this.options.productIdentifier || 'rovo';

			const actionSubjectId = isFavourite ? 'favourite' : 'unfavourite';
			const requestMethod = isFavourite ? 'POST' : 'DELETE';

			if (fg('ptc-enable-profile-card-analytics-refactor')) {
				if (analyticsNext) {
					analyticsNext(`operational.rovoAgentProfilecard.triggered.${actionSubjectId}`, {
						firedAt: Math.round(getPageTime()),
						...PACKAGE_META_DATA,
					});
				}
			} else {
				if (analytics) {
					analytics(agentRequestAnalytics('triggered', 'actionSubjectId'));
				}
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
					if (fg('ptc-enable-profile-card-analytics-refactor')) {
						if (analyticsNext) {
							analyticsNext(`operational.rovoAgentProfilecard.succeeded.${actionSubjectId}`, {
								duration: getPageTime() - startTime,
								gateway: true,
								firedAt: Math.round(getPageTime()),
								...PACKAGE_META_DATA,
							});
						}
					} else {
						if (analytics) {
							analytics(
								agentRequestAnalytics('succeeded', actionSubjectId, {
									duration: getPageTime() - startTime,
									gateway: true,
								}),
							);
						}
					}
					resolve();
				})
				.catch((error: unknown) => {
					if (fg('ptc-enable-profile-card-analytics-refactor')) {
						if (analyticsNext) {
							analyticsNext(`operational.rovoAgentProfilecard.failed.${actionSubjectId}`, {
								duration: getPageTime() - startTime,
								...getErrorAttributes(error),
								gateway: true,
								firedAt: Math.round(getPageTime()),
								...PACKAGE_META_DATA,
							});
						}
					} else {
						if (analytics) {
							analytics(
								agentRequestAnalytics('failed', actionSubjectId, {
									duration: getPageTime() - startTime,
									...DEPRECATED_getErrorAttributes(error),
									gateway: true,
								}),
							);
						}
					}
					reject(error);
				});
		});
	}

	getPermissions(
		id: string,
		fireAnalytics?: (event: AnalyticsEventPayload) => void,
		fireAnalyticsNext?: FireEventType,
	): Promise<AgentPermissions> {
		if (!this.options.cloudId) {
			return Promise.reject(new Error('cloudId is missing'));
		}

		return new Promise((resolve, reject) => {
			const startTime = getPageTime();
			const product = this.options.productIdentifier || 'rovo';

			if (fg('ptc-enable-profile-card-analytics-refactor')) {
				if (fireAnalyticsNext) {
					fireAnalyticsNext('operational.rovoAgentProfilecard.triggered.request', {
						firedAt: Math.round(getPageTime()),
						...PACKAGE_META_DATA,
					});
				}
			} else {
				if (fireAnalytics) {
					fireAnalytics(agentRequestAnalytics('triggered'));
				}
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
					if (fg('ptc-enable-profile-card-analytics-refactor')) {
						if (fireAnalyticsNext) {
							fireAnalyticsNext('operational.rovoAgentProfilecard.succeeded.getAgentPermissions', {
								duration: getPageTime() - startTime,
								gateway: true,
								firedAt: Math.round(getPageTime()),
								...PACKAGE_META_DATA,
							});
						}
					} else {
						if (fireAnalytics) {
							fireAnalytics(
								agentRequestAnalytics('succeeded', 'getAgentPermissions', {
									duration: getPageTime() - startTime,
									gateway: true,
								}),
							);
						}
					}
					resolve(data);
				})
				.catch((error: unknown) => {
					if (fg('ptc-enable-profile-card-analytics-refactor')) {
						if (fireAnalyticsNext) {
							fireAnalyticsNext('operational.rovoAgentProfilecard.failed.getAgentPermissions', {
								duration: getPageTime() - startTime,
								...getErrorAttributes(error),
								gateway: true,
								firedAt: Math.round(getPageTime()),
								...PACKAGE_META_DATA,
							});
						}
					} else {
						if (fireAnalytics) {
							fireAnalytics(
								agentRequestAnalytics('failed', 'getAgentPermissions', {
									duration: getPageTime() - startTime,
									...DEPRECATED_getErrorAttributes(error),
									gateway: true,
								}),
							);
						}
					}
					reject(error);
				});
		});
	}
}

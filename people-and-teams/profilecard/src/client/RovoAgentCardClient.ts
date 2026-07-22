import FeatureGates from '@atlaskit/feature-gate-js-client/feature-gates';
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
import { PACKAGE_META_DATA } from '../util/analytics';
import { getPageTime } from '../util/performance';
import { USER_ARI_PREFIX } from '../util/rovoAgentUtils';

import CachingClient from './CachingClient';
import { getErrorAttributes } from './errorUtils';
import { AGGQuery } from './graphqlUtils';
import { SHARED_CACHE_MAX_AGE, sharedAgentProfileCache } from './sharedAgentProfileCache';

export class AgentForbiddenError extends Error {
	status = 403;
	constructor() {
		super('Agent access forbidden');
		this.name = 'AgentForbiddenError';
	}
}

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

const buildRovoAgentQueryByAccountIdOld = (identityAccountId: string, cloudId: string) => ({
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

const buildRovoAgentQueryByAccountId = (identityAccountId: string, cloudId: string) => ({
	query: `
		query RovoAgentProfileCard_AgentQueryByAccountId($id: ID!, $cloudId: String!) {
			agentStudio_agentByIdentityAccountId(cloudId: $cloudId, id: $id) @optIn(to: "AgentStudio") {
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
		id: identityAccountId.startsWith(USER_ARI_PREFIX)
			? identityAccountId
			: `${USER_ARI_PREFIX}${identityAccountId}`,
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
		return '/gateway/api/assist/rovo/v1/agents';
	}

	private sharedCacheKey(idValue: string): string {
		return `${this.options.cloudId ?? ''}:${idValue}`;
	}

	getCachedProfile(idValue: string): RovoAgentCardClientResult | null {
		const key = this.sharedCacheKey(idValue);
		const cached = sharedAgentProfileCache.get(key);
		if (!cached) {
			return null;
		}
		if (cached.expire < Date.now()) {
			sharedAgentProfileCache.delete(key);
			return null;
		}
		return cached.profile;
	}

	setCachedProfile(idValue: string, profile: RovoAgentCardClientResult): void {
		sharedAgentProfileCache.set(this.sharedCacheKey(idValue), {
			expire: Date.now() + (this.config.cacheMaxAge || SHARED_CACHE_MAX_AGE),
			profile,
		});
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
		}>(
			'/gateway/api/graphql',
			fg('jira_ai_fix_agent_profile_card_flashing')
				? buildRovoAgentQueryByAccountId(identityAccountId, cloudId)
				: buildRovoAgentQueryByAccountIdOld(identityAccountId, cloudId),
		);

		if (response.agentStudio_agentByIdentityAccountId?.__typename === 'QueryError') {
			throw new Error(
				`ProfileCard agentStudio_agentByIdentityAccountId returning QueryError: ${response.agentStudio_agentByIdentityAccountId.message}`,
			);
		}

		return response?.agentStudio_agentByIdentityAccountId;
	}

	makeRequest(id: AgentIdType, analytics?: FireEventType): Promise<RovoAgentCardClientResult> {
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
			).then((response) => {
				if (
					response.status === 403 &&
					FeatureGates.getExperimentValue(
						'platform_editor_reduced_profile_cards',
						'isEnabled',
						false,
					)
				) {
					throw new AgentForbiddenError();
				}
				return response.json();
			});
		} else {
			restPromise = fetch(
				new Request(`${this.basePath()}/${id.value}`, {
					method: 'GET',
					credentials: 'include',
					mode: 'cors',
					headers,
				}),
			).then((response) => {
				if (
					response.status === 403 &&
					FeatureGates.getExperimentValue(
						'platform_editor_reduced_profile_cards',
						'isEnabled',
						false,
					)
				) {
					throw new AgentForbiddenError();
				}
				return response.json();
			});
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
				if (analytics) {
					analytics('operational.rovoAgentProfilecard.failed.request', {
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
	getProfile(id: AgentIdType, analytics?: FireEventType): Promise<RovoAgentCardClientResult> {
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
				analytics('operational.rovoAgentProfilecard.triggered.request', {
					firedAt: Math.round(getPageTime()),
					...PACKAGE_META_DATA,
				});
			}

			this.makeRequest(id, analytics)
				.then((data) => {
					this.setCachedProfile(id.value, data);
					if (analytics) {
						analytics('operational.rovoAgentProfilecard.succeeded.request', {
							duration: getPageTime() - startTime,
							gateway: true,
							firedAt: Math.round(getPageTime()),
							...PACKAGE_META_DATA,
						});
					}

					resolve(data);
				})
				.catch((error: unknown) => {
					if (analytics) {
						analytics('operational.rovoAgentProfilecard.failed.request', {
							duration: getPageTime() - startTime,
							...getErrorAttributes(error),
							gateway: true,
							firedAt: Math.round(getPageTime()),
							...PACKAGE_META_DATA,
						});
					}

					reject(error);
				});
		});
	}

	deleteAgent(agentId: string, analytics?: FireEventType): Promise<void> {
		if (!this.options.cloudId) {
			return Promise.reject(new Error('cloudId is missing'));
		}

		return new Promise((resolve, reject) => {
			const startTime = getPageTime();
			const product = this.options.productIdentifier || 'rovo';

			if (analytics) {
				analytics('operational.rovoAgentProfilecard.triggered.request', {
					firedAt: Math.round(getPageTime()),
					...PACKAGE_META_DATA,
				});
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
						analytics('operational.rovoAgentProfilecard.succeeded.deleteAgent', {
							duration: getPageTime() - startTime,
							gateway: true,
							firedAt: Math.round(getPageTime()),
							...PACKAGE_META_DATA,
						});
					}

					resolve();
				})
				.catch((error: unknown) => {
					if (analytics) {
						analytics('operational.rovoAgentProfilecard.failed.deleteAgent', {
							duration: getPageTime() - startTime,
							...getErrorAttributes(error),
							gateway: true,
							firedAt: Math.round(getPageTime()),
							...PACKAGE_META_DATA,
						});
					}

					reject(error);
				});
		});
	}

	setFavouriteAgent(
		agentId: string,
		isFavourite: boolean,
		analytics?: FireEventType,
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
				analytics(`operational.rovoAgentProfilecard.triggered.${actionSubjectId}`, {
					firedAt: Math.round(getPageTime()),
					...PACKAGE_META_DATA,
				});
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
						analytics(`operational.rovoAgentProfilecard.succeeded.${actionSubjectId}`, {
							duration: getPageTime() - startTime,
							gateway: true,
							firedAt: Math.round(getPageTime()),
							...PACKAGE_META_DATA,
						});
					}

					this.syncFavouriteToCache(agentId, isFavourite);

					resolve();
				})
				.catch((error: unknown) => {
					if (analytics) {
						analytics(`operational.rovoAgentProfilecard.failed.${actionSubjectId}`, {
							duration: getPageTime() - startTime,
							...getErrorAttributes(error),
							gateway: true,
							firedAt: Math.round(getPageTime()),
							...PACKAGE_META_DATA,
						});
					}

					reject(error);
				});
		});
	}

	/**
	 * Keeps the shared agent profile cache in sync with the favourite state
	 */
	private syncFavouriteToCache(agentId: string, isFavourite: boolean): void {
		const prefix = `${this.options.cloudId ?? ''}:`;
		const keysToUpdate: string[] = [];
		sharedAgentProfileCache.forEach((cached, key) => {
			if (key.startsWith(prefix) && cached.profile?.restData?.id === agentId) {
				keysToUpdate.push(key);
			}
		});

		keysToUpdate.forEach((key) => {
			const cached = sharedAgentProfileCache.get(key);
			if (!cached) {
				return;
			}

			const { restData } = cached.profile;
			const wasFavourite = restData.favourite;
			const currentCount = restData.favourite_count ?? 0;
			const favouriteCount = isFavourite
				? currentCount + (wasFavourite ? 0 : 1)
				: Math.max(0, currentCount - (wasFavourite ? 1 : 0));

			sharedAgentProfileCache.set(key, {
				...cached,
				profile: {
					...cached.profile,
					restData: {
						...restData,
						favourite: isFavourite,
						favourite_count: favouriteCount,
					},
				},
			});
		});
	}

	getPermissions(id: string, fireAnalytics?: FireEventType): Promise<AgentPermissions> {
		if (!this.options.cloudId) {
			return Promise.reject(new Error('cloudId is missing'));
		}

		return new Promise((resolve, reject) => {
			const startTime = getPageTime();
			const product = this.options.productIdentifier || 'rovo';

			if (fireAnalytics) {
				fireAnalytics('operational.rovoAgentProfilecard.triggered.request', {
					firedAt: Math.round(getPageTime()),
					...PACKAGE_META_DATA,
				});
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
						fireAnalytics('operational.rovoAgentProfilecard.succeeded.getAgentPermissions', {
							duration: getPageTime() - startTime,
							gateway: true,
							firedAt: Math.round(getPageTime()),
							...PACKAGE_META_DATA,
						});
					}

					resolve(data);
				})
				.catch((error: unknown) => {
					if (fireAnalytics) {
						fireAnalytics('operational.rovoAgentProfilecard.failed.getAgentPermissions', {
							duration: getPageTime() - startTime,
							...getErrorAttributes(error),
							gateway: true,
							firedAt: Math.round(getPageTime()),
							...PACKAGE_META_DATA,
						});
					}

					reject(error);
				});
		});
	}
}

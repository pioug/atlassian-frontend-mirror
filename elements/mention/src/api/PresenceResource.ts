/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
import { type Presence } from '../types';
import { buildAtlAttributionHeaderValue } from '../util/atl-attribution';
import { AbstractPresenceResource } from './AbstractPresenceResource';
import { DefaultPresenceCache } from './DefaultPresenceCache';
import { DefaultPresenceParser } from './DefaultPresenceParser';
import { type ResourceProvider } from './MentionResource';

export interface PresenceMap {
	[userId: string]: Presence;
}

/**
 * Configuration for the PresenceResource, which manages real-time user
 * presence (online/offline/busy/focus status) by querying a GraphQL-based
 * presence service.
 */
export interface PresenceResourceConfig {
	/**
	 * The activation ID for the current product instance, used to build
	 * the `atl-attribution` header for presence service requests.
	 */
	activationId?: string;

	/**
	 * A custom cache implementation for storing presence data. If not provided,
	 * a {@link DefaultPresenceCache} is used with the specified `cacheExpiry`.
	 */
	cache?: PresenceCache;

	/**
	 * The expiry time in milliseconds for cached presence entries.
	 * Defaults to 20,000ms (20 seconds) when using the default cache.
	 */
	cacheExpiry?: number;

	/**
	 * The cloud ID (organization ID) of the Atlassian site. Required.
	 * Used as the `organizationId` variable in the presence GraphQL query.
	 */
	cloudId: string;

	/**
	 * Custom HTTP headers to include in presence service requests.
	 */
	headers?: Record<string, string>;

	/**
	 * A custom parser for transforming raw presence service responses into
	 * a {@link PresenceMap}. If not provided, a {@link DefaultPresenceParser} is used,
	 * which maps `'available'` → `'online'` and `'unavailable'` → `'offline'`.
	 */
	parser?: PresenceParser;

	/**
	 * The product identifier (e.g. `'confluence'`, `'jira'`) passed as the
	 * `product` variable in the presence GraphQL query to scope results.
	 */
	productId?: string;

	/**
	 * The base URL of the presence service endpoint. Required.
	 * A trailing slash will be appended automatically if not present.
	 */
	url: string;
}

export interface PresenceCache {
	contains(userId: string): boolean;
	get(userId: string): Presence;
	getBulk(userIds: string[]): PresenceMap;
	getMissingUserIds(userIds: string[]): string[];
	update(presUpdate: PresenceMap): void;
}

export interface PresenceResponse {
	data: Data;
}

export interface Data {
	PresenceBulk: PresenceBulk[];
}

export interface PresenceBulk {
	date: null | string;
	message: null | string;
	state: null | string;
	stateMetadata?: string;
	type: null | string;
	userId: string;
}

type Query = {
	query: string;
	variables: {
		[key: string]: any;
	};
};

export interface PresenceParser {
	mapState(state: string): string;
	parse(response: PresenceResponse): PresenceMap;
}

export interface PresenceProvider extends ResourceProvider<PresenceMap> {
	refreshPresence(userIds: string[]): void;
}

export class PresenceResource extends AbstractPresenceResource {
	private config: PresenceResourceConfig;
	private presenceCache: PresenceCache;
	private presenceParser: PresenceParser;

	constructor(config: PresenceResourceConfig) {
		super();

		if (!config.url) {
			throw new Error('config.url is a required parameter');
		}

		if (!config.cloudId) {
			throw new Error('config.cloudId is a required parameter');
		}

		this.config = config;
		this.config.url = PresenceResource.cleanUrl(config.url);
		this.presenceCache = config.cache || new DefaultPresenceCache(config.cacheExpiry);
		this.presenceParser = config.parser || new DefaultPresenceParser();
	}

	refreshPresence(userIds: string[]): void {
		const cacheHits = this.presenceCache.getBulk(userIds);
		this.notifyListeners(cacheHits);
		const cacheMisses = this.presenceCache.getMissingUserIds(userIds);

		if (cacheMisses.length) {
			this.retrievePresence(cacheMisses);
		}
	}

	private retrievePresence(userIds: string[]) {
		this.queryDirectoryForPresences(userIds)
			.then((res) => this.presenceParser.parse(res))
			.then((presences) => {
				this.notifyListeners(presences);
				this.presenceCache.update(presences);
			});
	}

	private queryDirectoryForPresences(userIds: string[]): Promise<PresenceResponse> {
		const query: Query = {
			query: `query getPresenceForMentions($organizationId: String!, $userIds: [String!], $productId: String) {
                PresenceBulk(organizationId: $organizationId, product: $productId, userIds: $userIds) {
                  userId
                  state
                  stateMetadata
                }
              }`,
			variables: {
				organizationId: this.config.cloudId,
				userIds: userIds,
			},
		};
		if (this.config.productId) {
			query.variables['productId'] = this.config.productId;
		}

		const atlAttributionHeader = buildAtlAttributionHeaderValue({
			cloudId: this.config.cloudId,
			productId: this.config.productId,
			activationId: this.config.activationId,
		});

		const options: RequestInit = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...atlAttributionHeader,
				...this.config.headers,
			},
			credentials: 'include',
			body: JSON.stringify(query),
		};
		return fetch(this.config.url, options).then((response) => response.json());
	}

	private static cleanUrl(url: string): string {
		if (url.substr(-1) !== '/') {
			url += '/';
		}
		return url;
	}
}

/**
 * @deprecated Use `import { DefaultPresenceCache } from '@atlaskit/mention/presence-resource'` instead.
 */
export { DefaultPresenceCache } from './DefaultPresenceCache';

/**
 * @deprecated Use `import { DefaultPresenceParser } from '@atlaskit/mention/presence-resource'` instead.
 */
export { DefaultPresenceParser } from './DefaultPresenceParser';

/**
 * @deprecated Use `import { AbstractPresenceResource } from '@atlaskit/mention/presence-resource'` instead.
 */
export { AbstractPresenceResource } from './AbstractPresenceResource';

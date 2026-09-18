/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

import debounce from 'lodash/debounce';

import { type KeyValues, utils as serviceUtils } from '@atlaskit/util-service-support';

import { isAppMention } from '../is-app-mention';
import { isTeamMention } from '../is-team-mention';
import {
	type InviteFlow,
	type MentionContextIdentifier,
	type MentionDescription,
	type MentionDisabledState,
	type MentionDisabledStateInput,
	type MentionNameDetails,
	MentionNameStatus,
	type MentionProvider,
	type MentionResourceConfig,
	type MentionsResult,
	type UserRole,
	SliNames,
	Actions,
} from '../types';
import { SLI_EVENT_TYPE } from '../util/analytics';
import debug from '../util/logger';
import { AbstractMentionResource } from './AbstractMentionResource';

const MAX_QUERY_ITEMS = 100;

export type {
	MentionStats,
	ResultCallback,
	ErrorCallback,
	InfoCallback,
	MentionResourceConfig,
	ResourceProvider,
	MentionContextIdentifier,
	MentionProvider,
} from '../types';

/**
 * Configuration for the TeamMentionResource, which extends {@link MentionResourceConfig}
 * to support fetching team mentions from a separate team search service endpoint.
 *
 * Used as the second argument when constructing a {@link TeamMentionResource}, alongside
 * a standard `MentionResourceConfig` for user mentions.
 */
export interface TeamMentionResourceConfig extends MentionResourceConfig {
	/**
	 * A custom resolver function to generate the URL for a team's profile page.
	 * If not provided, a default link of `{window.location.origin}/people/team/{teamId}` is used.
	 *
	 * @param teamId - The ID of the team (with any ARI prefix already trimmed).
	 * @returns The full URL to the team's profile page.
	 */
	teamLinkResolver?: (teamId: string) => string;
}

/**
 * Support
 */
export interface ResolvingMentionProvider extends MentionProvider {
	cacheMentionName(id: string, mentionName: string): void;
	resolveMentionName(id: string): Promise<MentionNameDetails> | MentionNameDetails;
	supportsMentionNameResolving(): boolean;
}

const emptySecurityProvider = () => {
	return {
		params: {},
		headers: {},
	};
};

type SearchResponse = {
	mentions: Promise<MentionsResult>;
};

/**
 * Provides a Javascript API
 */
export class MentionResource extends AbstractMentionResource implements ResolvingMentionProvider {
	private config: MentionResourceConfig;
	private lastReturnedSearch: number;
	private activeSearches: Set<string>;

	productName?: string;
	shouldEnableInvite: boolean;
	userRole: UserRole;
	onInviteItemClick?: (flow: InviteFlow) => void;
	inviteXProductUser?: (userId: string, mentionName: string) => Promise<void>;

	constructor(config: MentionResourceConfig) {
		super();

		this.verifyMentionConfig(config);

		this.config = config;
		this.lastReturnedSearch = 0;
		this.activeSearches = new Set();
		this.productName = config.productName;
		this.shouldEnableInvite = !!config.shouldEnableInvite;
		this.onInviteItemClick = config.onInviteItemClick;
		this.inviteXProductUser = config.inviteXProductUser;
		this.userRole = config.userRole || 'basic';
		if (this.config.debounceTime) {
			this.filter = debounce(this.filter, this.config.debounceTime) as any;
		}
	}

	shouldHighlightMention(mention: MentionDescription): boolean {
		if (this.config.shouldHighlightMention) {
			return this.config.shouldHighlightMention(mention);
		}

		return false;
	}

	getMentionDisabledState(mention: MentionDisabledStateInput): MentionDisabledState | undefined {
		return this.config.getMentionDisabledState?.(mention);
	}

	notify(searchTime: number, mentionResult: MentionsResult, query?: string): void {
		if (searchTime > this.lastReturnedSearch) {
			this.lastReturnedSearch = searchTime;
			this._notifyListeners(mentionResult, {
				duration: Date.now() - searchTime,
			});
		} else {
			const date = new Date(searchTime).toISOString().substr(17, 6);
			debug('Stale search result, skipping', date, query); // eslint-disable-line no-console, max-len
		}

		this._notifyAllResultsListeners(mentionResult);
	}

	notifyError(error: Error, query?: string): void {
		this._notifyErrorListeners(error, query);
		if (query) {
			this.activeSearches.delete(query);
		}
	}

	async filter(query?: string, contextIdentifier?: MentionContextIdentifier): Promise<void> {
		try {
			const searchTime = Date.now();
			let results;
			if (!query) {
				results = await this.initialState(contextIdentifier);
			} else {
				this.activeSearches.add(query);
				const searchResponse = this.search(query, contextIdentifier);
				results = await searchResponse.mentions;
			}

			this.notify(searchTime, results, query);
		} catch (error) {
			this.notifyError(error as Error, query);
		}
	}

	isFiltering(query: string): boolean {
		return this.activeSearches.has(query);
	}

	resolveMentionName(id: string): Promise<MentionNameDetails> | MentionNameDetails {
		if (!this.config.mentionNameResolver) {
			return {
				id,
				name: '',
				status: MentionNameStatus.UNKNOWN,
			};
		}
		return this.config.mentionNameResolver.lookupName(id);
	}

	cacheMentionName(id: string, mentionName: string): void {
		if (!this.config.mentionNameResolver) {
			return;
		}
		this.config.mentionNameResolver.cacheName(id, mentionName);
	}

	supportsMentionNameResolving(): boolean {
		return !!this.config.mentionNameResolver;
	}

	protected updateActiveSearches(query: string): void {
		this.activeSearches.add(query);
	}

	protected verifyMentionConfig(config: MentionResourceConfig): void {
		if (!config.url) {
			throw new Error('config.url is a required parameter');
		}

		if (!config.securityProvider) {
			config.securityProvider = emptySecurityProvider;
		}
	}

	private initialState(contextIdentifier?: MentionContextIdentifier): Promise<MentionsResult> {
		return this.remoteInitialState(contextIdentifier);
	}

	/**
	 * Clear a context object to generate query params by removing empty
	 * strings, `undefined` and empty values.
	 *
	 * @param contextIdentifier the current context identifier
	 * @returns a safe context for query encoding
	 */
	private clearContext(contextIdentifier: MentionContextIdentifier = {}): MentionContextIdentifier {
		return (Object.keys(contextIdentifier) as Array<keyof MentionContextIdentifier>)
			.filter((key) => contextIdentifier[key])
			.reduce(
				(context, key) => ({
					[key]: contextIdentifier[key],
					...context,
				}),
				{},
			);
	}

	private getQueryParams(contextIdentifier?: MentionContextIdentifier): KeyValues {
		const configParams: KeyValues = {};

		if (this.config.containerId) {
			configParams['containerId'] = this.config.containerId;
		}

		if (this.config.productId) {
			configParams['productIdentifier'] = this.config.productId;
		}

		// if contextParams exist then it will override configParams for containerId
		return { ...configParams, ...this.clearContext(contextIdentifier) };
	}

	/**
	 * Returns the initial mention display list before a search is performed for the specified
	 * container.
	 *
	 * @param contextIdentifier
	 * @returns Promise
	 */
	protected async remoteInitialState(
		contextIdentifier?: MentionContextIdentifier,
	): Promise<MentionsResult> {
		const queryParams: KeyValues = this.getQueryParams(contextIdentifier);
		const configHeaders = this.config.headers;
		const options = {
			path: 'bootstrap',
			queryParams,
			...(configHeaders && { requestInit: { headers: configHeaders } }),
		};
		try {
			const result = await serviceUtils.requestService<MentionsResult>(this.config, options);
			this._notifyAnalyticsListeners(SLI_EVENT_TYPE, SliNames.INITIAL_STATE, Actions.SUCCEEDED);
			return this.transformServiceResponse(result, '');
		} catch (error) {
			this._notifyAnalyticsListeners(SLI_EVENT_TYPE, SliNames.INITIAL_STATE, Actions.FAILED);
			throw error;
		}
	}

	private search(query: string, contextIdentifier?: MentionContextIdentifier): SearchResponse {
		return {
			mentions: this.remoteSearch(query, contextIdentifier),
		};
	}

	protected async remoteSearch(
		query: string,
		contextIdentifier?: MentionContextIdentifier,
	): Promise<MentionsResult> {
		const configHeaders = this.config.headers;
		const options = {
			path: 'search',
			queryParams: {
				query,
				limit: MAX_QUERY_ITEMS,
				...this.getQueryParams(contextIdentifier),
			},
			...(configHeaders && { requestInit: { headers: configHeaders } }),
		};
		try {
			const result = await serviceUtils.requestService<MentionsResult>(this.config, options);
			this._notifyAnalyticsListeners(SLI_EVENT_TYPE, SliNames.SEARCH, Actions.SUCCEEDED);
			return this.transformServiceResponse(result, query);
		} catch (error) {
			this._notifyAnalyticsListeners(SLI_EVENT_TYPE, SliNames.SEARCH, Actions.FAILED);
			throw error;
		}
	}

	private transformServiceResponse(result: MentionsResult, query: string): MentionsResult {
		const mentions = result.mentions.map((mention) => {
			// Loading placeholders carry none of these fields and pass through untouched.
			if (mention.isPlaceholder) {
				return mention;
			}

			let lozenge: string | undefined;
			if (isAppMention(mention)) {
				lozenge = mention.userType;
			} else if (isTeamMention(mention)) {
				lozenge = mention.userType;
			}

			return { ...mention, lozenge, query };
		});

		return { ...result, mentions, query: result.query || query };
	}
}

/**
 * @deprecated Use `import { HttpError } from '@atlaskit/mention/mention-resource'` instead.
 */
export { HttpError } from './HttpError';

/**
 * @deprecated Use `import { isResolvingMentionProvider } from '@atlaskit/mention/mention-resource'` instead.
 */
export { isResolvingMentionProvider } from './isResolvingMentionProvider';

/**
 * @deprecated Use `import { AbstractResource } from '@atlaskit/mention/mention-resource'` instead.
 */
export { AbstractResource } from './AbstractResource';

/**
 * @deprecated Use `import { AbstractMentionResource } from '@atlaskit/mention/mention-resource'` instead.
 */
export { AbstractMentionResource } from './AbstractMentionResource';

/* eslint-disable require-unicode-regexp,prefer-regex-literals */
import type { JSONNode } from '@atlaskit/editor-json-transformer';
import { extractSmartLinkEmbed, extractSmartLinkUrl } from '@atlaskit/link-extractors';
import type { SmartLinkResponse } from '@atlaskit/linking-types';
import type { CallbackPayload } from '@atlaskit/node-data-provider';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { NodeDataProvider } from '@atlaskit/node-data-provider';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { getStatus, getBaseUrl, getResolverUrl } from '@atlaskit/linking-common';
import type {
	BlockCardAdf,
	EmbedCardAdf,
	CardAdf,
	InlineCardAdf,
	CardAppearance,
	DatasourceAdf,
	ProductType,
	EnvironmentsKeys,
} from '@atlaskit/linking-common';
import DataLoader from 'dataloader';
import { Transformer } from './transformer';
import { isConfluenceSlideUrl } from './url-checkers';
import type {
	CardProvider,
	LinkAppearance,
	ORSProvidersResponse,
	ProviderPattern,
	ProvidersData,
} from './types';
import type { JsonLdDatasourceResponse } from '@atlaskit/link-client-extension';
import { CardClient } from '@atlaskit/link-provider';
import type { JsonLd } from '@atlaskit/json-ld-types';
import { fg } from '@atlaskit/platform-feature-flags';
import { request } from './api';
import { SmartCardLocalCacheClient } from './smart-card-local-cache-client';

const BATCH_WAIT_TIME = 50;
type UrlChecker = (url: string) => RegExpMatchArray | null;

// Check if it is matching a Jira Roadmaps or Jira Timeline url
// NOT to be confused with JSM timeline
const JIRA_ROADMAP_OR_TIMELINE_REGEX =
	/^https:\/\/.*?\/jira\/software\/(c\/)?projects\/[^\/]+?\/boards\/.*?\/(timeline|roadmap)\/?/;
const POLARIS_VIEW_REGEX =
	/^https:\/\/.*?\/jira\/polaris\/projects\/[^\/]+?\/ideas\/view\/\d+$|^https:\/\/.*?\/secure\/JiraProductDiscoveryAnonymous\.jspa\?hash=\w+|^https:\/\/.*?\/jira\/polaris\/share\/\w+|^https:\/\/.*?\/jira\/discovery\/share\/views\/[\w-]+(\?selectedIssue=[\w-]+&issueViewLayout=sidebar&issueViewSection=[\w-]+)?$/;
const JWM_VIEW_REGEX =
	/^https:\/\/.*?\/jira\/core\/projects\/[^\/]+?\/(timeline|calendar|list|board|summary|(form\/[^\/]+?))\/?/;
const JIRA_LIST_REGEX = /^https:\/\/.*?\/jira\/software\/(c\/)?projects\/[^\/]+?\/list\/?/;
const GIPHY_MEDIA_REGEX = /^https:\/\/(.*?\.)?giphy\.com\/(gifs|media|clips)\//;
const PROFORMA_VIEW_REGEX =
	/^https:\/\/[^/]+\/jira\/(core|software(\/c)?|servicedesk)\/projects\/\w+\/forms\/form\/direct\/\d+\/\d+.*$/;
// prettier-ignore
// @ts-ignore - TS1503 TypeScript 5.9.2 upgrade
const CONFLUENCE_WHITEBOARD_DECIMAL_REGEX = /\/wiki\/spaces\/?.*\/whiteboard\/(?<resourceId>\d+)(\?\/)?/;
// prettier-ignore
// @ts-ignore - TS1503 TypeScript 5.9.2 upgrade
const CONFLUENCE_WHITEBOARD_UUID_REGEX = /\/wiki\/spaces\/?.*\/whiteboard\/(?<resourceId>[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12})(\?\/)?/;
const CONFLUENCE_DATABASE_REGEX = /\/wiki\/spaces\/~?[\d\w]+\/database\/\d+(\?.*)?$/;
const YOUTUBE_VIDEO_REGEX = /^https:\/\/(.*?\.)?(youtube\..*?\/(watch\?|v\/|shorts\/)|youtu\.be)/;
// prettier-ignore
// @ts-ignore - TS1503 TypeScript 5.9.2 upgrade
const LOOM_VIDEO_URL_REGEX = /^https:\/\/(.*?\.)?(loom\..*?\/(share|embed))\/([a-zA-Z0-9-]*-)?(?<videoId>[a-f0-9]{32})/;
// @ts-ignore - TS1503 TypeScript 5.9.2 upgrade
const LOOM_SCREENSHOT_URL_REGEX = /^https:\/\/(.*?\.)?loom\..*?\/i\/(?<id>[a-f0-9]{32})/;
const JIRA_DASHBOARD_REGEX = /^https:\/\/.*?\/jira\/dashboards\/[0-9]+.*/;
const JIRA_BACKLOG_REGEX =
	/https:\/\/.*?\/jira\/software\/(c\/)?projects\/[^\/]+?\/boards\/\d\/backlog\??.*/;
const JIRA_BOARD_REGEX = /https:\/\/.*?\/jira\/software\/(c\/)?projects\/[^\/]+?\/boards\/\d\??.*/;
// @ts-ignore - TS1503 TypeScript 5.9.2 upgrade
const JIRA_PLAN_REGEX = /https:\/\/.*?\/jira\/plans\/(?<resourceId>\d+)/;
// prettier-ignore
// @ts-ignore - TS1503 TypeScript 5.9.2 upgrade
const JIRA_PLAN_WITH_SCENARIO_REGEX = /https:\/\/.*?\/jira\/plans\/(?<resourceId>\d+)\/scenarios\/(?<resourceContext>\d+)\/(timeline|summary|calendar|program\/\d+|dependencies)\/?/;
const JIRA_VERSION_REGEX =
	/https:\/\/.*?\/projects\/[^\/]+?\/versions\/\d+\/tab\/release-report-all-issues/;
const JIRA_FORM_REGEX = /https:\/\/.*?\/jira\/software\/(c\/)?projects\/[^\/]+?\/form\/\d\??.*/;
const JIRA_SUMMARY_REGEX = /^https:\/\/.*?\/jira\/software\/(c\/)?projects\/[^\/]+?\/summary/;
const ROVO_AGENT_PROFILE_PAGE_REGEX = /^https:\/\/.*?\/people\/agent\/.+$/;
const CUSTOMER_360_LANDING_PAGE_REGEX = /^https:\/\/customer\.atlassian\.com\/.*$/;
// prettier-ignore
// @ts-ignore - TS1503 TypeScript 5.9.2 upgrade
const CONFLUENCE_TEAM_CALENDARS_REGEX = /\/wiki\/spaces\/(?<resourceContext>[^\/]+)\/calendars\/(?<resourceId>[a-zA-Z0-9-]+)/;
const JIRA_ISSUE_NAVIGATOR_REGEX =
	/^https:\/\/.*?\/jira\/software|core\/(c\/)?projects\/[^\/]+?\/issues\/?/;
const AVP_VISUALIZATION_VIEW_REGEX = /^https:\/\/.*?\/avpviz\/c\/[^\/]+.*/;
const JIRA_WORK_ITEM_REGEX = /\/browse\/((?:\w+)-(?:\d+))/i;
const DOES_URL_MATCH_PATH_START_REGEX = /^[a-zA-Z0-9]/;
const DOES_URL_MATCH_PATH_END_REGEX = /[a-zA-Z0-9]$/;
const CONFLUENCE_SHORT_LINK_URL_REGEX =
	/^https:\/\/[^/?#]+\/wiki\/x\/[A-Za-z0-9_-]+\/?(?:[?#].*)?$/;

const isConfluenceShortLinkUrl: UrlChecker = (url) => url.match(CONFLUENCE_SHORT_LINK_URL_REGEX);

const isJiraRoadmapOrTimeline: UrlChecker = (url) => url.match(JIRA_ROADMAP_OR_TIMELINE_REGEX);

const isPolarisView: UrlChecker = (url) => url.match(POLARIS_VIEW_REGEX);

const isJwmView: UrlChecker = (url) => url.match(JWM_VIEW_REGEX);

const isJiraList: UrlChecker = (url) => url.match(JIRA_LIST_REGEX);

const isGiphyMedia: UrlChecker = (url) => url.match(GIPHY_MEDIA_REGEX);

const isProformaView: UrlChecker = (url) => url.match(PROFORMA_VIEW_REGEX);

const isConfluenceWhiteboard: UrlChecker = (url) =>
	url.match(CONFLUENCE_WHITEBOARD_DECIMAL_REGEX) || url.match(CONFLUENCE_WHITEBOARD_UUID_REGEX);

const isConfluenceDatabase: UrlChecker = (url) => url.match(CONFLUENCE_DATABASE_REGEX);

const isYoutubeVideo: UrlChecker = (url) => url.match(YOUTUBE_VIDEO_REGEX);

const isLoomVideoUrl: UrlChecker = (url) => {
	return url.match(LOOM_VIDEO_URL_REGEX);
};

const isLoomScreenshotUrl: UrlChecker = (url) => {
	return url.match(LOOM_SCREENSHOT_URL_REGEX);
};

const isJiraDashboard: UrlChecker = (url) => {
	return url.match(JIRA_DASHBOARD_REGEX);
};

const isJiraBacklog: UrlChecker = (url) => {
	return url.match(JIRA_BACKLOG_REGEX);
};

const isJiraBoard: UrlChecker = (url) => {
	return url.match(JIRA_BOARD_REGEX);
};

const isJiraPlan: UrlChecker = (url) => {
	return url.match(JIRA_PLAN_REGEX) || url.match(JIRA_PLAN_WITH_SCENARIO_REGEX);
};

const isJiraVersion: UrlChecker = (url) => {
	return url.match(JIRA_VERSION_REGEX);
};

const isJiraForm: UrlChecker = (url) => {
	return url.match(JIRA_FORM_REGEX);
};

const isJiraSummary: UrlChecker = (url) => {
	return url.match(JIRA_SUMMARY_REGEX);
};

const isRovoAgentProfilePage: UrlChecker = (url) => {
	return url.match(ROVO_AGENT_PROFILE_PAGE_REGEX);
};

const isCustomer360LandingPage: UrlChecker = (url) => url.match(CUSTOMER_360_LANDING_PAGE_REGEX);

const isConfluenceTeamCalendars: UrlChecker = (url) => url.match(CONFLUENCE_TEAM_CALENDARS_REGEX);

const isJiraIssueNavigator: UrlChecker = (url) => url.match(JIRA_ISSUE_NAVIGATOR_REGEX);

const isAvpVisualizationView: UrlChecker = (url) => url.match(AVP_VISUALIZATION_VIEW_REGEX);

export const isJiraWorkItem = (url: string): boolean => JIRA_WORK_ITEM_REGEX.test(url);

// Local UrlChecker-compatible wrapper around the boolean-returning
// `isConfluenceSlideUrl` from `./url-checkers` (the single source of truth for
// slide URL matching). Wrapping (rather than aliasing the imported identifier
// directly inside the exported `internalUrlCheckers` object) avoids the
// @atlaskit/editor/no-re-export lint rule and gives the registry a uniform
// `(url) => RegExpMatchArray | null` signature. Consumers of
// `internalUrlCheckers` only check the truthiness of the result, so returning
// a synthetic single-element match array (or `null`) preserves behaviour.
const isConfluenceSlide: UrlChecker = (url) =>
	isConfluenceSlideUrl(url) ? ([url] as unknown as RegExpMatchArray) : null;

export const internalUrlCheckers: { [key: string]: UrlChecker } = {
	isJiraRoadmapOrTimeline,
	isPolarisView,
	isJwmView,
	isJiraList,
	isConfluenceWhiteboard,
	isConfluenceDatabase,
	isConfluenceSlide,
	isJiraDashboard,
	isJiraBacklog,
	isJiraBoard,
	isJiraPlan,
	isJiraVersion,
	isJiraForm,
	isJiraSummary,
	isRovoAgentProfilePage,
	isConfluenceTeamCalendars,
	isJiraIssueNavigator,
};

/**
 * Check if a URL is an internal Atlassian URL (Jira, Confluence, etc.)
 * by testing it against all known internal URL patterns
 */
export function isInternalUrl(url: string): boolean {
	return Object.values(internalUrlCheckers).some((checker) => checker(url));
}

/**
 * Check if a URL is external (not a known internal Atlassian URL)
 */
export function isExternalUrl(url: string): boolean {
	return !isInternalUrl(url);
}

type CardNode = InlineCardAdf | BlockCardAdf | EmbedCardAdf;
type SupportedUrlFilter = (url: string) => boolean;

function getAppearanceForNode(node: CardNode): CardAppearance {
	return node.type === 'blockCard' ? 'block' : node.type === 'embedCard' ? 'embed' : 'inline';
}

function isCardNode(node: JSONNode): node is CardNode {
	return (
		['inlineCard', 'blockCard', 'embedCard'].includes(node.type) &&
		!!node.attrs &&
		'url' in node.attrs &&
		typeof node.attrs.url === 'string'
	);
}

export class EditorCardProvider
	extends NodeDataProvider<CardNode, JsonLd.Response>
	implements CardProvider
{
	override readonly name: 'editorCardProvider' | string;
	private baseUrl: string;
	private resolverUrl: string;
	private providersData?: ProvidersData;
	private requestHeaders: HeadersInit;
	private transformer: Transformer;
	private providersLoader: DataLoader<string, ProvidersData | undefined>;
	private cardClient: CardClient;
	private smartCardLocalCacheClient: SmartCardLocalCacheClient =
		SmartCardLocalCacheClient.getInstance();
	private onResolve: ((url: string, ari: string) => void) | undefined;
	private supportedUrlFilter?: SupportedUrlFilter;

	constructor(
		envKey?: EnvironmentsKeys,
		baseUrlOverride?: string,
		product?: ProductType,
		onResolve?: (url: string) => void,
		customCardClient?: CardClient,
		supportedUrlFilter?: SupportedUrlFilter,
	) {
		super();
		this.name = 'editorCardProvider';
		this.baseUrl = baseUrlOverride || getBaseUrl(envKey);
		this.resolverUrl = getResolverUrl(envKey, baseUrlOverride);
		this.transformer = new Transformer();
		this.onResolve = onResolve;
		this.supportedUrlFilter = supportedUrlFilter;
		this.requestHeaders = {
			Origin: this.baseUrl,
		};
		this.providersLoader = new DataLoader((keys) => this.batchProviders(keys), {
			batchScheduleFn: (callback) => setTimeout(callback, BATCH_WAIT_TIME),
		});

		this.cardClient = customCardClient ?? new CardClient(envKey, baseUrlOverride);
		if (!customCardClient && product) {
			this.cardClient.setProduct(product);
		}
	}

	refreshCache(node: CardNode | PMNode): void {
		if (this.getCacheStatusForNode(node) !== 'network') {
			this.getData(node, () => {});
		}
	}

	override getData(
		node: CardNode | PMNode,
		callback: (payload: CallbackPayload<JsonLd.Response>) => void,
	): void {
		if (expValEquals('platform_editor_smartlink_local_cache', 'isEnabled', true) === false) {
			// if local cache feature flag is disabled, fall back to the base implementation
			return super.getData(node, callback);
		}

		const jsonNode: JSONNode = 'toJSON' in node ? node.toJSON() : node;
		if (!this.isNodeSupported(jsonNode)) {
			return;
		}

		// if we can load a response from cache, use it first
		const key = this.nodeDataKey(jsonNode);
		const details = this.smartCardLocalCacheClient.getItem(key);
		// NAVX-4712: Handle responses with non-resolved statuses that were previously cached
		const isResolvedCachedResponse = details && details.meta && getStatus(details) === 'resolved';
		if (isResolvedCachedResponse) {
			callback({ data: details });
		}

		// if parent class NodeDataProvider has cached the network request for the node
		// we can skip fetching the data async and updating the session storage cache
		if (isResolvedCachedResponse && this.getCacheStatusForNode(jsonNode) === 'network') {
			return;
		}

		// fetch the latest data async and update the session storage cache
		this.getDataAsync(node, (payload) => {
			const response: SmartLinkResponse | undefined = payload.data;
			if (!payload.error && response?.meta) {
				const status = getStatus(response);
				if (status === 'resolved') {
					this.smartCardLocalCacheClient.setItem(key, response);
				}
			}

			callback(payload);
		});
	}

	override nodeDataKey(node: CardNode): string {
		if (!fg('platform_smartlink_inline_resolve_optimization')) {
			return node.attrs.url;
		}

		return `${node.attrs.url}|${getAppearanceForNode(node)}`;
	}

	override fetchNodesData(nodes: CardNode[]): Promise<JsonLd.Response[]> {
		const promises = nodes.map((node) => {
			const url = node.attrs.url;
			const appearance = fg('platform_smartlink_inline_resolve_optimization')
				? getAppearanceForNode(node)
				: undefined;

			return this.cardClient.fetchData(url, false, appearance);
		});

		return Promise.all(promises);
	}

	override isNodeSupported(node: JSONNode): node is CardNode {
		if (!isCardNode(node)) {
			return false;
		}

		if (!this.supportedUrlFilter) {
			return true;
		}

		return this.supportedUrlFilter(node.attrs.url);
	}

	private async batchProviders(
		keys: ReadonlyArray<string>,
	): Promise<Array<ProvidersData | undefined>> {
		// EDM-2205: Batch requests in the case that user paste multiple links at
		// once. This is so that only one /providersData is being called.
		const providersData = await this.fetchProvidersData();
		return keys.map(() => providersData);
	}

	private async checkLinkResolved(resourceUrl: string): Promise<boolean | undefined> {
		try {
			const response = await this.fetchData(resourceUrl);

			if (getStatus(response) !== 'not_found') {
				return true;
			}
		} catch {
			return false;
		}
	}

	private async fetchDataForResource(
		resourceUrl: string,
	): Promise<JsonLd.Response<JsonLd.Data.BaseData> | undefined> {
		try {
			const response = await this.fetchData(resourceUrl);

			if (getStatus(response) !== 'not_found') {
				return response;
			}
		} catch {
			return undefined;
		}
	}

	private extractAriFromData(
		responseData: JsonLd.Response<JsonLd.Data.BaseData>,
	): string | undefined {
		if (responseData.data && 'atlassian:ari' in responseData.data) {
			return responseData.data['atlassian:ari'];
		}
		return undefined;
	}

	private async fetchProvidersData(): Promise<ProvidersData | undefined> {
		const endpoint = `${this.resolverUrl}/providers`;
		const response = await request<ORSProvidersResponse>(
			'post',
			endpoint,
			undefined,
			this.requestHeaders,
		);

		return {
			patterns: response.providers.reduce(
				(allSources: ProviderPattern[], provider: { patterns: ConcatArray<ProviderPattern> }) => {
					return allSources.concat(provider.patterns);
				},
				[],
			),
			userPreferences: response.userPreferences,
		};
	}

	private async loadProviderData() {
		try {
			this.providersData = await this.providersLoader.load('providersData');
		} catch (err) {
			// eslint-disable-next-line
			console.error('failed to fetch /providers', err);
			this.providersLoader.clear('providerData');
			return undefined;
		}
	}

	async findPattern(url: string): Promise<boolean> {
		return !!(await this.findPatternData(url)) || !!(await this.checkLinkResolved(url));
	}

	private doesUrlMatchPath(path: string, url: string) {
		// Using [a-zA-Z0-9] here instead of \w since that includes underscores
		const startingRegex = DOES_URL_MATCH_PATH_START_REGEX.test(path) ? '(^|[^a-zA-Z0-9])' : '';
		const endingRegex = DOES_URL_MATCH_PATH_END_REGEX.test(path) ? '($|[^a-zA-Z0-9])' : '';

		const escapedPath = path.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
		const regexPattern = new RegExp(`${startingRegex}${escapedPath}${endingRegex}`);
		return regexPattern.test(url);
	}

	private async findUserPreference(url: string): Promise<LinkAppearance | undefined> {
		if (!this.providersData) {
			await this.loadProviderData();
		}

		const userPreferences = this.providersData?.userPreferences;
		if (userPreferences) {
			const { defaultAppearance, appearances } = userPreferences;
			const allMatchedLabeledAppearances = appearances.filter(({ urlSegment }) =>
				this.doesUrlMatchPath(urlSegment, url),
			);

			if (allMatchedLabeledAppearances.length > 0) {
				const longestMatchedLabeledAppearance = allMatchedLabeledAppearances.reduce(
					(previousLabeledAppearance, currentLabeledAppearance) =>
						previousLabeledAppearance.urlSegment.length > currentLabeledAppearance.urlSegment.length
							? previousLabeledAppearance
							: currentLabeledAppearance,
				);
				return longestMatchedLabeledAppearance.appearance;
			}

			if (defaultAppearance !== 'inline') {
				return defaultAppearance;
			}
		}
	}

	private async findPatternData(url: string): Promise<ProviderPattern | undefined> {
		if (!this.providersData) {
			await this.loadProviderData();
		}
		return this.providersData?.patterns.find((pattern) => url.match(pattern.source));
	}

	/**
	 *
	 * Decides whether the url passed in should be embedded by default
	 *
	 * protected so that subclasses can override this in order to custom handle links embedded by default
	 *
	 * @param url
	 * @returns 'embed' for the card appearance to embed by default
	 */
	protected getHardCodedAppearance(url: string): CardAppearance | undefined {
		// Replace directly with isJiraPlan(url) on cleanup
		const isJiraPlanEvaluated = isJiraPlan(url);

		const isJiraFormEvaluated = isJiraForm(url);

		const isJiraSummaryEvaluated = isJiraSummary(url);

		let isConfluenceTeamCalendarsEvaluated;
		if (fg('tc_smart_link_embed_view')) {
			isConfluenceTeamCalendarsEvaluated = isConfluenceTeamCalendars(url);
		}

		if (
			isJiraRoadmapOrTimeline(url) ||
			isPolarisView(url) ||
			isJwmView(url) ||
			isJiraList(url) ||
			isGiphyMedia(url) ||
			isProformaView(url) ||
			isConfluenceWhiteboard(url) ||
			isConfluenceDatabase(url) ||
			isConfluenceSlideUrl(url) ||
			isYoutubeVideo(url) ||
			isLoomVideoUrl(url) ||
			(isLoomScreenshotUrl(url) && fg('loom-support-screenshot-sl-resolution')) ||
			isJiraDashboard(url) ||
			isJiraBacklog(url) ||
			isJiraBoard(url) ||
			isRovoAgentProfilePage(url) ||
			isJiraVersion(url) ||
			isJiraPlanEvaluated ||
			isJiraFormEvaluated ||
			isJiraSummaryEvaluated ||
			isCustomer360LandingPage(url) ||
			isConfluenceTeamCalendarsEvaluated ||
			isJiraIssueNavigator(url) ||
			(isAvpVisualizationView(url) && fg('avp_unfurl_shared_charts_embed_by_default_2'))
		) {
			return 'embed';
		}
	}

	private async fetchData(url: string) {
		// it uses fetchNodesData internally and caches the result
		return await this.getDataAsPromise_DO_NOT_USE_OUTSIDE_MIGRATIONS({
			// It's ok to cast any resourceUrl to inlineCard here, because only URL is important for the request.
			type: 'inlineCard',
			attrs: { url },
		});
	}

	private async resolvesToHardCodedEmbed(url: string): Promise<boolean> {
		try {
			const response = await this.fetchData(url);
			const resolvedUrl = extractSmartLinkUrl(response as SmartLinkResponse);

			return resolvedUrl !== undefined && this.getHardCodedAppearance(resolvedUrl) === 'embed';
		} catch {
			return false;
		}
	}

	/**
	 * Make a /resolve call and find out if result has embed capability
	 */
	private async canBeResolvedAsEmbed(url: string) {
		try {
			const details = await this.fetchData(url);

			if (!details) {
				return false;
			}

			// Imagine response is "unauthorized". We won't be able to tell if even after auth
			// page going to have preview. Yes, we can show auth view for embed. But what if even after
			// success auth flow there won't be preview? We will already have ugly embed ADF.
			// Being on a safe side - if we get anything but resolved - we decide it can't be an embed.
			if (getStatus(details) !== 'resolved') {
				return false;
			}

			const embed = extractSmartLinkEmbed(details);
			return !!embed;
		} catch {
			return false;
		}
	}

	/**
	 * Opt-in hook: when a caller explicitly requests an `'embed'` appearance and the
	 * user has no saved preference for the URL, honour that request as the default
	 * (above any provider default), validating embeddability first and falling back
	 * to a card (`'block'`) when the link cannot be embedded.
	 *
	 * Defaults to `false` so behaviour is unchanged for every existing consumer.
	 * Subclasses (e.g. Confluence) can override this to opt in, typically behind an
	 * experiment.
	 */
	protected shouldHonorRequestedEmbedAsDefault(): boolean {
		return false;
	}

	private async getAuthStatusFromResolveResponse(
		url: string,
	): Promise<Pick<JsonLd.Meta.BaseMeta, 'access' | 'visibility'> | undefined> {
		try {
			const {
				meta: { access, visibility },
			}: JsonLdDatasourceResponse = await this.fetchData(url);
			return {
				access,
				visibility,
			};
		} catch {
			return undefined;
		}
	}

	/**
	 * Make a /resolve call and find out if result has datasource capability
	 */
	private async getDatasourceFromResolveResponse(url: string) {
		try {
			const response = await this.fetchData(url);

			const datasources = (response && (response as JsonLdDatasourceResponse).datasources) || [];
			if (datasources.length > 0) {
				// For now we only have one datasource expected even though it is in an array.
				// When we have resources returning more than one we will have revisit this part.
				return datasources[0];
			}
		} catch {
			return undefined;
		}
	}

	/**
	 * This is used to determine if the url is a local Jira url or a remote one.
	 */
	private isLocalUrl(url: string): boolean {
		return new URL(url).origin === this.baseUrl;
	}

	async resolve(
		url: string,
		appearance: CardAppearance,
		shouldForceAppearance?: boolean,
		isEmbedFriendlyLocation?: boolean,
	): Promise<CardAdf | DatasourceAdf> {
		try {
			if (shouldForceAppearance === true) {
				// At this point we don't need to check pattern nor call `check` because manual change means
				// this url is already supported and can be resolved. We want to ignore all other options and
				// respect user's choice.
				return this.transformer.toSmartlinkAdf(url, appearance);
			}

			const hardCodedAppearance = this.getHardCodedAppearance(url);
			const [matchedProviderPattern, userPreference] = await Promise.all([
				this.findPatternData(url),
				this.findUserPreference(url),
			]);

			if (fg('issue-link-suggestions-in-comments')) {
				if (isJiraWorkItem(url) && this.isLocalUrl(url)) {
					const data = await this.fetchDataForResource(url);
					if (data) {
						const issueAri = this.extractAriFromData(data);
						if (issueAri) {
							this.onResolve?.(url, issueAri);
						}
					}
				}
			}

			if (shouldForceAppearance === false && userPreference === 'url') {
				return Promise.reject(undefined);
			}

			const isSupported = !!matchedProviderPattern || (await this.checkLinkResolved(url));
			if (isSupported) {
				const providerDefaultAppearance = matchedProviderPattern?.defaultView;

				const isEmbedFriendlyLocationEvaluated =
					isEmbedFriendlyLocation || isEmbedFriendlyLocation === undefined;

				let preferredAppearance =
					shouldForceAppearance === undefined
						? // Ignore both User and provider's appearances if older editor that doesn't send shouldForceAppearance
							hardCodedAppearance || appearance
						: // User preferred appearance. It would be either one that has matching domain/path pattern OR
							// if user's default choice is NOT "inline" (so, block or embed at this point, url was dealt with above)
							(userPreference as CardAppearance) ||
							// If user's default choice is "inline" or user hasn't specified preferences at all,
							// we check whatever one of the hardcoded providers match url (jira /timeline, polaris, etc)
							(isEmbedFriendlyLocationEvaluated && hardCodedAppearance) ||
							// If non match, we see if this provider has default appearance for this particular regexp
							providerDefaultAppearance ||
							// If not, we pick what editor (or any other client) requested
							appearance;

				const isNativeEmbedShortlinkResolutionEnabled = fg(
					'platform_native_embeds_enable_shortlink_resolution',
				);

				const shouldResolveShortLinkForEmbed =
					isNativeEmbedShortlinkResolutionEnabled &&
					matchedProviderPattern !== undefined &&
					isConfluenceShortLinkUrl(url) &&
					userPreference === undefined &&
					isEmbedFriendlyLocationEvaluated;

				// Confluence shortlinks do not identify their content type. Resolve the URL before
				// deciding whether it should use one of the existing hardcoded embed appearances.
				if (shouldResolveShortLinkForEmbed && (await this.resolvesToHardCodedEmbed(url))) {
					preferredAppearance = 'embed';
				}

				if (preferredAppearance === userPreference && userPreference === 'embed') {
					const canItBeEmbed = await this.canBeResolvedAsEmbed(url);
					if (!canItBeEmbed) {
						preferredAppearance = 'inline';
					}
				}

				// When a caller explicitly requested an embed (e.g. Confluence's quick-insert
				// embed flow tags the inserted link) and the user has no saved preference for
				// this URL, honour embed-by-default above the provider default — but only in an
				// embed-friendly location (matching how hard-coded embeds are gated above) and
				// only when the link can actually be embedded, otherwise fall back to a card.
				// Gated behind a default-off opt-in hook so other consumers are unaffected.
				if (
					!userPreference &&
					appearance === 'embed' &&
					isEmbedFriendlyLocationEvaluated &&
					this.shouldHonorRequestedEmbedAsDefault()
				) {
					const canItBeEmbed = await this.canBeResolvedAsEmbed(url);
					preferredAppearance = canItBeEmbed ? 'embed' : 'block';
				}

				const datasource = await this.getDatasourceFromResolveResponse(url);
				if (datasource) {
					const { id, parameters } = datasource;
					return this.transformer.toDatasourceAdf(
						{
							id,
							parameters,
							// in the future when we support multiple views, we will need to pass this in as a parameter
							// transform toDatasourceAdf to accept multiple views (like how how appearance for other other transforms are handled)
							views: [{ type: 'table' }],
						},
						url,
					);
				}

				if (isEmbedFriendlyLocationEvaluated && !userPreference) {
					const authStatus = await this.getAuthStatusFromResolveResponse(url);
					if (authStatus) {
						const { access } = authStatus;
						if (access === 'unauthorized') {
							return this.transformer.toSmartlinkAdf(url, 'block');
						}
					}
				}

				return this.transformer.toSmartlinkAdf(url, preferredAppearance);
			}
		} catch (e) {
			// eslint-disable-next-line
			console.warn(
				`Error when trying to check Smart Card url "${url}"${
					e instanceof Error ? ` - ${e.name} ${e.message}` : ''
				}`,
				e,
			);
		}

		return Promise.reject(undefined);
	}
}

export const editorCardProvider: EditorCardProvider = new EditorCardProvider();
// eslint-disable-next-line @atlaskit/editor/no-re-export
export type { CardProvider } from './types';

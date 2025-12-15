/* eslint-disable require-unicode-regexp,prefer-regex-literals */
import type { JSONNode } from '@atlaskit/editor-json-transformer';
import { extractSmartLinkEmbed } from '@atlaskit/link-extractors';
import { NodeDataProvider } from '@atlaskit/node-data-provider';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import {
	type BlockCardAdf,
	type EmbedCardAdf,
	type CardAdf,
	type InlineCardAdf,
	type CardAppearance,
	type DatasourceAdf,
	getStatus,
	type ProductType,
	type EnvironmentsKeys,
	getBaseUrl,
	getResolverUrl,
} from '@atlaskit/linking-common';
import DataLoader from 'dataloader';
import { Transformer } from './transformer';
import {
	type CardProvider,
	type LinkAppearance,
	type ORSProvidersResponse,
	type ProviderPattern,
	type ProvidersData,
} from './types';
import { type JsonLdDatasourceResponse } from '@atlaskit/link-client-extension';
import { CardClient } from '@atlaskit/link-provider';
import { type JsonLd } from '@atlaskit/json-ld-types';
import { fg } from '@atlaskit/platform-feature-flags';
import { request } from './api';

const BATCH_WAIT_TIME = 50;

// Check if it is matching a Jira Roadmaps or Jira Timeline url
// NOT to be confused with JSM timeline
const isJiraRoadmapOrTimeline = (url: string) =>
	url.match(
		/^https:\/\/.*?\/jira\/software\/(c\/)?projects\/[^\/]+?\/boards\/.*?\/(timeline|roadmap)\/?/,
	);

const isPolarisView = (url: string) =>
	url.match(
		/^https:\/\/.*?\/jira\/polaris\/projects\/[^\/]+?\/ideas\/view\/\d+$|^https:\/\/.*?\/secure\/JiraProductDiscoveryAnonymous\.jspa\?hash=\w+|^https:\/\/.*?\/jira\/polaris\/share\/\w+|^https:\/\/.*?\/jira\/discovery\/share\/views\/[\w-]+(\?selectedIssue=[\w-]+&issueViewLayout=sidebar&issueViewSection=[\w-]+)?$/,
	);

const isJwmView = (url: string) =>
	url.match(
		/^https:\/\/.*?\/jira\/core\/projects\/[^\/]+?\/(timeline|calendar|list|board|summary|(form\/[^\/]+?))\/?/,
	);

const isJiraList = (url: string) =>
	url.match(/^https:\/\/.*?\/jira\/software\/(c\/)?projects\/[^\/]+?\/list\/?/);

const isGiphyMedia = (url: string) =>
	url.match(/^https:\/\/(.*?\.)?giphy\.com\/(gifs|media|clips)\//);

const isProformaView = (url: string) =>
	url.match(
		/^https:\/\/[^/]+\/jira\/(core|software(\/c)?|servicedesk)\/projects\/\w+\/forms\/form\/direct\/\d+\/\d+.*$/,
	);

const isConfluenceWhiteboard = (url: string) =>
	// @ts-ignore - TS1503 TypeScript 5.9.2 upgrade
	url.match(/\/wiki\/spaces\/?.*\/whiteboard\/(?<resourceId>\d+)(\?\/)?/) ||
	url.match(
		// @ts-ignore - TS1503 TypeScript 5.9.2 upgrade
		/\/wiki\/spaces\/?.*\/whiteboard\/(?<resourceId>[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12})(\?\/)?/,
	);

const isConfluenceDatabase = (url: string) =>
	url.match(/\/wiki\/spaces\/~?[\d\w]+\/database\/\d+(\?.*)?$/);

const isYoutubeVideo = (url: string) =>
	url.match(/^https:\/\/(.*?\.)?(youtube\..*?\/(watch\?|v\/|shorts\/)|youtu\.be)/);

const isLoomUrl = (url: string) => {
	return url.match(
		// @ts-ignore - TS1503 TypeScript 5.9.2 upgrade
		/^https:\/\/(.*?\.)?(loom\..*?\/(share|embed))\/([a-zA-Z0-9-]*-)?(?<videoId>[a-f0-9]{32})/,
	);
};

const isJiraDashboard = (url: string) => {
	return url.match(/^https:\/\/.*?\/jira\/dashboards\/[0-9]+.*/);
};

const isJiraBacklog = (url: string) => {
	return url.match(
		/https:\/\/.*?\/jira\/software\/(c\/)?projects\/[^\/]+?\/boards\/\d\/backlog\??.*/,
	);
};

const isJiraBoard = (url: string) => {
	return url.match(/https:\/\/.*?\/jira\/software\/(c\/)?projects\/[^\/]+?\/boards\/\d\??.*/);
};

const isJiraPlan = (url: string) => {
	return (
		// @ts-ignore - TS1503 TypeScript 5.9.2 upgrade
		url.match(/https:\/\/.*?\/jira\/plans\/(?<resourceId>\d+)/) ||
		url.match(
			// @ts-ignore - TS1503 TypeScript 5.9.2 upgrade
			/https:\/\/.*?\/jira\/plans\/(?<resourceId>\d+)\/scenarios\/(?<resourceContext>\d+)\/(timeline|summary|calendar|program\/\d+|dependencies)\/?/,
		)
	);
};

const isJiraVersion = (url: string) => {
	return url.match(
		/https:\/\/.*?\/projects\/[^\/]+?\/versions\/\d+\/tab\/release-report-all-issues/,
	);
};

const isJiraForm = (url: string) => {
	return url.match(/https:\/\/.*?\/jira\/software\/(c\/)?projects\/[^\/]+?\/form\/\d\??.*/);
};

const isJiraSummary = (url: string) => {
	return url.match(/^https:\/\/.*?\/jira\/software\/(c\/)?projects\/[^\/]+?\/summary/);
};

const isRovoAgentProfilePage = (url: string) => {
	return url.match(/^https:\/\/.*?\/people\/agent\/.+$/);
};

const isCustomer360LandingPage = (url: string) =>
	url.match(/^https:\/\/customer\.atlassian\.com\/.*$/);

const isConfluenceTeamCalendars = (url: string) =>
	// @ts-ignore - TS1503 TypeScript 5.9.2 upgrade
	url.match(/\/wiki\/spaces\/(?<resourceContext>[^\/]+)\/calendars\/(?<resourceId>[a-zA-Z0-9-]+)/);

const isJiraIssueNavigator = (url: string) =>
	url.match(/^https:\/\/.*?\/jira\/software|core\/(c\/)?projects\/[^\/]+?\/issues\/?/);

const isAvpVisualizationView = (url: string) => url.match(/^https:\/\/.*?\/avpviz\/c\/[^\/]+.*/);

export const isJiraWorkItem = (url: string): boolean => /\/browse\/((?:\w+)-(?:\d+))/i.test(url);

type CardNode = InlineCardAdf | BlockCardAdf | EmbedCardAdf;

export class EditorCardProvider
	extends NodeDataProvider<CardNode, JsonLd.Response>
	implements CardProvider
{
	override readonly name: 'editorCardProvider';
	private baseUrl: string;
	private resolverUrl: string;
	private providersData?: ProvidersData;
	private requestHeaders: HeadersInit;
	private transformer: Transformer;
	private providersLoader: DataLoader<string, ProvidersData | undefined>;
	private cardClient: CardClient;
	private onResolve: ((url: string, ari: string) => void) | undefined;

	constructor(
		envKey?: EnvironmentsKeys,
		baseUrlOverride?: string,
		product?: ProductType,
		onResolve?: (url: string) => void,
		customCardClient?: CardClient,
	) {
		super();
		this.name = 'editorCardProvider';
		this.baseUrl = baseUrlOverride || getBaseUrl(envKey);
		this.resolverUrl = getResolverUrl(envKey, baseUrlOverride);
		this.transformer = new Transformer();
		this.onResolve = onResolve;
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

	override nodeDataKey(node: CardNode): string {
		// We can use URL as a key here, because CardClient returns the same data for the same URL
		// regardless of the type of card (inline, block, embed).
		return node.attrs.url;
	}

	override fetchNodesData(nodes: CardNode[]): Promise<JsonLd.Response[]> {
		const promises = nodes.map((node) => {
			const url = node.attrs.url;

			return this.cardClient.fetchData(url);
		});

		return Promise.all(promises);
	}

	override isNodeSupported(node: JSONNode): node is CardNode {
		return (
			['inlineCard', 'blockCard', 'embedCard'].includes(node.type) &&
			!!node.attrs &&
			'url' in node.attrs &&
			typeof node.attrs.url === 'string'
		);
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
		const startingRegex = new RegExp(/^[a-zA-Z0-9]/).test(path) ? '(^|[^a-zA-Z0-9])' : '';
		const endingRegex = new RegExp(/[a-zA-Z0-9]$/).test(path) ? '($|[^a-zA-Z0-9])' : '';

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
			isYoutubeVideo(url) ||
			isLoomUrl(url) ||
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
		return expValEquals('platform_editor_smart_card_otp', 'isEnabled', true)
			? // It's ok to cast any resourceUrl to inlineCard here, because only URL is important for the request.
				await this.getDataAsPromise_DO_NOT_USE_OUTSIDE_MIGRATIONS({
					type: 'inlineCard',
					attrs: { url },
				})
			: await this.cardClient.fetchData(url);
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

				if (preferredAppearance === userPreference && userPreference === 'embed') {
					const canItBeEmbed = await this.canBeResolvedAsEmbed(url);
					if (!canItBeEmbed) {
						preferredAppearance = 'inline';
					}
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

				if (
					isEmbedFriendlyLocationEvaluated &&
					!userPreference &&
					fg('platform_sl_3p_unauth_paste_as_block_card_gate')
				) {
					const authStatus = await this.getAuthStatusFromResolveResponse(url);
					if (authStatus) {
						const { access } = authStatus;
						if (access === 'unauthorized') {
							const isUnauthPasteAsBlockCardEnabled = !expValEquals(
								'platform_sl_3p_unauth_paste_as_block_card',
								'cohort',
								'control',
								'control',
							);

							if (isUnauthPasteAsBlockCardEnabled) {
								return this.transformer.toSmartlinkAdf(url, 'block');
							}
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

export const editorCardProvider = new EditorCardProvider();
// eslint-disable-next-line @atlaskit/editor/no-re-export
export type { CardProvider } from './types';

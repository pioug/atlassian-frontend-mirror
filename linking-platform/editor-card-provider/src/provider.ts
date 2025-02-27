import { extractPreview } from '@atlaskit/link-extractors';
import {
	type CardAdf,
	type CardAppearance,
	type DatasourceAdf,
	getStatus,
	type ProductType,
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
import FeatureGates from '@atlaskit/feature-gate-js-client';
import { type JsonLdDatasourceResponse } from '@atlaskit/link-client-extension';
import { CardClient } from '@atlaskit/link-provider';
import { type EnvironmentsKeys, getBaseUrl, getResolverUrl } from '@atlaskit/linking-common';
import { fg } from '@atlaskit/platform-feature-flags';
import { type JsonLd } from 'json-ld-types';
import * as api from './api';

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
	url.match(/\/wiki\/spaces\/?.*\/whiteboard\/(?<resourceId>\d+)(\?\/)?/) ||
	url.match(
		/\/wiki\/spaces\/?.*\/whiteboard\/(?<resourceId>[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12})(\?\/)?/,
	);

const isConfluenceDatabase = (url: string) =>
	url.match(/\/wiki\/spaces\/~?[\d\w]+\/database\/\d+(\?.*)?$/);

const isYoutubeVideo = (url: string) =>
	url.match(/^https:\/\/(.*?\.)?(youtube\..*?\/(watch\?|v\/|shorts\/)|youtu\.be)/);

const isLoomUrl = (url: string) => {
	return url.match(
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
	return url.match(
		/https:\/\/.*?\/jira\/plans\/(?<resourceId>\d+)\/scenarios\/(?<resourceContext>\d+)\/(timeline|summary|calendar|program\/\d+|dependencies)\/?/,
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
	if (fg('rovo_agent_profile_page_default_embed')) {
		return url.match(/^https:\/\/.*?\/people\/agent\/.+$/);
	}
	return false;
};

const isCustomer360LandingPage = (url: string) => {
	return url.match(/^https:\/\/customer\.atlassian\.com\/.*$/);
};

export class EditorCardProvider implements CardProvider {
	private baseUrl: string;
	private resolverUrl: string;
	private providersData?: ProvidersData;
	private requestHeaders: HeadersInit;
	private transformer: Transformer;
	private providersLoader: DataLoader<string, ProvidersData | undefined>;
	private cardClient: CardClient;

	constructor(envKey?: EnvironmentsKeys, baseUrlOverride?: string, product?: ProductType) {
		this.baseUrl = baseUrlOverride || getBaseUrl(envKey);
		this.resolverUrl = getResolverUrl(envKey, baseUrlOverride);
		this.transformer = new Transformer();
		this.requestHeaders = {
			Origin: this.baseUrl,
		};
		this.providersLoader = new DataLoader((keys) => this.batchProviders(keys), {
			batchScheduleFn: (callback) => setTimeout(callback, BATCH_WAIT_TIME),
		});

		this.cardClient = new CardClient(envKey, baseUrlOverride);
		if (product) {
			this.cardClient.setProduct(product);
		}
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
			const response = await this.cardClient.fetchData(resourceUrl);
			if (getStatus(response) !== 'not_found') {
				return true;
			}
		} catch (e) {
			return false;
		}
	}

	private async fetchProvidersData(): Promise<ProvidersData | undefined> {
		const endpoint = `${this.resolverUrl}/providers`;
		const response = await api.request<ORSProvidersResponse>(
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
		let isJiraPlanEvaluated;
		if (fg('smart_links_for_plans_platform')) {
			isJiraPlanEvaluated = isJiraPlan(url);
		}

		let isJiraFormEvaluated;
		if (fg('smartlink_jira_software_form')) {
			isJiraFormEvaluated = isJiraForm(url);
		}

		let isJiraSummaryEvaluated;
		if (
			this.getExperimentValue('jsw-summary-page-embed-smart-link-experiment', 'isEnabled', false)
		) {
			isJiraSummaryEvaluated = isJiraSummary(url);
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
			isCustomer360LandingPage(url)
		) {
			return 'embed';
		}
	}

	private getExperimentValue = <T>(
		experimentName: string,
		parameterName: string,
		defaultValue: T,
	) => {
		try {
			return FeatureGates.getExperimentValue(experimentName, parameterName, defaultValue);
		} catch {
			return defaultValue;
		}
	};

	/**
	 * Make a /resolve call and find out if result has embed capability
	 */
	private async canBeResolvedAsEmbed(url: string) {
		try {
			const details = await this.cardClient.fetchData(url);
			const data = (details && details.data) as JsonLd.Data.BaseData;
			if (!data) {
				return false;
			}
			// Imagine response is "unauthorized". We won't be able to tell if even after auth
			// page going to have preview. Yes, we can show auth view for embed. But what if even after
			// success auth flow there won't be preview? We will already have ugly embed ADF.
			// Being on a safe side - if we get anything but resolved - we decide it can't be an embed.
			if (getStatus(details) !== 'resolved') {
				return false;
			}
			const preview = extractPreview(data, 'web');
			return !!preview;
		} catch (e) {
			return false;
		}
	}

	/**
	 * Make a /resolve call and find out if result has datasource capability
	 */
	private async getDatasourceFromResolveResponse(url: string) {
		try {
			const response = await this.cardClient.fetchData(url);
			const datasources = (response && (response as JsonLdDatasourceResponse).datasources) || [];
			if (datasources.length > 0) {
				// For now we only have one datasource expected even though it is in an array.
				// When we have resources returning more than one we will have revisit this part.
				return datasources[0];
			}
		} catch (e) {
			return undefined;
		}
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

			if (shouldForceAppearance === false && userPreference === 'url') {
				return Promise.reject(undefined);
			}

			let isSupported = !!matchedProviderPattern || (await this.checkLinkResolved(url));
			if (isSupported) {
				const providerDefaultAppearance = matchedProviderPattern?.defaultView;

				let preferredAppearance =
					shouldForceAppearance === undefined
						? // Ignore both User and provider's appearances if older editor that doesn't send shouldForceAppearance
							hardCodedAppearance || appearance
						: // User preferred appearance. It would be either one that has matching domain/path pattern OR
							// if user's default choice is NOT "inline" (so, block or embed at this point, url was dealt with above)
							(userPreference as CardAppearance) ||
							// If user's default choice is "inline" or user hasn't specified preferences at all,
							// we check whatever one of the hardcoded providers match url (jira /timeline, polaris, etc)
							((isEmbedFriendlyLocation || isEmbedFriendlyLocation === undefined) &&
								hardCodedAppearance) ||
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
export type { CardProvider } from './types';

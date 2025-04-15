// WARNING!!!
// Editor Card Provider has been moved to the @atlaskit/editor-card-provider package.
// If you are going to make changes here, be aware that this folder and instance
// of Editor Card Provider will be removed.
// For more information see:
// https://hello.atlassian.net/browse/ENGHEALTH-661
// and
// https://product-fabric.atlassian.net/browse/EDM-5755

import DataLoader from 'dataloader';
import {
	type CardAdf,
	type CardAppearance,
	getBaseUrl,
	getResolverUrl,
	type EnvironmentsKeys,
	request,
	getStatus,
} from '@atlaskit/linking-common';

import { extractPreview, extractSmartLinkEmbed } from '@atlaskit/link-extractors';
import { fg } from '@atlaskit/platform-feature-flags';

import {
	type CardProvider,
	type LinkAppearance,
	type ORSProvidersResponse,
	type ProviderPattern,
	type ProvidersData,
} from './types';
import { Transformer } from './transformer';

import CardClient from '../client';
import { type JsonLd } from '@atlaskit/json-ld-types';

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

const isGiphyMedia = (url: string) =>
	url.match(/^https:\/\/(.*?\.)?giphy\.com\/(gifs|media|clips)\//);

const isProformaView = (url: string) =>
	url.match(
		/^https:\/\/[^/]+\/jira\/(core|software(\/c)?|servicedesk)\/projects\/\w+\/forms\/form\/direct\/\d+\/\d+.*$/,
	);

/** @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-661 Internal documentation for deprecation (no external access)} */
export class EditorCardProvider implements CardProvider {
	private baseUrl: string;
	private resolverUrl: string;
	private providersData?: ProvidersData;
	private requestHeaders: HeadersInit;
	private transformer: Transformer;
	private providersLoader: DataLoader<string, ProvidersData | undefined>;
	private cardClient: CardClient;

	constructor(envKey?: EnvironmentsKeys, baseUrlOverride?: string) {
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
	}

	private async batchProviders(
		keys: ReadonlyArray<string>,
	): Promise<Array<ProvidersData | undefined>> {
		// EDM-2205: Batch requests in the case that user paste multiple links at
		// once. This is so that only one /providersData is being called.
		const providersData = await this.fetchProvidersData();
		return keys.map(() => providersData);
	}

	private async check(resourceUrl: string): Promise<boolean | undefined> {
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
		const response = await request<ORSProvidersResponse>(
			'post',
			endpoint,
			undefined,
			this.requestHeaders,
		);

		return {
			patterns: response.providers.reduce((allSources: ProviderPattern[], provider) => {
				return allSources.concat(provider.patterns);
			}, []),
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
		return !!(await this.findPatternData(url)) || !!(await this.check(url));
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

	private getHardCodedAppearance(url: string): CardAppearance | undefined {
		if (
			isJiraRoadmapOrTimeline(url) ||
			isPolarisView(url) ||
			isJwmView(url) ||
			isGiphyMedia(url) ||
			isProformaView(url)
		) {
			return 'embed';
		}
	}

	/**
	 * Make a /resolve call and find out if result has embed capability
	 * @param url
	 * @private
	 */
	private async canBeResolvedAsEmbed(url: string) {
		try {
			const details = await this.cardClient.fetchData(url);
			// Noun entities supported
			if (fg('smart_links_noun_support')) {
				if (!details) {
					return false;
				}
				const embed = extractSmartLinkEmbed(details);
				return !!embed;
			}

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

	async resolve(
		url: string,
		appearance: CardAppearance,
		shouldForceAppearance?: boolean,
	): Promise<CardAdf> {
		try {
			if (shouldForceAppearance === true) {
				// At this point we don't need to check pattern nor call `check` because manual change means
				// this url is already supported and can be resolved. We want to ignore all other options and
				// respect user's choice.
				return this.transformer.toAdf(url, appearance);
			}

			const hardCodedAppearance = this.getHardCodedAppearance(url);
			const [matchedProviderPattern, userPreference] = await Promise.all([
				this.findPatternData(url),
				this.findUserPreference(url),
			]);

			if (shouldForceAppearance === false && userPreference === 'url') {
				return Promise.reject(undefined);
			}

			let isSupported = !!matchedProviderPattern || (await this.check(url));
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
							// we check whatever one of the hardcoded providers match url (jira roadmap/timeline, polaris, etc)
							hardCodedAppearance ||
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

				return this.transformer.toAdf(url, preferredAppearance);
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

/** @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-661 Internal documentation for deprecation (no external access)} */
export const editorCardProvider = new EditorCardProvider();
export type { CardProvider, ORSCheckResponse } from './types';

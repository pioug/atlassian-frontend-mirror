import {
	AbstractResource,
	type OnProviderChange,
	type ServiceConfig,
	utils as serviceUtils,
} from '@atlaskit/util-service-support';
import type { CategoryId } from '../components/picker/categories';
import {
	SAMPLING_RATE_EMOJI_RESOURCE_FETCHED_EXP,
	selectedToneStorageKey,
} from '../util/constants';
import debug from '../util/logger';
import { isMediaEmoji, isPromise, toEmojiId } from '../util/type-helpers';
import storageAvailable from '../util/storage-available';
import {
	type EmojiDescription,
	type EmojiId,
	type EmojiProvider,
	type EmojiResponse,
	type EmojiSearchResult,
	type EmojiUpload,
	type ImageRepresentation,
	type OptionalEmojiDescription,
	type OptionalEmojiDescriptionWithVariations,
	type OptionalUser,
	ProviderTypes,
	type SearchOptions,
	type ToneSelection,
	type UploadingEmojiProvider,
	type User,
} from '../types';
import EmojiLoader from './EmojiLoader';
import EmojiRepository from './EmojiRepository';
import SiteEmojiResource from './media/SiteEmojiResource';
import type {
	EmojiLoaderConfig,
	OptimisticImageApiLoaderConfig,
	Options,
	SingleEmojiApiLoaderConfig,
	EmojiLoadSuccessCallback,
	EmojiLoadFailCallback,
} from './EmojiUtils';
import { sampledUfoEmojiResourceFetched, ufoExperiences } from '../util/analytics/ufoExperiences';
import { promiseWithTimeout } from '../util/timed-promise';

interface GetEmojiProviderOptions {
	/**
	 * Whether fetch emoji provider at start
	 * @defaultValue true
	 */
	fetchAtStart?: boolean;
}

export type { EmojiProvider, UploadingEmojiProvider } from '../types'; // Re-exporting to not cause a breaking change
// Re-exporting to not cause a breaking change

export interface EmojiResourceConfig {
	/**
	 * Must be set to true to enable upload support in the emoji components.
	 *
	 * Can be used for the restriction of the upload UI based on permissions, or feature flags.
	 *
	 * Note this also requires that other conditions are met (for example, one of the providers
	 * must support upload for the UploadingEmojiResource implementation of UploadingEmojiProvider).
	 */
	allowUpload?: boolean;

	/**
	 * Logged user in the Product.
	 */
	currentUser?: User;

	/**
	 * A callback triggered on emoji load failure
	 */
	onEmojiLoadFail?: EmojiLoadFailCallback;

	/**
	 * A callback triggered on emoji load success
	 */
	onEmojiLoadSuccess?: EmojiLoadSuccessCallback;

	/**
	 * Renders an image while the provider is being downloaded to reduce the time
	 * the user is being presented with a placeholder
	 */
	optimisticImageApi?: OptimisticImageApiLoaderConfig;

	/**
	 * Additional configuration:
	 * * On-demand Fetching - Useful for when a product may prefer manually controlling when providers are fetched
	 */
	options?: Options;

	/**
	 * This defines the different providers. Later providers will override earlier
	 * providers when performing shortName based look up.
	 */
	providers: ServiceConfig[];

	/**
	 * The service configuration for remotely recording emoji selections.
	 * A post will be performed to this URL with the EmojiId as the body.
	 */
	recordConfig?: ServiceConfig;

	/**
	 * This is specifically used for fetching a meta information of a single emoji.
	 * Useful for when rendering a single or a subset of emojis on a page that does not require the
	 * whole provider list to be downloaded.
	 */
	singleEmojiApi?: SingleEmojiApiLoaderConfig;
}

export interface OnEmojiProviderChange extends OnProviderChange<EmojiSearchResult, any, void> {}

export interface Retry<T> {
	(): Promise<T> | T;
}

export interface ResolveReject<T> {
	reject(reason?: any): void;
	resolve(result: T): void;
}

/**
 * Checks if the emojiProvider can support uploading at a feature level.
 *
 * Follow this up with an isUploadSupported() check to see if the provider is actually
 * configured to support uploads.
 * https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
 */
export const supportsUploadFeature = (
	emojiProvider: EmojiProvider,
): emojiProvider is UploadingEmojiProvider => {
	const emojiUploadProvider = emojiProvider as UploadingEmojiProvider;
	return (
		!!emojiUploadProvider.isUploadSupported &&
		!!emojiUploadProvider.uploadCustomEmoji &&
		!!emojiUploadProvider.prepareForUpload
	);
};

export interface LastQuery {
	options?: SearchOptions;
	query?: string;
}

export class EmojiResource
	extends AbstractResource<string, EmojiSearchResult, any, undefined, SearchOptions>
	implements EmojiProvider
{
	protected recordConfig?: ServiceConfig;
	protected emojiRepository?: EmojiRepository;
	protected lastQuery?: LastQuery;
	protected activeLoaders: number = 0;
	protected initialLoaders: number = 0;
	protected retries: Map<Retry<any>, ResolveReject<any>> = new Map();
	protected siteEmojiResource?: SiteEmojiResource;
	protected selectedTone: ToneSelection;
	protected currentUser?: User;
	protected isInitialised: boolean = false;
	protected fetchOnDemand: boolean = false;
	protected emojiResponses: EmojiResponse[];
	public emojiProviderConfig: EmojiResourceConfig;

	constructor(config: EmojiResourceConfig) {
		super();
		this.emojiProviderConfig = config;
		this.recordConfig = config.recordConfig;
		this.currentUser = config.currentUser;

		if (storageAvailable('localStorage')) {
			this.selectedTone = this.loadStoredTone();
		}

		if (config.providers.length === 0) {
			throw new Error('No providers specified');
		}

		this.fetchOnDemand = !!config.options && !!config.options.onlyFetchOnDemand;
		this.initialLoaders = this.emojiProviderConfig.providers.length;
		this.activeLoaders = this.emojiProviderConfig.providers.length;
		this.emojiResponses = [];
	}

	/**
	 * Get the emoji provider from Emoji Resource
	 * @returns Promise<EmojiProvider>
	 */
	public async getEmojiProvider(
		options: GetEmojiProviderOptions = { fetchAtStart: !this.fetchOnDemand },
	): Promise<EmojiProvider> {
		if (options.fetchAtStart) {
			try {
				await this.fetchEmojiProvider();
			} catch (error) {
				debug(error);
				return Promise.resolve(this);
			}
		}
		return Promise.resolve(this);
	}

	private async fetchIndividualProvider(provider: ServiceConfig, index: number): Promise<void> {
		const providerType = this.getProviderType(provider);
		try {
			sampledUfoEmojiResourceFetched(providerType).start({
				samplingRate: SAMPLING_RATE_EMOJI_RESOURCE_FETCHED_EXP,
			});
			sampledUfoEmojiResourceFetched(providerType).addMetadata({
				type: providerType,
			});

			const loader = new EmojiLoader(provider);
			// fetch emoji from provider url and denormalise
			const emojiResponse = await loader.loadEmoji();
			sampledUfoEmojiResourceFetched(providerType).success();
			// setup emoji repository
			this.emojiResponses[index] = emojiResponse;
			this.initEmojiRepository(this.emojiResponses);
			await this.initSiteEmojiResource(emojiResponse, provider);
			this.activeLoaders--;
			this.performRetries();
			this.refreshLastFilter();
		} catch (error: any) {
			this.activeLoaders--;
			this.notifyError(error);
			sampledUfoEmojiResourceFetched(providerType).failure({
				metadata: {
					reason: error,
					source: 'EmojiProvider',
					providerUrl: provider.url,
				},
			});
			debug(`failed to fetch emoji provider for ${provider.url}`, error);
			throw new Error(`failed to fetch emoji from ${provider.url}`);
		}
	}

	public async fetchEmojiProvider(force = false) {
		// unless (re-)fetch is being forced, fetching will only
		// happen if no emojiRepository exists
		// in case this method is called and emojiRepository has already been populated
		// the method will just return the existing emojiRepository
		if (
			force ||
			(!this.isRepositoryAvailable<EmojiRepository>(this.emojiRepository) && !this.isInitialised)
		) {
			this.isInitialised = true;
			this.emojiResponses = [];
			// fetch emoji providers
			await Promise.all(
				this.emojiProviderConfig.providers.map((provider, index) =>
					this.fetchIndividualProvider(provider, index),
				),
			);
		}
		return Promise.resolve(this.emojiRepository);
	}

	public onlyFetchOnDemand(): boolean {
		return this.fetchOnDemand;
	}

	public async fetchByEmojiId(
		emojiId: EmojiId,
		optimistic: boolean,
	): Promise<OptionalEmojiDescriptionWithVariations> {
		// Check if repository exists and emoji is defined.
		if (this.isLoaded() && this.isRepositoryAvailable<EmojiRepository>(this.emojiRepository)) {
			const emoji = await this.findByEmojiId(emojiId);
			if (emoji) {
				return await this.getMediaEmojiDescriptionURLWithInlineToken(emoji);
			}
		}

		// If optimistic is fetched
		if (this.emojiProviderConfig.singleEmojiApi && optimistic) {
			// if config has singleEmojiApi then fetch single emoji
			const provider: EmojiLoaderConfig = {
				url: this.emojiProviderConfig.singleEmojiApi.getUrl(emojiId),
				securityProvider: this.emojiProviderConfig.singleEmojiApi.securityProvider,
			};
			const loader = new EmojiLoader(provider);
			try {
				const loadEmoji = await loader.loadEmoji();
				if (!loadEmoji.emojis[0]) {
					return;
				}
				if (!this.isRepositoryAvailable<SiteEmojiResource>(this.siteEmojiResource)) {
					await this.initSiteEmojiResource(loadEmoji, provider);
				}
				return this.getMediaEmojiDescriptionURLWithInlineToken(loadEmoji.emojis[0]);
			} catch {
				const emoji = await this.findByEmojiId(emojiId);
				if (!emoji) {
					return;
				}
				return this.getMediaEmojiDescriptionURLWithInlineToken(emoji);
			}
		}

		const emoji = await this.findByEmojiId(emojiId);
		if (!emoji) {
			return;
		}
		return this.getMediaEmojiDescriptionURLWithInlineToken(emoji);
	}

	private getProviderType(provider: ServiceConfig) {
		if (provider.url.includes('/site')) {
			return ProviderTypes.SITE;
		} else if (provider.url.includes('/standard')) {
			return ProviderTypes.STANDARD;
		} else if (provider.url.includes('/atlassian')) {
			return ProviderTypes.ATLASSIAN;
		}
		return ProviderTypes.UNKNOWN;
	}

	protected initEmojiRepository(emojiResponses: EmojiResponse[]): void {
		let emojis: EmojiDescription[] = [];
		emojiResponses.forEach((emojiResponse) => {
			emojis = emojis.concat(emojiResponse.emojis);
		});
		this.emojiRepository = new EmojiRepository(emojis);
	}

	protected initSiteEmojiResource(
		emojiResponse: EmojiResponse,
		provider: ServiceConfig,
	): Promise<void> {
		if (
			!this.isRepositoryAvailable<SiteEmojiResource>(this.siteEmojiResource) &&
			emojiResponse.mediaApiToken
		) {
			this.siteEmojiResource = new SiteEmojiResource(provider, emojiResponse.mediaApiToken);

			// Prime cache type + optimistic rendering by checking first Emoji.
			// If this is fails, it won't be primed until a good emoji is loaded later.
			const { emojis } = emojiResponse;
			if (emojis.length) {
				const done = this.siteEmojiResource.optimisticRendering(emojis[0]);
				if (isPromise(done)) {
					return done
						.then(() => {
							debug('Primed siteEmojiResource');
						})
						.catch(() => {
							debug('Failed to prime siteEmojiResource');
						});
				} else {
					debug('Already primed siteEmojiResource');
				}
			} else {
				debug('No emoji to prime siteEmojiResource with');
			}
		}
		return Promise.resolve();
	}

	private performRetries(): void {
		const currentRetries = this.retries;
		this.retries = new Map();
		currentRetries.forEach((resolveReject, retry) => {
			const result = retry();
			if (isPromise(result)) {
				result
					.then((response) => {
						resolveReject.resolve(response);
					})
					.catch((reason) => {
						resolveReject.reject(reason);
					});
			} else {
				resolveReject.resolve(result);
			}
		});
	}

	public getOptimisticImageURL = (emojiId: EmojiId): string | undefined => {
		if (this.emojiProviderConfig.optimisticImageApi) {
			return this.emojiProviderConfig.optimisticImageApi.getUrl(emojiId);
		}
		return;
	};

	protected isRepositoryAvailable = <T>(repository?: T): repository is T => {
		return !!repository;
	};

	private isLoaded = () => this.initialLoaders !== 0 && this.activeLoaders === 0;

	private loadStoredTone(): ToneSelection {
		if (typeof window === 'undefined') {
			return undefined;
		}
		const storedToneString = window.localStorage.getItem(selectedToneStorageKey);
		if (storedToneString) {
			const storedTone = parseInt(storedToneString, 10);
			return !isNaN(storedTone) ? storedTone : undefined;
		}

		return undefined;
	}

	protected refreshLastFilter(): void {
		if (typeof this.lastQuery !== 'undefined') {
			const { query, options } = this.lastQuery;
			this.filter(query, options);
		}
	}

	protected retryIfLoading<T>(retry: Retry<T>, defaultResponse: T): Promise<T> {
		if (!this.isLoaded()) {
			return new Promise<T>((resolve, reject) => {
				this.retries.set(retry, { resolve, reject });
			});
		}
		return Promise.resolve<T>(defaultResponse);
	}

	protected notifyResult(result: EmojiSearchResult): void {
		if (this.lastQuery && result.query === this.lastQuery.query) {
			super.notifyResult(result);
		}
	}

	/**
	 *  Returns the EmojiDescription with a valid media path that includes query token and client attributes to access the emoji media inline.
	 */
	async getMediaEmojiDescriptionURLWithInlineToken(
		emoji: EmojiDescription,
	): Promise<EmojiDescription> {
		if (this.isRepositoryAvailable<SiteEmojiResource>(this.siteEmojiResource)) {
			const { representation, altRepresentation } =
				await this.siteEmojiResource.generateTokenisedMediaURLS(
					emoji.representation,
					emoji.altRepresentation,
				);

			return {
				...emoji,
				representation,
				altRepresentation,
			};
		}

		return emoji;
	}

	loadMediaEmoji(
		emoji: EmojiDescription,
		useAlt?: boolean,
	): OptionalEmojiDescription | Promise<OptionalEmojiDescription> {
		if (
			!this.isRepositoryAvailable<SiteEmojiResource>(this.siteEmojiResource) ||
			!isMediaEmoji(emoji)
		) {
			return emoji;
		}
		return this.siteEmojiResource.loadMediaEmoji(emoji, useAlt);
	}

	optimisticMediaRendering(emoji: EmojiDescription, useAlt?: boolean): boolean {
		if (!isMediaEmoji(emoji)) {
			return true;
		}
		if (!this.isRepositoryAvailable<SiteEmojiResource>(this.siteEmojiResource)) {
			// Shouldn't have a media emoji without a siteEmojiResouce, but anyway ;)
			return false;
		}
		const optimistic = this.siteEmojiResource.optimisticRendering(emoji, useAlt);

		if (isPromise(optimistic)) {
			// Not sure yet, so lets say no for now (this should normally be primed in most/all cases)
			return false;
		}

		return optimistic;
	}

	filter(query?: string, options?: SearchOptions): void {
		ufoExperiences['emoji-searched'].start();
		ufoExperiences['emoji-searched'].addMetadata({
			queryLength: query?.length || 0,
		});
		this.lastQuery = {
			query,
			options,
		};
		if (this.isRepositoryAvailable<EmojiRepository>(this.emojiRepository)) {
			const searchResults = this.emojiRepository.search(query, options);
			this.notifyResult(searchResults);
			ufoExperiences['emoji-searched'].success({
				metadata: {
					emojisLength: searchResults.emojis.length,
					source: options?.source || 'typeahead',
				},
			});
		} else {
			// not ready
			this.notifyNotReady();
		}
	}

	findByShortName(shortName: string): OptionalEmojiDescription | Promise<OptionalEmojiDescription> {
		if (this.isLoaded() && this.isRepositoryAvailable<EmojiRepository>(this.emojiRepository)) {
			// Wait for all emoji to load before looking by shortName (to ensure correct priority)
			return this.emojiRepository.findByShortName(shortName);
		}
		return this.retryIfLoading<any>(() => this.findByShortName(shortName), undefined);
	}

	findByEmojiId(emojiId: EmojiId): OptionalEmojiDescription | Promise<OptionalEmojiDescription> {
		const { id, shortName } = emojiId;
		if (this.isRepositoryAvailable<EmojiRepository>(this.emojiRepository)) {
			if (id) {
				const emoji = this.emojiRepository!.findById(id);
				if (emoji) {
					return emoji;
				}
				if (this.isLoaded()) {
					// all loaded but not found by id, try server to see if
					// this is a newly uploaded emoji
					if (this.isRepositoryAvailable<SiteEmojiResource>(this.siteEmojiResource)) {
						return this.siteEmojiResource.findEmoji(emojiId).then((emoji) => {
							if (!emoji) {
								// if not, fallback to searching by shortName to
								// at least render an alternative
								return this.findByShortName(shortName);
							}
							this.addUnknownEmoji(emoji);
							return emoji;
						});
					}

					// if not, fallback to searching by shortName to
					// at least render an alternative
					return this.findByShortName(shortName);
				}
			} else {
				// no id fallback to shortName
				return this.findByShortName(shortName);
			}
		}
		return this.retryIfLoading(() => this.findByEmojiId(emojiId), undefined);
	}

	findById(id: string): OptionalEmojiDescription | Promise<OptionalEmojiDescription> {
		if (this.isLoaded() && this.isRepositoryAvailable<EmojiRepository>(this.emojiRepository)) {
			return this.emojiRepository.findById(id);
		}

		return this.retryIfLoading(() => this.findById(id), undefined);
	}

	findInCategory(categoryId: CategoryId): Promise<EmojiDescription[]> {
		if (this.isLoaded() && this.isRepositoryAvailable<EmojiRepository>(this.emojiRepository)) {
			return Promise.resolve(this.emojiRepository.findInCategory(categoryId));
		}
		return this.retryIfLoading(() => this.findInCategory(categoryId), []);
	}

	getAsciiMap(): Promise<Map<string, EmojiDescription>> {
		if (this.isLoaded() && this.isRepositoryAvailable<EmojiRepository>(this.emojiRepository)) {
			return Promise.resolve(this.emojiRepository.getAsciiMap());
		}
		return this.retryIfLoading(() => this.getAsciiMap(), new Map());
	}

	getFrequentlyUsed(options?: SearchOptions): Promise<EmojiDescription[]> {
		if (this.isLoaded() && this.isRepositoryAvailable<EmojiRepository>(this.emojiRepository)) {
			return Promise.resolve(this.emojiRepository.getFrequentlyUsed(options));
		}

		return this.retryIfLoading(() => this.getFrequentlyUsed(options), []);
	}

	/**
	 * Record the selection of an emoji to a remote service if 'recordConfig' has been supplied.
	 * Regardless of the recordConfig, emoji selections will always be recorded on the EmojiRepository
	 * for the purposes of tracking the frequency of use.
	 *
	 * @param emoji The full description of the emoji to record usage for.
	 */
	recordSelection(emoji: EmojiDescription): Promise<any> {
		const { recordConfig } = this;
		if (this.isRepositoryAvailable<EmojiRepository>(this.emojiRepository)) {
			this.emojiRepository.used(emoji);
		}

		if (recordConfig) {
			const queryParams = {
				emojiId: toEmojiId(emoji),
			};
			const requestInit = {
				method: 'POST',
			};
			return serviceUtils.requestService(recordConfig, {
				queryParams,
				requestInit,
			});
		}

		return Promise.resolve();
	}

	deleteSiteEmoji(emoji: EmojiDescription): Promise<boolean> {
		if (this.isRepositoryAvailable<SiteEmojiResource>(this.siteEmojiResource) && emoji.id) {
			return this.siteEmojiResource
				.deleteEmoji(emoji)
				.then((success) => {
					if (success && this.isRepositoryAvailable<EmojiRepository>(this.emojiRepository)) {
						this.emojiRepository.delete(emoji);
						return true;
					}
					return false;
				})
				.catch((err) => {
					// eslint-disable-next-line no-console
					console.error('failed to delete site emoji', err);
					return false;
				});
		}
		return this.retryIfLoading(() => this.deleteSiteEmoji(emoji), false);
	}

	getSelectedTone(): ToneSelection {
		return this.selectedTone;
	}

	setSelectedTone(tone: ToneSelection) {
		this.selectedTone = tone;
		if (typeof window === 'undefined') {
			return;
		}
		if (storageAvailable('localStorage')) {
			try {
				window.localStorage.setItem(selectedToneStorageKey, tone ? tone.toString() : '');
			} catch (e) {
				// eslint-disable-next-line no-console
				console.error('failed to store selected emoji skin tone', e);
			}
		}
	}

	calculateDynamicCategories(): Promise<CategoryId[]> {
		if (this.isLoaded() && this.isRepositoryAvailable<EmojiRepository>(this.emojiRepository)) {
			return Promise.resolve(this.emojiRepository.getDynamicCategoryList());
		}

		return this.retryIfLoading(() => this.calculateDynamicCategories(), []);
	}

	getCurrentUser(): OptionalUser {
		return this.currentUser;
	}

	protected addUnknownEmoji(emoji: EmojiDescription) {
		if (this.isRepositoryAvailable<EmojiRepository>(this.emojiRepository)) {
			this.emojiRepository.addUnknownEmoji(emoji);
		}
	}
}

export default class UploadingEmojiResource
	extends EmojiResource
	implements UploadingEmojiProvider
{
	protected allowUpload: boolean;

	constructor(config: EmojiResourceConfig) {
		super(config);
		this.allowUpload = !!config.allowUpload;
	}

	isUploadSupported(): Promise<boolean> {
		if (!this.allowUpload) {
			return Promise.resolve(false);
		}
		if (this.isRepositoryAvailable<SiteEmojiResource>(this.siteEmojiResource)) {
			return this.siteEmojiResource.hasUploadToken();
		}
		return this.retryIfLoading(() => this.isUploadSupported(), false);
	}

	uploadCustomEmoji(
		upload: EmojiUpload,
		retry = false,
		timeout = 12_000,
	): Promise<EmojiDescription> {
		return this.isUploadSupported().then((supported) => {
			if (!supported || !this.isRepositoryAvailable<SiteEmojiResource>(this.siteEmojiResource)) {
				return Promise.reject('No media api support is configured');
			}
			const uploadPromise = this.siteEmojiResource.uploadEmoji(upload, retry).then((emoji) => {
				// Use file preview blob URL to temporarily fix the graybox issue after uploading,
				// Because the media service takes time to process the image.
				// Ideally should improve CachingMediaImage by using mediaClient or mediaImage,
				// But that requires more efforts in FE & BE.
				// TODO: revist this when pick up COLLAB-2294
				(emoji.representation as ImageRepresentation).imagePath = upload.dataURL;
				this.addUnknownEmoji(emoji);
				this.refreshLastFilter();
				return emoji;
			});
			return promiseWithTimeout(uploadPromise, timeout, 'uploadCustomEmoji timed out');
		});
	}

	prepareForUpload(): Promise<void> {
		if (this.isRepositoryAvailable<SiteEmojiResource>(this.siteEmojiResource)) {
			this.siteEmojiResource.prepareForUpload();
		}
		return this.retryIfLoading(() => this.prepareForUpload(), undefined);
	}
}

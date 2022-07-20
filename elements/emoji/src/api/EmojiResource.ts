import {
  AbstractResource,
  OnProviderChange,
  ServiceConfig,
  utils as serviceUtils,
} from '@atlaskit/util-service-support';
import { CategoryId } from '../components/picker/categories';
import {
  SAMPLING_RATE_EMOJI_RESOURCE_FETCHED_EXP,
  selectedToneStorageKey,
} from '../util/constants';
import {
  isMediaEmoji,
  isMediaRepresentation,
  isPromise,
  toEmojiId,
} from '../util/type-helpers';
import storageAvailable from '../util/storage-available';
import {
  EmojiDescription,
  EmojiId,
  EmojiProvider,
  EmojiResponse,
  EmojiSearchResult,
  EmojiUpload,
  OptionalEmojiDescription,
  OptionalEmojiDescriptionWithVariations,
  OptionalUser,
  ProviderTypes,
  SearchOptions,
  ToneSelection,
  UploadingEmojiProvider,
  User,
} from '../types';
import debug from '../util/logger';
import EmojiLoader from './EmojiLoader';
import EmojiRepository from './EmojiRepository';
import SiteEmojiResource from './media/SiteEmojiResource';
import {
  EmojiLoaderConfig,
  OptimisticImageApiLoaderConfig,
  SingleEmojiApiLoaderConfig,
} from './EmojiUtils';
import { sampledUfoEmojiResourceFetched } from '../util/analytics/ufoExperiences';

export type { EmojiProvider, UploadingEmojiProvider } from '../types'; // Re-exporting to not cause a breaking change
// Re-exporting to not cause a breaking change

export interface EmojiResourceConfig {
  /**
   * The service configuration for remotely recording emoji selections.
   * A post will be performed to this URL with the EmojiId as the body.
   */
  recordConfig?: ServiceConfig;

  /**
   * This defines the different providers. Later providers will override earlier
   * providers when performing shortName based look up.
   */
  providers: ServiceConfig[];

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
   * This is specifically used for fetching a meta information of a single emoji.
   * Useful for when rendering a single or a subset of emojis on a page that does not require the
   * whole provider list to be downloaded.
   */
  singleEmojiApi?: SingleEmojiApiLoaderConfig;

  /**
   * Used for fetching emoji asset and render this asset before provider has been
   * downloaded to reduce the time the user is presented with a placeholder
   * while downloading the emoji meta data
   */
  optimisticImageApi?: OptimisticImageApiLoaderConfig;
}

export interface OnEmojiProviderChange
  extends OnProviderChange<EmojiSearchResult, any, void> {}

export interface Retry<T> {
  (): Promise<T> | T;
}

export interface ResolveReject<T> {
  resolve(result: T): void;
  reject(reason?: any): void;
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
  query?: string;
  options?: SearchOptions;
}

export class EmojiResource
  extends AbstractResource<
    string,
    EmojiSearchResult,
    any,
    undefined,
    SearchOptions
  >
  implements EmojiProvider {
  protected recordConfig?: ServiceConfig;
  protected emojiRepository?: EmojiRepository;
  protected lastQuery?: LastQuery;
  protected activeLoaders: number = 0;
  protected retries: Map<Retry<any>, ResolveReject<any>> = new Map();
  protected siteEmojiResource?: SiteEmojiResource;
  protected selectedTone: ToneSelection;
  protected currentUser?: User;
  protected isInitialised: boolean = false;
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
  }

  public fetchEmojiProvider(force?: boolean) {
    // unless (re-)fetch is being forced, fetching will only
    // happen if no emojiRepository exists
    // in case this method is called and emojiRepository has already been populated
    // the method will just return the existing emojiRepository
    if (force || (!this.emojiRepository && !this.isInitialised)) {
      this.isInitialised = true;
      // Ensure order is retained by tracking until all done.
      const emojiResponses: EmojiResponse[] = [];

      this.activeLoaders = this.emojiProviderConfig.providers.length;

      this.emojiProviderConfig.providers.forEach(async (provider, index) => {
        const providerType = this.getProviderType(provider);
        sampledUfoEmojiResourceFetched(providerType).start({
          samplingRate: SAMPLING_RATE_EMOJI_RESOURCE_FETCHED_EXP,
        });
        sampledUfoEmojiResourceFetched(providerType).addMetadata({
          type: providerType,
        });

        const loader = new EmojiLoader(provider);
        const emojis = loader.loadEmoji();
        await emojis
          .then((emojiResponse) => {
            emojiResponses[index] = emojiResponse;
            this.initEmojiRepository(emojiResponses);
            this.initSiteEmojiResource(emojiResponse, provider).then(() => {
              this.activeLoaders--;
              this.performRetries();
              this.refreshLastFilter();
              // if not site emoji it would still resolve
              // TODO: improve the logic in future
              sampledUfoEmojiResourceFetched(providerType).success();
            });
          })
          .catch((reason) => {
            this.activeLoaders--;
            this.notifyError(reason);
            sampledUfoEmojiResourceFetched(providerType).failure({
              metadata: {
                reason,
                source: 'EmojiProvider',
                data: {
                  providerUrl: provider.url,
                },
              },
            });
          });
      });
    }
    return Promise.resolve(this.emojiRepository);
  }

  public async fetchByEmojiId(
    emojiId: EmojiId,
    optimistic: boolean,
  ): Promise<OptionalEmojiDescriptionWithVariations> {
    // Check if repository exists and emoji is defined.
    if (this.emojiRepository && this.isLoaded()) {
      const emoji = await this.findByEmojiId(emojiId);
      if (emoji) {
        return Promise.resolve(
          this.getMediaEmojiDescriptionURLWithInlineToken(emoji),
        );
      }
    }

    // If optimistic is fetched
    if (this.emojiProviderConfig.singleEmojiApi && optimistic) {
      // if config has singleEmojiApi then fetch single emoji
      const provider: EmojiLoaderConfig = {
        url: this.emojiProviderConfig.singleEmojiApi.getUrl(emojiId),
        securityProvider: this.emojiProviderConfig.singleEmojiApi
          .securityProvider,
      };
      const loader = new EmojiLoader(provider);
      try {
        const loadEmoji = await loader.loadEmoji();
        if (!loadEmoji.emojis[0]) {
          return;
        }
        if (!this.siteEmojiResource) {
          await this.initSiteEmojiResource(loadEmoji, provider);
        }
        return this.getMediaEmojiDescriptionURLWithInlineToken(
          loadEmoji.emojis[0],
        );
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
    if (!this.siteEmojiResource && emojiResponse.mediaApiToken) {
      this.siteEmojiResource = new SiteEmojiResource(
        provider,
        emojiResponse.mediaApiToken,
      );

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

  private loadStoredTone(): ToneSelection {
    if (typeof window === 'undefined') {
      return undefined;
    }
    const storedToneString = window.localStorage.getItem(
      selectedToneStorageKey,
    );
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

  protected isLoaded = () => this.activeLoaders === 0 && this.emojiRepository;

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
    if (this.siteEmojiResource && isMediaRepresentation(emoji.representation)) {
      const tokenisedMediaPath = await this.siteEmojiResource.generateTokenisedMediaURL(
        emoji,
      );
      return {
        ...emoji,
        representation: {
          ...emoji.representation,
          mediaPath: tokenisedMediaPath,
        },
      } as EmojiDescription;
    }

    return emoji;
  }

  loadMediaEmoji(
    emoji: EmojiDescription,
    useAlt?: boolean,
  ): OptionalEmojiDescription | Promise<OptionalEmojiDescription> {
    if (!this.siteEmojiResource || !isMediaEmoji(emoji)) {
      return emoji;
    }
    return this.siteEmojiResource.loadMediaEmoji(emoji, useAlt);
  }

  optimisticMediaRendering(emoji: EmojiDescription, useAlt?: boolean): boolean {
    if (!isMediaEmoji(emoji)) {
      return true;
    }
    if (!this.siteEmojiResource) {
      // Shouldn't have a media emoji without a siteEmojiResouce, but anyway ;)
      return false;
    }
    const optimistic = this.siteEmojiResource.optimisticRendering(
      emoji,
      useAlt,
    );

    if (isPromise(optimistic)) {
      // Not sure yet, so lets say no for now (this should normally be primed in most/all cases)
      return false;
    }

    return optimistic;
  }

  filter(query?: string, options?: SearchOptions): void {
    this.lastQuery = {
      query,
      options,
    };
    if (this.emojiRepository) {
      this.notifyResult(this.emojiRepository.search(query, options));
    } else {
      // not ready
      this.notifyNotReady();
    }
  }

  findByShortName(
    shortName: string,
  ): OptionalEmojiDescription | Promise<OptionalEmojiDescription> {
    if (this.isLoaded()) {
      // Wait for all emoji to load before looking by shortName (to ensure correct priority)
      return this.emojiRepository!.findByShortName(shortName);
    }
    return this.retryIfLoading<any>(
      () => this.findByShortName(shortName),
      undefined,
    );
  }

  findByEmojiId(
    emojiId: EmojiId,
  ): OptionalEmojiDescription | Promise<OptionalEmojiDescription> {
    const { id, shortName } = emojiId;
    if (this.emojiRepository) {
      if (id) {
        const emoji = this.emojiRepository.findById(id);
        if (emoji) {
          return emoji;
        }
        if (this.isLoaded()) {
          // all loaded but not found by id, try server to see if
          // this is a newly uploaded emoji
          if (this.siteEmojiResource) {
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

  findById(
    id: string,
  ): OptionalEmojiDescription | Promise<OptionalEmojiDescription> {
    if (this.isLoaded()) {
      return this.emojiRepository!.findById(id);
    }

    return this.retryIfLoading(() => this.findById(id), undefined);
  }

  findInCategory(categoryId: CategoryId): Promise<EmojiDescription[]> {
    if (this.isLoaded()) {
      return Promise.resolve(this.emojiRepository!.findInCategory(categoryId));
    }
    return this.retryIfLoading(() => this.findInCategory(categoryId), []);
  }

  getAsciiMap(): Promise<Map<string, EmojiDescription>> {
    if (this.isLoaded()) {
      return Promise.resolve(this.emojiRepository!.getAsciiMap());
    }
    return this.retryIfLoading(() => this.getAsciiMap(), new Map());
  }

  getFrequentlyUsed(options?: SearchOptions): Promise<EmojiDescription[]> {
    if (this.isLoaded()) {
      return Promise.resolve(this.emojiRepository!.getFrequentlyUsed(options));
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
    if (this.emojiRepository) {
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
    if (this.siteEmojiResource && emoji.id) {
      return this.siteEmojiResource
        .deleteEmoji(emoji)
        .then((success) => {
          if (success && this.emojiRepository) {
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
        window.localStorage.setItem(
          selectedToneStorageKey,
          tone ? tone.toString() : '',
        );
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('failed to store selected emoji skin tone', e);
      }
    }
  }

  calculateDynamicCategories(): Promise<CategoryId[]> {
    if (this.isLoaded()) {
      return Promise.resolve(this.emojiRepository!.getDynamicCategoryList());
    }

    return this.retryIfLoading(() => this.calculateDynamicCategories(), []);
  }

  getCurrentUser(): OptionalUser {
    return this.currentUser;
  }

  protected addUnknownEmoji(emoji: EmojiDescription) {
    if (this.emojiRepository) {
      this.emojiRepository.addUnknownEmoji(emoji);
    }
  }
}

export default class UploadingEmojiResource
  extends EmojiResource
  implements UploadingEmojiProvider {
  protected allowUpload: boolean;

  constructor(config: EmojiResourceConfig) {
    super(config);
    this.allowUpload = !!config.allowUpload;
  }

  isUploadSupported(): Promise<boolean> {
    if (!this.allowUpload) {
      return Promise.resolve(false);
    }
    if (this.siteEmojiResource) {
      return this.siteEmojiResource.hasUploadToken();
    }
    return this.retryIfLoading(() => this.isUploadSupported(), false);
  }

  uploadCustomEmoji(
    upload: EmojiUpload,
    retry = false,
  ): Promise<EmojiDescription> {
    return this.isUploadSupported().then((supported) => {
      if (!supported || !this.siteEmojiResource) {
        return Promise.reject('No media api support is configured');
      }
      return this.siteEmojiResource.uploadEmoji(upload, retry).then((emoji) => {
        this.addUnknownEmoji(emoji);
        this.refreshLastFilter();
        return emoji;
      });
    });
  }

  prepareForUpload(): Promise<void> {
    if (this.siteEmojiResource) {
      this.siteEmojiResource.prepareForUpload();
    }
    return this.retryIfLoading(() => this.prepareForUpload(), undefined);
  }
}

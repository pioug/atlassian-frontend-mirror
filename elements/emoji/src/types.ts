import { SyntheticEvent } from 'react';
import { messages } from './components/i18n';
import { CategoryId } from './components/picker/categories';
import { Provider } from '@atlaskit/util-service-support/types';

export type { CategoryId } from './components/picker/categories';

export interface EmojiProvider
  extends Provider<string, EmojiSearchResult, any, undefined, SearchOptions> {
  /**
   * Returns the first matching emoji matching the shortName, or null if none found.
   *
   * Will load media api images before returning.
   */
  findByShortName(
    shortName: string,
  ): OptionalEmojiDescription | Promise<OptionalEmojiDescription>;

  /**
   * Returns the first matching emoji matching the emojiId.id.
   *
   * If not found or emojiId.id is undefined, fallback to a search by shortName.
   *
   * Will load media api images before returning.
   */
  findByEmojiId(
    emojiId: EmojiId,
  ): OptionalEmojiDescription | Promise<OptionalEmojiDescription>;

  /**
   * Return the emoji that matches the supplied id or undefined. As with findByEmojiId, this call should load
   * the media api images before returning.
   */
  findById(
    id: string,
  ): OptionalEmojiDescription | Promise<OptionalEmojiDescription>;

  /**
   * Finds emojis belonging to specified category.
   *
   * Does not automatically load Media API images.
   */
  findInCategory(categoryId: string): Promise<EmojiDescription[]>;

  /**
   * Returns a map matching ascii representations to their corresponding EmojiDescription.
   */
  getAsciiMap(): Promise<Map<string, EmojiDescription>>;

  /**
   * Returns, in a Promise, an array of the most frequently used emoji, ordered from most frequent to least frequent.
   * If there is no frequently used data then an empty array should be returned.
   *
   * @param options supply options to be applied to the request.
   */
  getFrequentlyUsed(options?: SearchOptions): Promise<EmojiDescription[]>;

  /**
   * Records an emoji selection, for example for using in tracking recent emoji.
   * If no recordConfig is configured then a resolved promise should be returned
   *
   * Optional.
   */
  recordSelection?(emoji: EmojiDescription): Promise<any>;

  /**
   * Deletes the given emoji from the site emoji service
   * No changes are made if it is not a media emoji, no siteEmojiResource has been initialised
   * or the user is not authorised.
   * It should also be removed from the EmojiResource so it cannot be returned via search
   *
   * Optional.
   *
   * @return a boolean indicating whether the delete was successful
   */
  deleteSiteEmoji(emoji: EmojiDescription): Promise<boolean>;

  /**
   * Load media emoji that may require authentication to download, producing
   * a new EmojiDescription to be used for rendering, if necessary.
   *
   * Future results may be returned from a cache.
   *
   * Acts as a no-op if not a media emoji.
   *
   * Downloads and caches the altRepresentation image if useAlt is passed in
   *
   * @return an OptionalEmojiDescription or a promise for one, may be the same as the input,
   *   or updated with a new url to cached image data. Will return the original EmojiDescription
   *   if not a custom emoji.
   */
  loadMediaEmoji(
    emoji: EmojiDescription,
    useAlt?: boolean,
  ): OptionalEmojiDescription | Promise<OptionalEmojiDescription>;

  /**
   * Indicates if media emoji should be rendered optimistically,
   * i.e. assume the url can be rendered directly from the URL, and
   * only explicitly loaded via loadEmojiImageData if it fails to load.
   *
   * If useAlt is provided, the altRepresentation image URL is used
   */
  optimisticMediaRendering(emoji: EmojiDescription, useAlt?: boolean): boolean;

  /**
   * Used by the picker and typeahead to obtain a skin tone preference
   * if the user has previously selected one via the Tone Selector
   */
  getSelectedTone(): ToneSelection;

  /**
   * Used by Tone Selector to indicate to the provider that the user
   * has selected a skin tone preference that should be remembered
   */
  setSelectedTone(tone: ToneSelection): void;

  /**
   * Returns a list of all the non-standard categories with emojis in the EmojiRepository
   * e.g. 'FREQUENT', 'ATLASSIAN' and 'CUSTOM'
   */
  calculateDynamicCategories?(): Promise<string[]>;

  /**
   * Returns the logged user passed by the Product
   */
  getCurrentUser(): OptionalUser;
}

export interface UploadingEmojiProvider extends EmojiProvider {
  /**
   * Returns true if upload is supported.
   *
   * Waits until resources have loaded before returning.
   */
  isUploadSupported(): Promise<boolean>;

  /**
   * Uploads an emoji to the configured repository.
   *
   * Will return a promise with the EmojiDescription once completed.
   *
   * The last search will be re-run to ensure the new emoji is considered in the search.
   */
  uploadCustomEmoji(upload: EmojiUpload): Promise<EmojiDescription>;

  /**
   * Allows the preloading of data (e.g. authentication tokens) to speed the uploading of emoji.
   */
  prepareForUpload(): Promise<void>;
}

export type RelativePosition = 'above' | 'below' | 'auto';

export interface Styles {
  [index: string]: any;
}

/**
 * Minimum information to defined an emoji is the shortName.
 * In order to uniquely define an emoji, the id should be included, and is
 * used in preference to shortName if provided, and has a matching emoji.
 * If not emoji can be found by id (e.g. a custom emoji has been removed),
 * fallback behaviour will be to attempt to find a matching emoji by shortName.
 */
export interface EmojiId {
  shortName: string;
  id?: string;
  fallback?: string;
}

export interface SpriteSheet {
  url: string;
  row: number;
  column: number;
  height: number;
  width: number;
}

export interface EmojiImageRepresentation {
  height: number;
  width: number;
}

export interface SpriteImageRepresentation extends EmojiImageRepresentation {
  x: number;
  y: number;
  xIndex: number;
  yIndex: number;
}

/**
 * Sprite representation exposed from the EmojiResource.
 */
export interface SpriteRepresentation extends SpriteImageRepresentation {
  sprite: SpriteSheet;
}

/**
 * Representation returned from a sprite service.
 */
export interface SpriteServiceRepresentation extends SpriteImageRepresentation {
  /** Should match a index in a SpriteSheets */
  spriteRef: string;
}

export interface ImageRepresentation extends EmojiImageRepresentation {
  imagePath: string;
}

export interface MediaApiRepresentation extends EmojiImageRepresentation {
  mediaPath: string;
}

export type EmojiRepresentation =
  | SpriteRepresentation
  | ImageRepresentation
  | MediaApiRepresentation
  | undefined;

export interface EmojiDescription extends EmojiId {
  name?: string;
  order?: number;
  type: string;
  category: string;
  ascii?: string[];
  createdDate?: string;
  creatorUserId?: string;
  representation: EmojiRepresentation;
  altRepresentation?: EmojiRepresentation;
  searchable: boolean;
}

export interface EmojiDescriptionWithVariations extends EmojiDescription {
  skinVariations?: EmojiDescription[];
}

/**
 * Describes an emoji which is a variant of some base emoji. This is used when you want to promote the
 * skinVariations in an EmojiDescriptionWithVariations to represent them along side their base representations.
 */
export interface EmojiVariationDescription extends EmojiDescription {
  /** The id of the 'non-variant version of the emoji */
  baseId: string;
}

export type OptionalEmojiDescription = EmojiDescription | undefined;
export type OptionalEmojiDescriptionWithVariations =
  | EmojiDescriptionWithVariations
  | undefined;

export type EmojiServiceRepresentation =
  | SpriteServiceRepresentation
  | ImageRepresentation;

export interface EmojiServiceDescription {
  id: string;
  shortName: string;
  name?: string;
  order?: number;
  fallback?: string;
  ascii?: string[];
  createdDate?: string;
  creatorUserId?: string;
  type: string;
  category: string;
  representation: EmojiServiceRepresentation;
  altRepresentations?: AltRepresentations;
  searchable: boolean;
}

export interface EmojiServiceDescriptionWithVariations
  extends EmojiServiceDescription {
  skinVariations?: EmojiServiceDescription[];
}

export interface AltRepresentations {
  [key: string]: EmojiServiceRepresentation;
}

export interface SpriteSheets {
  [index: string]: SpriteSheet;
}

/**
 * An access token for emoji stored in the MediaApi
 * (indicated by urls beginning with the url of the token.)
 */
export interface MediaApiToken {
  url: string;
  clientId: string;
  jwt: string;
  collectionName: string;
  expiresAt: number; // seconds since Epoch UTC
}

export interface EmojiMeta {
  spriteSheets?: SpriteSheets;
  mediaApiToken?: MediaApiToken;
}

/**
 * The expected response from an Emoji service.
 */
export interface EmojiServiceResponse {
  emojis: EmojiServiceDescriptionWithVariations[];
  meta?: EmojiMeta;
}

export interface EmojiResponse {
  emojis: EmojiDescriptionWithVariations[];
  mediaApiToken?: MediaApiToken;
}

export interface CategoryDescription {
  id: string;
  name: keyof typeof messages;
  icon: any;
  order: number;
}

export interface OnToneSelected {
  (variation: number): void;
}

export interface OnToneSelectorCancelled {
  (): void;
}

export interface OnEmojiEvent<T = any> {
  (
    emojiId: EmojiId,
    emoji: OptionalEmojiDescription,
    event?: SyntheticEvent<T>,
  ): void;
}

export interface OnCategory {
  (categoryId: CategoryId | null): void;
}

export enum SearchSort {
  // no sort - just the default ordering of emoji
  None,
  // a sort taking into account a number of factors including, usage, closeness of match to the query, etc
  Default,
  // sort such that the most frequently used emoji come first, and then standard, service defined ordering is preserved.
  UsageFrequency,
}

export interface SearchOptions {
  skinTone?: number; // skin tone offset starting at 1
  limit?: number;
  sort?: SearchSort;
}

export interface EmojiSearchResult {
  emojis: EmojiDescription[];
  query?: string;
}

export type ToneSelection = number | undefined;

export interface EmojiUpload {
  name: string;
  shortName: string;
  filename: string;
  dataURL: string;
  width: number;
  height: number;
}

export interface User {
  id: string;
}

export type OptionalUser = User | undefined;

export type Message = React.ReactNode;

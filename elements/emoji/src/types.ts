import type { SyntheticEvent } from 'react';
import type { messages } from './components/i18n';
import type { CategoryId } from './components/picker/categories';
import type { Provider } from '@atlaskit/util-service-support/types';
import type { EmojiRepository } from './resource';

export type { CategoryId } from './components/picker/categories';

export interface EmojiProvider extends Provider<
	string,
	EmojiSearchResult,
	any,
	undefined,
	SearchOptions
> {
	/**
	 * Returns an immutable copy of EmojiDescription where mediaPath has token and client appended to url.
	 *
	 * Will allow emoji to render site emojis without needing to fail first
	 */

	/**
	 * Returns a list of all the non-standard categories with emojis in the EmojiRepository
	 * e.g. 'FREQUENT', 'ATLASSIAN' and 'CUSTOM'
	 */
	calculateDynamicCategories?(): Promise<string[]>;

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
	 * Returns the first fetched emoji matching the emojiId.id.
	 *
	 * If the interface is not defined it will fail gracefully to findByEmojiId
	 */
	fetchByEmojiId(
		emojiId: EmojiId,
		optimistic: boolean,
	): OptionalEmojiDescriptionWithVariations | Promise<OptionalEmojiDescriptionWithVariations>;

	/**
	 * Fetches and returns emojiResource
	 */
	fetchEmojiProvider(force?: boolean): Promise<EmojiRepository | undefined>;

	/**
	 * Returns the first matching emoji matching the emojiId.id.
	 *
	 * If not found or emojiId.id is undefined, fallback to a search by shortName.
	 *
	 * Will load media api images before returning.
	 */
	findByEmojiId(emojiId: EmojiId): OptionalEmojiDescription | Promise<OptionalEmojiDescription>;

	/**
	 * Return the emoji that matches the supplied id or undefined. As with findByEmojiId, this call should load
	 * the media api images before returning.
	 */
	findById(id: string): OptionalEmojiDescription | Promise<OptionalEmojiDescription>;

	/**
	 * Returns the first matching emoji matching the shortName, or null if none found.
	 *
	 * Will load media api images before returning.
	 */
	findByShortName(shortName: string): OptionalEmojiDescription | Promise<OptionalEmojiDescription>;

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
	 * Returns the logged user passed by the Product
	 */
	getCurrentUser(): OptionalUser;

	/**
	 * Returns, in a Promise, an array of the most frequently used emoji, ordered from most frequent to least frequent.
	 * If there is no frequently used data then an empty array should be returned.
	 *
	 * @param options supply options to be applied to the request.
	 */
	getFrequentlyUsed(options?: SearchOptions): Promise<EmojiDescription[]>;

	getMediaEmojiDescriptionURLWithInlineToken(emoji: EmojiDescription): Promise<EmojiDescription>;

	/**
	 * Returns a constructed URL to fetch emoji media asset if 'optimisticImageApi' config has been provided
	 */
	getOptimisticImageURL(emojiId: EmojiId): string | undefined;

	/**
	 * Used by the picker and typeahead to obtain a skin tone preference
	 * if the user has previously selected one via the Tone Selector
	 */
	getSelectedTone(): ToneSelection;

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
	 * @return a boolean indicating whether providers should be fetched on-demand only, and automatic fetches prevented
	 *
	 * Optional.
	 */
	onlyFetchOnDemand?(): boolean;

	/**
	 * Indicates if media emoji should be rendered optimistically,
	 * i.e. assume the url can be rendered directly from the URL, and
	 * only explicitly loaded via loadEmojiImageData if it fails to load.
	 *
	 * If useAlt is provided, the altRepresentation image URL is used
	 */
	optimisticMediaRendering(emoji: EmojiDescription, useAlt?: boolean): boolean;

	/**
	 * Records an emoji selection, for example for using in tracking recent emoji.
	 * If no recordConfig is configured then a resolved promise should be returned
	 *
	 * Optional.
	 */
	recordSelection?(emoji: EmojiDescription): Promise<any>;

	/**
	 * Used by Tone Selector to indicate to the provider that the user
	 * has selected a skin tone preference that should be remembered
	 */
	setSelectedTone(tone: ToneSelection): void;
}

export interface UploadingEmojiProvider extends EmojiProvider {
	/**
	 * Returns true if upload is supported.
	 *
	 * Waits until resources have loaded before returning.
	 */
	isUploadSupported(): Promise<boolean>;

	/**
	 * Allows the preloading of data (e.g. authentication tokens) to speed the uploading of emoji.
	 */
	prepareForUpload(): Promise<void>;

	/**
	 * Uploads an emoji to the configured repository.
	 *
	 * Will return a promise with the EmojiDescription once completed.
	 *
	 * The last search will be re-run to ensure the new emoji is considered in the search.
	 */
	uploadCustomEmoji(upload: EmojiUpload, retry?: boolean): Promise<EmojiDescription>;
}

export type RelativePosition = 'above' | 'below' | 'auto';

export type PickerSize = 'small' | 'medium' | 'large';

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
	fallback?: string;
	id?: string;
	shortName: string;
}

export interface SpriteSheet {
	column: number;
	height: number;
	row: number;
	url: string;
	width: number;
}

export interface EmojiImageRepresentation {
	height: number;
	width: number;
}

export interface SpriteImageRepresentation extends EmojiImageRepresentation {
	x: number;
	xIndex: number;
	y: number;
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
	altRepresentation?: EmojiRepresentation;
	ascii?: string[];
	category: string;
	createdDate?: string;
	creatorUserId?: string;
	name?: string;
	order?: number;
	representation: EmojiRepresentation;
	searchable: boolean;
	type: string;
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
export type OptionalEmojiDescriptionWithVariations = EmojiDescriptionWithVariations | undefined;

export type EmojiServiceRepresentation = SpriteServiceRepresentation | ImageRepresentation;

export interface EmojiServiceDescription {
	altRepresentations?: AltRepresentations;
	ascii?: string[];
	category: string;
	createdDate?: string;
	creatorUserId?: string;
	fallback?: string;
	id: string;
	name?: string;
	order?: number;
	representation: EmojiServiceRepresentation;
	searchable: boolean;
	shortName: string;
	type: string;
}

export interface EmojiServiceDescriptionWithVariations extends EmojiServiceDescription {
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
	clientId: string;
	collectionName: string;
	expiresAt: number; // seconds since Epoch UTC
	jwt: string;
	url: string;
}

export interface EmojiMeta {
	mediaApiToken?: MediaApiToken;
	spriteSheets?: SpriteSheets;
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
	icon: any;
	id: string;
	name: keyof typeof messages;
	order: number;
}

export interface OnToneSelected {
	(variation: ToneValueType): void;
}

export interface OnToneSelectorCancelled {
	(): void;
}

export interface OnEmojiEvent<T = any> {
	(emojiId: EmojiId, emoji: OptionalEmojiDescription, event?: SyntheticEvent<T>): void;
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

export enum SearchSourceTypes {
	PICKER = 'picker',
	TYPEAHEAD = 'typeahead',
}

export interface SearchOptions {
	limit?: number;
	skinTone?: number; // skin tone offset starting at 1
	sort?: SearchSort;
	source?: SearchSourceTypes; // only used for analytics
}

export interface EmojiSearchResult {
	emojis: EmojiDescription[];
	query?: string;
}

export type ToneSelection = number | undefined;

export interface EmojiUpload {
	dataURL: string;
	filename: string;
	height: number;
	name: string;
	shortName: string;
	width: number;
}

export interface User {
	id: string;
}

export type OptionalUser = User | undefined;

export type Message = React.ReactNode | string;

export enum ProviderTypes {
	SITE = 'SITE',
	STANDARD = 'STANDARD',
	ATLASSIAN = 'ATLASSIAN',
	UNKNOWN = 'UNKNOWN',
	SINGLE = 'SINGLE',
}

export enum UfoExperienceName {
	EMOJI_RENDERED = 'emoji-rendered',
	EMOJI_RESOURCE_FETCHED = 'emoji-resource-fetched',
	EMOJI_PICKER_OPENED = 'emoji-picker-opened',
	EMOJI_SELECTION_RECORDED = 'emoji-selection-recorded',
	EMOJI_UPLOADED = 'emoji-uploaded',
	EMOJI_SEARCHED = 'emoji-searched',
}

export enum UfoComponentName {
	EMOJI = 'emoji',
	EMOJI_PICKER = 'emoji-picker',
	EMOJI_PROVIDER = 'emoji-provider',
}

export enum UfoEmojiTimingsKeys {
	FMP = 'fmp',
	MOUNTED = 'emoji-mount',
	METADATA = 'emoji-metadata',
	MEDIADATA = 'emoji-media',
	ONLOAD = 'emoji-onload',
}

export enum UfoEmojiTimings {
	FMP_END = 'fmp',
	MOUNTED_END = 'emoji-mount_end',
	METADATA_START = 'emoji-metadata_start',
	METADATA_END = 'emoji-metadata_end',
	MEDIA_START = 'emoji-media_start',
	MEDIA_END = 'emoji-media_end',
	ONLOAD_START = 'emoji-onload_start',
	ONLOAD_END = 'emoji-onload_end',
}

export type ToneValueType = number;

/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

import { type ServiceConfig } from '@atlaskit/util-service-support';

import { type EmojiId } from '../types';

export interface EmojiLoaderConfig extends ServiceConfig {
	getRatio?: () => number;
}

export interface Options {
	onlyFetchOnDemand?: boolean;
}

export interface SingleEmojiApiLoaderConfig extends Omit<ServiceConfig, 'url'> {
	getUrl: (emojiId: EmojiId) => string;
}

export interface OptimisticImageApiLoaderConfig extends Omit<ServiceConfig, 'url'> {
	getUrl: (emojiId: EmojiId) => string;
}

export type EmojiLoadSuccessCallback = (emojiId?: string) => void;

export type EmojiLoadFailCallback = (emojiId?: string, reason?: string) => void;

/**
 * @deprecated Use `import { emojiRequest } from '@atlaskit/emoji/emoji-utils'` instead.
 */
export { emojiRequest } from './emojiRequest';
/**
 * @deprecated Use `import { getPixelRatio } from '@atlaskit/emoji/emoji-utils'` instead.
 */
export { getPixelRatio } from './getPixelRatio';
/**
 * @deprecated Use `import { getAltRepresentation } from '@atlaskit/emoji/emoji-utils'` instead.
 */
export { getAltRepresentation } from './getAltRepresentation';
/**
 * @deprecated Use `import { isMediaApiUrl } from '@atlaskit/emoji/emoji-utils'` instead.
 */
export { isMediaApiUrl } from './isMediaApiUrl';
/**
 * @deprecated Use `import { denormaliseServiceRepresentation } from '@atlaskit/emoji/emoji-utils'` instead.
 */
export { denormaliseServiceRepresentation } from './denormaliseServiceRepresentation';
/**
 * @deprecated Use `import { denormaliseServiceAltRepresentation } from '@atlaskit/emoji/emoji-utils'` instead.
 */
export { denormaliseServiceAltRepresentation } from './denormaliseServiceAltRepresentation';
/**
 * @deprecated Use `import { denormaliseSkinEmoji } from '@atlaskit/emoji/emoji-utils'` instead.
 */
export { denormaliseSkinEmoji } from './denormaliseSkinEmoji';
/**
 * @deprecated Use `import { denormaliseEmojiServiceResponse } from '@atlaskit/emoji/emoji-utils'` instead.
 */
export { denormaliseEmojiServiceResponse } from './denormaliseEmojiServiceResponse';
/**
 * @deprecated Use `import { shouldUseAltRepresentation } from '@atlaskit/emoji/emoji-utils'` instead.
 */
export { shouldUseAltRepresentation } from './shouldUseAltRepresentation';
/**
 * @deprecated Use `import { calculateScale } from '@atlaskit/emoji/emoji-utils'` instead.
 */
export { calculateScale } from './calculateScale';
/**
 * @deprecated Use `import { denormaliseStandardRepresentation } from '@atlaskit/emoji/emoji-utils'` instead.
 */
export { denormaliseStandardRepresentation } from './denormaliseStandardRepresentation';

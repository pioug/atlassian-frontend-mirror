/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

export { AbstractResource } from '@atlaskit/util-service-support';
/**
 * @deprecated Use `import { EmojiResource } from '@atlaskit/emoji/emoji-resource'` instead.
 */
export { default as EmojiResource } from './api/EmojiResource';
/**
 * @deprecated Use `import type { EmojiProvider, UploadingEmojiProvider, EmojiResourceConfig, OnEmojiProviderChange } from '@atlaskit/emoji/emoji-resource'` instead.
 */
export type {
	EmojiProvider,
	UploadingEmojiProvider,
	EmojiResourceConfig,
	OnEmojiProviderChange,
} from './api/EmojiResource';
export type { EmojiProviderLookupOrder } from './types';
/**
 * @deprecated Use `import type { EmojiLoadSuccessCallback, EmojiLoadFailCallback } from '@atlaskit/emoji/emoji-utils'` instead.
 */
export type { EmojiLoadSuccessCallback, EmojiLoadFailCallback } from './api/EmojiUtils';
/**
 * @deprecated Use `import EmojiRepository from '@atlaskit/emoji/emoji-repository'` instead.
 */
export { default as EmojiRepository } from './api/EmojiRepository';
/**
 * @deprecated Use `import EmojiLoader from '@atlaskit/emoji/emoji-loader'` instead.
 */
export { default as EmojiLoader } from './api/EmojiLoader';

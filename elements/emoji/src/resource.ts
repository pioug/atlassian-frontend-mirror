export { AbstractResource } from '@atlaskit/util-service-support';
export { default as EmojiResource } from './api/EmojiResource';
export type {
	EmojiProvider,
	UploadingEmojiProvider,
	EmojiResourceConfig,
	OnEmojiProviderChange,
} from './api/EmojiResource';
export type { EmojiLoadSuccessCallback, EmojiLoadFailCallback } from './api/EmojiUtils';
export { default as EmojiRepository } from './api/EmojiRepository';
export { default as EmojiLoader } from './api/EmojiLoader';

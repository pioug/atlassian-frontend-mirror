import type { EmojiUpload, EmojiDescription, User } from '@atlaskit/emoji/types';

export interface PromiseBuilder<R> {
	(result: R, context: string): Promise<R>;
}

export interface UploadDetail {
	emoji: EmojiDescription;
	upload: EmojiUpload;
}

export interface MockEmojiResourceConfig {
	currentUser?: User;
	optimisticRendering?: boolean;
	promiseBuilder?: PromiseBuilder<any>;
	uploadError?: string;
	uploadSupported?: boolean;
}

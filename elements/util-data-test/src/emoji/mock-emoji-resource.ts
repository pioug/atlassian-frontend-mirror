import { type UploadingEmojiProvider, type EmojiRepository } from '@atlaskit/emoji/resource';
import {
	type EmojiDescription,
	type EmojiId,
	type EmojiUpload,
	type OptionalEmojiDescriptionWithVariations,
} from '@atlaskit/emoji/types';
import { emojiFromUpload } from './emoji-from-upload';
import { MockNonUploadingEmojiResource } from './mock-non-uploading-emoji-resource';
import { type MockEmojiResourceConfig, type UploadDetail } from './types';

export class MockEmojiResource
	extends MockNonUploadingEmojiResource
	implements UploadingEmojiProvider
{
	private uploads: UploadDetail[] = [];
	private uploadSupported: boolean;
	private uploadError?: string;

	constructor(emojiService: EmojiRepository, config?: MockEmojiResourceConfig) {
		super(emojiService, config);
		this.uploadSupported = false;
		if (config) {
			this.uploadSupported = !!config.uploadSupported;
			this.uploadError = config.uploadError;
		}
	}

	async getMediaEmojiDescriptionURLWithInlineToken(
		emoji: EmojiDescription,
	): Promise<EmojiDescription> {
		if (this.promiseBuilder) {
			return this.promiseBuilder(emoji, 'getMediaEmojiDescriptionURLWithInlineToken');
		}
		return emoji;
	}

	async fetchEmojiProvider(force?: boolean): Promise<EmojiRepository | undefined> {
		return Promise.resolve(this.emojiRepository);
	}

	public async fetchByEmojiId(
		emojiId: EmojiId,
		optimistic: boolean,
	): Promise<OptionalEmojiDescriptionWithVariations> {
		return this.findByEmojiId(emojiId);
	}

	public getOptimisticImageURL(emojiId: EmojiId) {
		return undefined;
	}

	isUploadSupported(): Promise<boolean> {
		return this.promiseBuilder(this.uploadSupported, 'isUploadSupported');
	}

	uploadCustomEmoji(upload: EmojiUpload) {
		if (this.uploadError) {
			return Promise.reject(this.uploadError);
		}
		const emoji = emojiFromUpload(upload);
		this.uploads.push({
			upload,
			emoji,
		});
		this.emojiRepository.addUnknownEmoji(emoji);
		this.filter(this.lastQuery);
		return this.promiseBuilder(emoji, 'uploadCustomEmoji');
	}

	getUploads(): UploadDetail[] {
		return this.uploads;
	}

	prepareForUpload() {
		return Promise.resolve();
	}

	// Make public for testing
	notifyNotReady() {
		super.notifyNotReady();
	}

	loadMediaEmoji(emoji: EmojiDescription) {
		if (this.promiseBuilder) {
			return this.promiseBuilder(emoji, 'loadMediaEmoji');
		}
		return emoji;
	}
}

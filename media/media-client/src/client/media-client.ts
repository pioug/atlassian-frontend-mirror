import { EventEmitter2 } from 'eventemitter2';
import { ChunkHashAlgorithm, type MediaClientConfig } from '@atlaskit/media-core';
import { type MediaTraceContext } from '@atlaskit/media-common';
import {
	MediaStore as MediaApi,
	type MediaStoreGetFileImageParams,
	type ImageMetadata,
} from './media-store';
import { FileFetcherImpl, type FileFetcher } from './file-fetcher';
import { type UploadEventPayloadMap, type EventPayloadListener } from './events';
import { StargateClient } from './stargate-client';
import { type MobileUpload } from '../models/mobile-upload';

import { mediaStore, type MediaStore } from '@atlaskit/media-state';

export class MediaClient {
	public readonly mediaStore: MediaApi;
	public readonly file: FileFetcher;
	public readonly stargate: StargateClient;
	private readonly eventEmitter: EventEmitter2;
	// mobile upload is lazily loaded
	private mobileUpload?: MobileUpload;
	// Deprecated value introduced for backward compatibility with Context
	public readonly config: MediaClientConfig;

	constructor(
		readonly mediaClientConfig: MediaClientConfig,
		private readonly store: MediaStore = mediaStore,
		mediaApi?: MediaApi,
	) {
		this.mediaStore =
			mediaApi ??
			new MediaApi({
				authProvider: mediaClientConfig.authProvider,
				initialAuth: mediaClientConfig.initialAuth,
				chunkHashAlgorithm: ChunkHashAlgorithm.Sha256,
				authProviderTimeout: mediaClientConfig.authProviderTimeoutMs,
			});
		this.config = mediaClientConfig;
		this.file = new FileFetcherImpl(this.mediaStore, this.store);
		this.eventEmitter = new EventEmitter2();
		this.stargate = new StargateClient(mediaClientConfig.stargateBaseUrl);
	}

	/**
	 * @internal
	 */
	public __DO_NOT_USE__getMediaStore(): MediaStore {
		return this.store;
	}

	public getImage(
		id: string,
		params?: MediaStoreGetFileImageParams,
		controller?: AbortController,
		fetchMaxRes?: boolean,
		traceContext?: MediaTraceContext,
	): Promise<Blob> {
		return this.mediaStore.getImage(id, params, controller, fetchMaxRes, traceContext);
	}

	public getImageUrl(id: string, params?: MediaStoreGetFileImageParams): Promise<string> {
		return this.mediaStore.getFileImageURL(id, params);
	}

	public getImageUrlSync(id: string, params?: MediaStoreGetFileImageParams): string {
		return this.mediaStore.getFileImageURLSync(id, params);
	}

	public async getClientId(collectionName?: string): Promise<string | undefined> {
		return this.mediaStore.getClientId(collectionName);
	}

	public async getImageMetadata(
		id: string,
		params?: MediaStoreGetFileImageParams,
	): Promise<ImageMetadata> {
		return (await this.mediaStore.getImageMetadata(id, params)).metadata;
	}

	public async mobileUploadPromise(): Promise<MobileUpload> {
		if (this.mobileUpload) {
			return this.mobileUpload;
		}

		const module = await import(
			/* webpackChunkName: "@atlaskit-internal_media-client-mobile-upload" */ './mobile-upload'
		);

		this.mobileUpload = new module.MobileUploadImpl(this.mediaStore, this.store);
		return this.mobileUpload;
	}

	public async removeFileFromCollection(
		id: string,
		collectionName: string,
		occurrenceKey?: string,
		traceContext?: MediaTraceContext,
	): Promise<void> {
		await this.mediaStore.removeCollectionFile(id, collectionName, occurrenceKey, traceContext);
	}

	on<E extends keyof UploadEventPayloadMap>(
		event: E,
		listener: EventPayloadListener<UploadEventPayloadMap, E>,
	): void {
		this.eventEmitter.on(event, listener);
	}

	off<E extends keyof UploadEventPayloadMap>(
		event: E,
		listener: EventPayloadListener<UploadEventPayloadMap, E>,
	): void {
		this.eventEmitter.off(event, listener);
	}

	emit<E extends keyof UploadEventPayloadMap>(
		event: E,
		payload: UploadEventPayloadMap[E],
	): boolean {
		return this.eventEmitter.emit(event, payload);
	}
}

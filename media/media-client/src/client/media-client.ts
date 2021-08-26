import { EventEmitter2 } from 'eventemitter2';
import { MediaClientConfig } from '@atlaskit/media-core';
import { MediaFeatureFlags } from '@atlaskit/media-common';
import {
  MediaStore,
  MediaStoreGetFileImageParams,
  ImageMetadata,
} from './media-store';
import { CollectionFetcher } from './collection-fetcher';
import { FileFetcherImpl, FileFetcher } from './file-fetcher';
import { UploadEventPayloadMap, EventPayloadListener } from './events';
import { StargateClient } from './stargate-client';
import { MobileUpload } from '../models/mobile-upload';

export class MediaClient {
  public readonly mediaStore: MediaStore;
  public readonly collection: CollectionFetcher;
  public readonly file: FileFetcher;
  public readonly stargate: StargateClient;
  private readonly eventEmitter: EventEmitter2;
  // mobile upload is lazily loaded
  private mobileUpload?: MobileUpload;
  // Deprecated value introduced for backward compatibility with Context
  public readonly config: MediaClientConfig;

  constructor(
    readonly mediaClientConfig: MediaClientConfig,
    readonly featureFlags?: MediaFeatureFlags,
  ) {
    this.mediaStore = new MediaStore(
      {
        authProvider: mediaClientConfig.authProvider,
      },
      featureFlags,
    );
    this.config = mediaClientConfig;
    this.collection = new CollectionFetcher(this.mediaStore);
    this.file = new FileFetcherImpl(this.mediaStore);
    this.eventEmitter = new EventEmitter2();
    this.stargate = new StargateClient(mediaClientConfig.stargateBaseUrl);
  }

  public getImage(
    id: string,
    params?: MediaStoreGetFileImageParams,
    controller?: AbortController,
    fetchMaxRes?: boolean,
  ): Promise<Blob> {
    return this.mediaStore.getImage(id, params, controller, fetchMaxRes);
  }

  public getImageUrl(
    id: string,
    params?: MediaStoreGetFileImageParams,
  ): Promise<string> {
    return this.mediaStore.getFileImageURL(id, params);
  }

  public getImageUrlSync(
    id: string,
    params?: MediaStoreGetFileImageParams,
  ): string {
    return this.mediaStore.getFileImageURLSync(id, params);
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

    this.mobileUpload = new module.MobileUploadImpl(this.mediaStore);
    return this.mobileUpload;
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

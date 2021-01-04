import { MediaClientConfig } from '@atlaskit/media-core';
import { CollectionFetcher } from '../collection-fetcher';
import { FileFetcher, FileFetcherImpl } from '../file-fetcher';

export class MediaClient {
  public readonly collection: CollectionFetcher;
  public readonly file: FileFetcher;

  constructor(readonly config: MediaClientConfig) {
    this.collection = new CollectionFetcher({} as any);
    this.file = new FileFetcherImpl({} as any);
  }

  public getImage = jest.fn();
  public getImageUrl = jest.fn();
  public getImageMetadata = jest.fn();
}

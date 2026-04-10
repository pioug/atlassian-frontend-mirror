import { type MediaClientConfig } from '@atlaskit/media-core';
import { type FileFetcher, FileFetcherImpl } from '../file-fetcher';

export class MediaClient {
	public readonly file: FileFetcher;

	constructor(readonly config: MediaClientConfig) {
		this.file = new FileFetcherImpl({} as any);
	}

	public getImage: jest.Mock<any, any, any> = jest.fn();
	public getImageUrl: jest.Mock<any, any, any> = jest.fn();
	public getImageMetadata: jest.Mock<any, any, any> = jest.fn();
}

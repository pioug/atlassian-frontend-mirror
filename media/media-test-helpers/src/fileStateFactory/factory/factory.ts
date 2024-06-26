import { tallImage } from '../../images';
import { dataURItoBlob } from '../../mockData';
import {
	type FileIdentifier,
	type FileState,
	MediaClient,
	createMediaSubject,
	type FileDetails,
} from '@atlaskit/media-client';
import { type ReplaySubject } from 'rxjs/ReplaySubject';
import { type MediaClientConfig } from '@atlaskit/media-core';
import { type MediaFeatureFlags } from '@atlaskit/media-common';
import {
	createFileState,
	type CreateFileStateOptions,
	type FileStateStatus,
} from './createFileState';
import { createFileDetails } from './helpers';
import { sleep } from '../../nextTick';

export type MediaClientMockOptions = {
	getImageDelay?: number;
	hasPreview?: boolean;
};
export class MediaClientMock extends MediaClient {
	private hasPreview = false;

	constructor(
		private observable: ReplaySubject<FileState>,
		mediaClientConfig: MediaClientConfig,
		featureFlags?: MediaFeatureFlags,
		private options: MediaClientMockOptions = {},
	) {
		super(mediaClientConfig);
		this.mockFileFetcher();
		this.setHasPreview(!!options.hasPreview);
	}

	public updateObserbable = (newObservable: ReplaySubject<FileState>) => {
		this.observable = newObservable;
	};

	public setHasPreview = (hasPreview: boolean) => {
		this.hasPreview = hasPreview;
	};

	public getImage = async () => {
		const { getImageDelay = 0 } = this.options;
		if (!this.hasPreview) {
			throw new Error('some error');
		}
		await sleep(getImageDelay);
		return dataURItoBlob(tallImage);
	};
	private mockFileFetcher = () => {
		this.file.getFileState = () => this.observable;
	};
}

const mockConfig = {
	authProvider: async () => ({
		clientId: 'some-client',
		token: 'some-token',
		baseUrl: 'some-url',
	}),
};

export type FileStateFactoryOptions = {
	fileDetails?: Partial<FileDetails>;
	mediaClientConfig?: MediaClientConfig;
	featureFlags?: MediaFeatureFlags;
	mediaClientMockOptions?: MediaClientMockOptions;
};

/**
 * A fake Media Client that provides a backdoor to inject
 * simulated file states. With this class, we can test several scenarios
 * without having to recreate them all in the backend.
 */
export class FileStateFactory {
	private fileDetails?: Partial<FileDetails>;
	public mediaClient: MediaClientMock;
	private observable: ReplaySubject<FileState>;

	constructor(
		private identifier: FileIdentifier,
		{
			fileDetails,
			mediaClientConfig = mockConfig,
			featureFlags,
			mediaClientMockOptions,
		}: FileStateFactoryOptions = {},
	) {
		this.fileDetails = fileDetails || createFileDetails(this.identifier.id);
		this.observable = createMediaSubject();
		this.mediaClient = new MediaClientMock(
			this.observable,
			mediaClientConfig,
			featureFlags,
			mediaClientMockOptions,
		);
	}

	public updateIdentifier = (identifier: FileIdentifier, fileDetails?: Partial<FileDetails>) => {
		this.identifier = identifier;
		this.fileDetails = fileDetails || createFileDetails(this.identifier.id);
		this.observable = createMediaSubject();
		this.mediaClient.updateObserbable(this.observable);
	};

	public subscription = {
		next: (fileState: FileState) => {
			this.observable.next(fileState);
		},
		error: (error: Error) => {
			this.observable.error(error);
		},
	};

	public createFileState = (status: FileStateStatus, options?: CreateFileStateOptions) =>
		createFileState(this.identifier.id, status, {
			...options,
			fileDetails: options?.fileDetails || this.fileDetails,
		});

	public next = (status: FileStateStatus, options?: CreateFileStateOptions) => {
		this.mediaClient.setHasPreview(!!options?.withRemotePreview);
		this.subscription.next(this.createFileState(status, options));
	};

	public error = (error: Error) => {
		this.subscription.error(error);
	};
}

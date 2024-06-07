import { Subscription } from 'rxjs/Subscription';
import { type ReplaySubject } from 'rxjs/ReplaySubject';
import { map } from 'rxjs/operators/map';
import uuid from 'uuid/v4';
// import setimmediate to temporary fix dataloader 2.0.0 bug
// @see https://github.com/graphql/dataloader/issues/249
import 'setimmediate';
import type Dataloader from 'dataloader';
import { type AuthProvider, authToOwner } from '@atlaskit/media-core';
import { downloadUrl } from '@atlaskit/media-common/downloadUrl';
import { type MediaFileArtifacts } from '@atlaskit/media-state';

import {
	MediaStore as MediaApi,
	type MediaStoreCopyFileWithTokenBody,
	type MediaStoreCopyFileWithTokenParams,
	type TouchedFiles,
	type TouchFileDescriptor,
} from '../media-store';
import {
	type GetFileOptions,
	isErrorFileState,
	isFinalFileState,
	isProcessingFileState,
	mapMediaFileToFileState,
	mapMediaItemToFileState,
} from '../../models/file-state';
import { type MediaFile } from '../../models/media';
import { FileFetcherError } from './error';
import { type UploadableFile, type UploadableFileUpfrontIds, uploadFile } from '../../uploader';
import { type UploadController } from '../../upload-controller';
import { getFileStreamsCache } from '../../file-streams-cache';
import { globalMediaEventEmitter } from '../../globalMediaEventEmitter';
import { RECENTS_COLLECTION } from '../../constants';
import isValidId from 'uuid-validate';
import {
	createFileDataloader,
	type DataloaderKey,
	type DataloaderResult,
} from '../../utils/createFileDataLoader';
import { getMediaTypeFromUploadableFile } from '../../utils/getMediaTypeFromUploadableFile';
import { overrideMediaTypeIfUnknown } from '../../utils/overrideMediaTypeIfUnknown';
import { convertBase64ToBlob } from '../../utils/convertBase64ToBlob';
import { toPromise, fromObservable, type MediaSubscribable } from '../../utils/mediaSubscribable';
import { getDimensionsFromBlob, type Dimensions } from '../../utils/getDimensionsFromBlob';
import { createMediaSubject } from '../../utils/createMediaSubject';
import {
	isMimeTypeSupportedByBrowser,
	getMediaTypeFromMimeType,
} from '@atlaskit/media-common/mediaTypeUtils';
import { shouldFetchRemoteFileStates } from '../../utils/shouldFetchRemoteFileStates';
import { PollingFunction } from '../../utils/polling';
import { isEmptyFile } from '../../utils/detectEmptyFile';
import { type MediaTraceContext } from '@atlaskit/media-common';
import {
	type ErrorFileState,
	type UploadingFileState,
	type FilePreview,
	type FileState,
	type ProcessingFileState,
	type MediaStore,
	mediaStore,
} from '@atlaskit/media-state';

import { getBooleanFF } from '@atlaskit/platform-feature-flags';

export type { FileFetcherErrorAttributes, FileFetcherErrorReason } from './error';
export { isFileFetcherError, FileFetcherError } from './error';

export interface CopySourceFile {
	id: string;
	collection?: string;
	authProvider: AuthProvider;
}

export interface CopyDestination extends MediaStoreCopyFileWithTokenParams {
	authProvider: AuthProvider;
	mediaStore?: MediaApi;
}

export interface CopyFileOptions {
	preview?: FilePreview | Promise<FilePreview>;
	mimeType?: string;
}

export type ExternalUploadPayload = {
	uploadableFileUpfrontIds: UploadableFileUpfrontIds;
	dimensions: Dimensions;
};

export interface FileFetcher {
	getFileState(id: string, options?: GetFileOptions): MediaSubscribable;
	getArtifactURL(
		artifacts: MediaFileArtifacts,
		artifactName: keyof MediaFileArtifacts,
		collectionName?: string,
	): Promise<string>;
	touchFiles(
		descriptors: TouchFileDescriptor[],
		collection?: string,
		traceContext?: MediaTraceContext,
	): Promise<TouchedFiles>;
	upload(
		file: UploadableFile,
		controller?: UploadController,
		uploadableFileUpfrontIds?: UploadableFileUpfrontIds,
		traceContext?: MediaTraceContext,
	): MediaSubscribable;
	uploadExternal(
		url: string,
		collection?: string,
		traceContext?: MediaTraceContext,
	): Promise<ExternalUploadPayload>;
	downloadBinary(id: string, name?: string, collectionName?: string): Promise<void>;
	getCurrentState(id: string, options?: GetFileOptions): Promise<FileState>;
	copyFile(
		source: CopySourceFile,
		destination: CopyDestination,
		options?: CopyFileOptions,
		traceContext?: MediaTraceContext,
	): Promise<MediaFile>;
	getFileBinaryURL(id: string, collectionName?: string, maxAge?: number): Promise<string>;
}

export class FileFetcherImpl implements FileFetcher {
	private readonly dataloader: Dataloader<DataloaderKey, DataloaderResult>;

	constructor(
		private readonly mediaApi: MediaApi,
		private readonly store: MediaStore = mediaStore,
	) {
		this.dataloader = createFileDataloader(mediaApi);
	}

	private getErrorFileState = (error: any, id: string, occurrenceKey?: string): ErrorFileState =>
		typeof error === 'string'
			? {
					status: 'error',
					id,
					reason: error,
					occurrenceKey,
					message: error,
				}
			: {
					status: 'error',
					id,
					reason: error?.reason,
					details: error?.attributes,
					occurrenceKey,
					message: error?.message,
				};

	private setFileState = (id: string, fileState: FileState) => {
		this.store.setState((state) => {
			state.files[id] = fileState;
		});
	};

	public getFileState(id: string, options: GetFileOptions = {}): MediaSubscribable {
		const { collectionName, occurrenceKey } = options;
		if (!isValidId(id)) {
			const subject = createMediaSubject<FileState>();
			const err = new FileFetcherError('invalidFileId', id, {
				collectionName,
				occurrenceKey,
			});
			const errorFileState: ErrorFileState = {
				status: 'error',
				id,
				reason: err?.reason,
				message: err?.message,
				occurrenceKey,
				details: err?.attributes,
			};

			subject.error(err);

			this.setFileState(id, errorFileState);

			return fromObservable(subject);
		}
		return fromObservable(
			getFileStreamsCache().getOrInsert(id, () => {
				const subject = this.createDownloadFileStream(id, collectionName);
				subject.subscribe({
					next: (fileState) => {
						this.setFileState(id, fileState);
					},
					error: (err) => {
						const errorFileState: ErrorFileState = this.getErrorFileState(err, id, occurrenceKey);
						this.setFileState(id, errorFileState);
					},
				});
				return subject;
			}),
		);
	}

	getCurrentState(id: string, options?: GetFileOptions): Promise<FileState> {
		return toPromise(this.getFileState(id, options));
	}

	public getArtifactURL(
		artifacts: MediaFileArtifacts,
		artifactName: keyof MediaFileArtifacts,
		collectionName?: string,
	): Promise<string> {
		return this.mediaApi.getArtifactURL(artifacts, artifactName, collectionName);
	}

	getFileBinaryURL(id: string, collectionName?: string, maxAge?: number): Promise<string> {
		return this.mediaApi.getFileBinaryURL(id, collectionName, maxAge);
	}

	// TODO: ----- ADD TICKET TO PASS TRACE ID to this.dataloader.load
	private createDownloadFileStream = (
		id: string,
		collectionName?: string,
		occurrenceKey?: string,
	): ReplaySubject<FileState> => {
		const subject = createMediaSubject<FileState>();
		const poll = new PollingFunction();

		// ensure subject errors if polling exceeds max iterations or uncaught exception in executor
		poll.onError = (error: Error) => subject.error(error);

		poll.execute(async () => {
			const response = await this.dataloader.load({
				id,
				collectionName,
			});

			if (!response) {
				throw new FileFetcherError('emptyItems', id, {
					collectionName,
					occurrenceKey,
				});
			}

			if (isEmptyFile(response)) {
				throw new FileFetcherError('zeroVersionFile', id, {
					collectionName,
					occurrenceKey,
				});
			}

			const fileState = mapMediaItemToFileState(id, response);
			subject.next(fileState);
			switch (fileState.status) {
				case 'processing':
					// the only case for continuing polling, otherwise this function is run once only
					poll.next();
					break;
				case 'processed':
					subject.complete();
					break;
			}
		});

		return subject;
	};

	public touchFiles(
		descriptors: TouchFileDescriptor[],
		collection?: string,
		traceContext?: MediaTraceContext,
	): Promise<TouchedFiles> {
		return this.mediaApi
			.touchFiles(
				{ descriptors },
				{
					collection,
				},
				traceContext,
			)
			.then(({ data }) => data);
	}

	private generateUploadableFileUpfrontIds(
		collection?: string,
		traceContext?: MediaTraceContext,
	): UploadableFileUpfrontIds {
		const id = uuid();
		const occurrenceKey = uuid();
		const touchFileDescriptor: TouchFileDescriptor = {
			fileId: id,
			occurrenceKey,
			collection,
		};

		const deferredUploadId = this.touchFiles([touchFileDescriptor], collection, traceContext).then(
			(touchedFiles) => touchedFiles.created[0].uploadId,
		);

		return {
			id,
			occurrenceKey,
			deferredUploadId,
		};
	}

	async uploadExternal(
		url: string,
		collection?: string,
		traceContext?: MediaTraceContext,
	): Promise<ExternalUploadPayload> {
		const uploadableFileUpfrontIds = this.generateUploadableFileUpfrontIds(
			collection,
			traceContext,
		);
		const { id, occurrenceKey } = uploadableFileUpfrontIds;
		const subject = createMediaSubject<FileState>();

		const deferredBlob = fetch(url)
			.then((response) => response.blob())
			.catch(() => undefined);
		const preview = new Promise<FilePreview>(async (resolve, reject) => {
			const blob = await deferredBlob;
			if (!blob) {
				reject('Could not fetch the blob');
			}

			resolve({ value: blob as Blob, origin: 'remote' });
		});
		const name = url.split('/').pop() || '';
		// we create a initial fileState with the minimum info that we have at this point
		const fileState: ProcessingFileState = {
			status: 'processing',
			name,
			size: 0,
			mediaType: 'unknown',
			mimeType: '',
			id,
			occurrenceKey,
			preview,
		};
		subject.next(fileState);
		// we save it into the cache as soon as possible, in case someone subscribes
		getFileStreamsCache().set(id, subject);
		this.setFileState(id, fileState);

		return new Promise<ExternalUploadPayload>(async (resolve, reject) => {
			const blob = await deferredBlob;
			if (!blob) {
				return reject('Could not download remote file');
			}

			const { type, size } = blob;
			const file: UploadableFile = {
				content: blob,
				mimeType: type,
				collection,
				name,
				size,
			};
			const mediaType = getMediaTypeFromMimeType(type);

			// we emit a richer state after the blob is fetched
			subject.next({
				status: 'processing',
				name,
				size,
				mediaType,
				mimeType: type,
				id,
				occurrenceKey,
				preview,
			});
			// we don't want to wait for the file to be upload
			this.upload(file, undefined, uploadableFileUpfrontIds, traceContext);

			let dimensions: Dimensions | undefined;
			try {
				dimensions = await getDimensionsFromBlob(mediaType, blob);
			} catch (error) {
				reject(error);
				return;
			}

			resolve({
				dimensions,
				uploadableFileUpfrontIds,
			});
		});
	}

	private getUploadingFileStateBase = (
		file: UploadableFile,
		upfrontId: UploadableFileUpfrontIds,
	) => {
		// TODO: DO not modify the input parameter 'content' attribute
		if (typeof file.content === 'string') {
			file.content = convertBase64ToBlob(file.content);
		}
		const {
			content,
			name = '', // name property is not available in base64 image
		} = file;
		const { id, occurrenceKey } = upfrontId;
		let preview: FilePreview | undefined;
		// TODO [MSW-796]: get file size for base64
		let size = 0;
		let mimeType = '';
		if (content instanceof Blob) {
			size = content.size;
			mimeType = content.type;
			if (
				isMimeTypeSupportedByBrowser(content.type) ||
				getBooleanFF('platform.media-svg-rendering')
			) {
				preview = {
					value: content,
					origin: 'local',
				};
			}
		}
		const mediaType = getMediaTypeFromUploadableFile(file);

		return {
			id,
			occurrenceKey,
			name,
			size,
			mediaType,
			mimeType,
			preview,
		};
	};

	public upload(
		file: UploadableFile,
		controller?: UploadController,
		uploadableFileUpfrontIds?: UploadableFileUpfrontIds,
		traceContext?: MediaTraceContext,
	): MediaSubscribable {
		const { collection } = file;

		const upfrontId =
			uploadableFileUpfrontIds || this.generateUploadableFileUpfrontIds(collection, traceContext);

		const { id, occurrenceKey } = upfrontId;

		const stateBase = this.getUploadingFileStateBase(file, upfrontId);

		const subject = createMediaSubject<FileState>();
		getFileStreamsCache().set(id, subject);

		const onProgress = (progress: number) => {
			const fileState: UploadingFileState = {
				status: 'uploading',
				...stateBase,
				progress,
			};

			subject.next(fileState);
			this.setFileState(id, fileState);
		};

		let processingSubscription: Subscription = new Subscription();

		const onUploadFinish = (error?: any) => {
			if (error) {
				const errorFileState: ErrorFileState = this.getErrorFileState(error, id, occurrenceKey);
				this.setFileState(id, errorFileState);
				return subject.error(error);
			}
			processingSubscription = this.createDownloadFileStream(id, collection, occurrenceKey)
				.pipe(
					map((remoteFileState) => ({
						// merges base state with remote state
						...stateBase,
						...remoteFileState,
						...overrideMediaTypeIfUnknown(remoteFileState, stateBase.mediaType),
					})),
				)
				.subscribe({
					next: (fileState: FileState) => {
						subject.next(fileState);
						this.setFileState(id, fileState);
					},
					error: (err) => {
						const errorFileState: ErrorFileState = this.getErrorFileState(err, id, occurrenceKey);
						subject.error(err);
						this.setFileState(id, errorFileState);
					},
					complete: subject.complete,
				});
		};

		const { cancel } = uploadFile(
			file,
			this.mediaApi,
			upfrontId,
			{
				onUploadFinish,
				onProgress,
			},
			traceContext,
		);

		controller?.setAbort(() => {
			cancel();
			// TODO: filestate should turn to "Aborted" or something.
			// Consider canceling an upload that is already finished
			processingSubscription.unsubscribe();
		});

		// We should report progress asynchronously, since this is what consumer expects
		// (otherwise in newUploadService file-converting event will be emitted before files-added)
		setTimeout(onProgress, 0, 0);

		return fromObservable(subject);
	}

	public async downloadBinary(id: string, name: string = 'download', collectionName?: string) {
		const url = await this.mediaApi.getFileBinaryURL(id, collectionName);
		downloadUrl(url, { name });

		globalMediaEventEmitter.emit('media-viewed', {
			fileId: id,
			isUserCollection: collectionName === RECENTS_COLLECTION,
			viewingLevel: 'download',
		});
	}

	public async copyFile(
		source: CopySourceFile,
		destination: CopyDestination,
		options: CopyFileOptions = {},
		traceContext?: MediaTraceContext,
	): Promise<MediaFile> {
		const { authProvider, collection: sourceCollection, id } = source;
		const {
			authProvider: destinationAuthProvider,
			collection: destinationCollectionName,
			replaceFileId,
			occurrenceKey,
		} = destination;
		const { preview, mimeType } = options;
		const mediaStore =
			destination.mediaStore ||
			new MediaApi({
				authProvider: destinationAuthProvider,
			});
		const owner = authToOwner(await authProvider({ collectionName: sourceCollection }));

		const body: MediaStoreCopyFileWithTokenBody = {
			sourceFile: {
				id,
				collection: sourceCollection,
				owner,
			},
		};

		const params: MediaStoreCopyFileWithTokenParams = {
			collection: destinationCollectionName,
			replaceFileId,
			occurrenceKey,
		};

		const cache = getFileStreamsCache();
		let processingSubscription: Subscription | undefined;

		try {
			const { data: copiedFile } = await mediaStore.copyFileWithToken(body, params, traceContext);

			// if we were passed a "mimeType", we propagate it into copiedFileWithMimeType
			const copiedFileWithMimeType: MediaFile = {
				...copiedFile,
				...(mimeType ? { mimeType } : undefined),
			};

			const { id: copiedId, mimeType: copiedMimeType } = copiedFileWithMimeType;

			// backend may return an "unknown" mediaType just after the copy
			// it's better to deduce it from "copiedMimeType" using getMediaTypeFromMimeType()
			const mediaType = copiedMimeType ? getMediaTypeFromMimeType(copiedMimeType) : 'unknown';

			const copiedFileState = mapMediaFileToFileState({
				data: copiedFileWithMimeType,
			});

			const fileCache = cache.get(copiedId);
			const subject = fileCache || createMediaSubject();

			// if we were passed a "preview", we propagate it into the copiedFileState
			const previewOverride = !isErrorFileState(copiedFileState) && !!preview ? { preview } : {};

			if (
				!isFinalFileState(copiedFileState) &&
				// mimeType should always be returned by "copyFileWithToken"
				// but in case it's not, we don't want to penalize "copyFile"
				copiedMimeType &&
				(await shouldFetchRemoteFileStates(mediaType, copiedMimeType, preview))
			) {
				const fileState: FileState = {
					...copiedFileState,
					...overrideMediaTypeIfUnknown(copiedFileState, mediaType),
					...previewOverride,
				};

				subject.next(fileState);
				this.setFileState(copiedId, fileState);

				processingSubscription = this.createDownloadFileStream(
					copiedId,
					destinationCollectionName,
					occurrenceKey,
				).subscribe({
					next: (remoteFileState) => {
						const fileState = {
							...remoteFileState,
							...overrideMediaTypeIfUnknown(remoteFileState, mediaType),
							...(!isErrorFileState(remoteFileState) && previewOverride),
						};

						this.setFileState(copiedId, fileState);
						return subject.next(fileState);
					},
					error: (err) => {
						const errorFileState: ErrorFileState = this.getErrorFileState(err, id, occurrenceKey);
						this.setFileState(copiedId, errorFileState);
						return subject.error(err);
					},
					complete: () => subject.complete(),
				});
			} else if (!isProcessingFileState(copiedFileState)) {
				const fileState = {
					...copiedFileState,
					...(!isErrorFileState(copiedFileState) && previewOverride),
				};
				subject.next(fileState);
				this.setFileState(copiedId, fileState);
			}

			if (!cache.has(copiedId)) {
				getFileStreamsCache().set(copiedId, subject);
			}

			return copiedFile;
		} catch (error) {
			if (processingSubscription) {
				processingSubscription.unsubscribe();
			}

			if (replaceFileId) {
				const fileCache = cache.get(replaceFileId);
				const replaceFileState = this.store.getState().files[replaceFileId];

				if (fileCache) {
					fileCache.error(error);
				} else {
					// Create a new subject with the error state for new subscriptions
					cache.set(id, createMediaSubject<FileState>(error as Error));
				}

				const key = replaceFileState ? replaceFileId : id;

				const errorFileState: ErrorFileState = this.getErrorFileState(error, id, occurrenceKey);

				this.setFileState(key, errorFileState);
			}

			throw error;
		}
	}
}

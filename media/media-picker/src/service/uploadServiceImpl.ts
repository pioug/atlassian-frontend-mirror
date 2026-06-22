// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import uuidV4 from 'uuid/v4';
import {
	UploadController,
	type TouchFileDescriptor,
	type UploadableFileUpfrontIds,
	type UploadableFile,
	type MediaType,
	type MediaClient,
	globalMediaEventEmitter,
	RequestError,
	type TouchedFiles,
} from '@atlaskit/media-client';
import { RECENTS_COLLECTION } from '@atlaskit/media-client/constants';
import { toFileReaderError } from '@atlaskit/media-client/hashing/file-reader-error';
import { EventEmitter2 } from 'eventemitter2';
import { type FileEmptyData, type MediaFile, type UploadParams } from '../types';

import { getPreviewFromImage } from '../util/getPreviewFromImage';
import { type MediaErrorName, type UploadRejectionData } from '../types';
import {
	type UploadService,
	type UploadServiceEventListener,
	type UploadServiceEventPayloadTypes,
} from './types';
import { LocalFileSource, type LocalFileWithSource } from '../service/types';
import { getPreviewFromBlob } from '../util/getPreviewFromBlob';
import {
	type MediaTraceContext,
	isMimeTypeSupportedByBrowser,
	getMediaTypeFromMimeType,
	getRandomTelemetryId,
} from '@atlaskit/media-common';
import { fg } from '@atlaskit/platform-feature-flags';

export interface CancellableFileUpload {
	mediaFile: MediaFile;
	file: File;
	source: LocalFileSource;
	cancel?: () => void;
}

const generateTraceContext = (): MediaTraceContext => ({
	traceId: getRandomTelemetryId(),
});

// Extracts the `DOMException` from a FileReader `ProgressEvent` (`target.error`).
// Bare `DOMException`s are `Error`s, so `onFileError` handles them before this.
const extractDomException = (error: unknown): DOMException | undefined => {
	const target = (error as { target?: { error?: unknown } } | null)?.target;
	return target?.error instanceof DOMException ? target.error : undefined;
};

// Defence-in-depth: turns a raw FileReader `ProgressEvent` into a real `Error`
// so analytics records the `DOMException` name instead of `{"isTrusted":true}`.
const normalizeUploadError = (error: unknown): Error | undefined => {
	const domException = extractDomException(error);
	return domException ? toFileReaderError(domException) : undefined;
};

export class UploadServiceImpl implements UploadService {
	private readonly userMediaClient?: MediaClient;
	private readonly emitter: EventEmitter2;
	private cancellableFilesUploads: { [key: string]: CancellableFileUpload };
	private fileRejectionHandler?: (rejectionData: UploadRejectionData) => void;
	private fileEmptyHandler?: (fileEmptyData: FileEmptyData) => void;

	constructor(
		private readonly tenantMediaClient: MediaClient,
		private tenantUploadParams: UploadParams,
		private readonly shouldCopyFileToRecents: boolean,
		private readonly maxUploadBatchSize = 255, // Max supported batch is 255. We parametrise it for testing purposes
		private readonly uploadBatchSize: number = 20,
		private readonly uploadBatchDelayMs: number = 1000,
	) {
		this.emitter = new EventEmitter2();
		this.cancellableFilesUploads = {};
	}

	setUploadParams(uploadParams: UploadParams): void {
		this.tenantUploadParams = uploadParams;
	}

	// Used for testing
	private createUploadController(): UploadController {
		return new UploadController();
	}

	addFiles(files: File[]): void {
		this.addFilesWithSource(
			files.map((file: File) => ({
				file,
				source: LocalFileSource.LocalUpload,
			})),
		);
	}

	addFile(file: File, replaceFileId?: string): void {
		this.addFilesWithSource([{ file, source: LocalFileSource.LocalUpload, replaceFileId }]);
	}

	async addFilesWithSource(
		files: LocalFileWithSource[],
		traceContext: MediaTraceContext = generateTraceContext(),
	): Promise<void> {
		const shouldBatchSequentially =
			this.uploadBatchSize &&
			this.uploadBatchSize > 0 &&
			fg('platform_media_picker_upload_batching');

		if (shouldBatchSequentially) {
			const batchSize = this.uploadBatchSize!;
			for (let i = 0; i < files.length; i += batchSize) {
				if (i > 0 && this.uploadBatchDelayMs > 0) {
					await new Promise<void>((resolve) => setTimeout(resolve, this.uploadBatchDelayMs));
				}
				await this.addFilesAndUpload(files.slice(i, i + batchSize), traceContext, true);
			}
		} else {
			const batches: Promise<void>[] = [];
			for (let iterator = 0; iterator < files.length; iterator += this.maxUploadBatchSize) {
				batches.push(
					this.addFilesAndUpload(
						files.slice(iterator, iterator + this.maxUploadBatchSize),
						traceContext,
					),
				);
			}
			await Promise.all(batches);
		}
	}

	isCancellableFileUpload(
		fileUpload: null | CancellableFileUpload,
	): fileUpload is CancellableFileUpload {
		return fileUpload !== null;
	}

	cancel(id?: string): void {
		if (id) {
			const cancellableFileUpload = this.cancellableFilesUploads[id];
			if (cancellableFileUpload && cancellableFileUpload.cancel) {
				cancellableFileUpload.cancel();
			}
		} else {
			Object.keys(this.cancellableFilesUploads).forEach((key) => {
				const cancellableFileUpload = this.cancellableFilesUploads[key];
				if (cancellableFileUpload.cancel) {
					cancellableFileUpload.cancel();
				}
			});
		}
	}

	on<E extends keyof UploadServiceEventPayloadTypes>(
		event: E,
		listener: UploadServiceEventListener<E>,
	): void {
		this.emitter.on(event, listener);
	}

	off<E extends keyof UploadServiceEventPayloadTypes>(
		event: E,
		listener: UploadServiceEventListener<E>,
	): void {
		this.emitter.off(event, listener);
	}

	private async addFilesAndUpload(
		files: LocalFileWithSource[],
		traceContext: MediaTraceContext,
		awaitUploadCompletion = false,
	): Promise<void> {
		if (files.length === 0) {
			return;
		}

		const creationDate = Date.now();

		const { userMediaClient, tenantMediaClient, shouldCopyFileToRecents } = this;
		const mediaClient = shouldCopyFileToRecents ? tenantMediaClient : userMediaClient;

		const { collection: collectionTentant, expireAfter } = this.tenantUploadParams;

		const collection = shouldCopyFileToRecents ? collectionTentant : RECENTS_COLLECTION;

		if (!mediaClient) {
			return;
		}

		const touchFileDescriptors: (TouchFileDescriptor & {
			occurrenceKey: string;
		})[] = [];
		for (let i = 0; i < files.length; i++) {
			const { replaceFileId, file } = files[i];
			touchFileDescriptors.push({
				// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
				fileId: replaceFileId || uuidV4(),
				// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
				occurrenceKey: uuidV4(),
				collection,
				size: file.size,
				expireAfter,
			});
		}

		let touchedFiles: TouchedFiles;
		let caughtError: unknown;
		try {
			touchedFiles = await mediaClient.file.touchFiles(
				touchFileDescriptors,
				collection,
				traceContext,
			);
		} catch (error) {
			caughtError = error;
		}

		const uploadCompletions: Promise<void>[] = [];

		const cancellableFileUploads: (null | CancellableFileUpload)[] = files.map(
			({ file, source }, i) => {
				const { fileId: id, occurrenceKey } = touchFileDescriptors[i];

				// exclude rejected files from being uploaded
				const rejectedFile = touchedFiles?.rejected?.find(
					({ fileId: rejectedFileId }) => rejectedFileId === id,
				);
				if (rejectedFile) {
					if (this.fileRejectionHandler) {
						this.fileRejectionHandler({
							reason: 'fileSizeLimitExceeded',
							fileName: file.name,
							limit: rejectedFile.error.limit,
						});
					}
					return null;
				}

				// exclude empty files from being uploaded
				if (file.size === 0) {
					if (this.fileEmptyHandler) {
						this.fileEmptyHandler({
							reason: 'fileEmpty',
							fileName: file.name,
						});
					}
					return null;
				}

				const touchedFile = touchedFiles?.created.find((touchedFile) => touchedFile.fileId === id);

				let deferredUploadId: Promise<string>;
				const isIdConflictError =
					caughtError instanceof RequestError && caughtError.metadata?.statusCode === 409;
				if (touchedFile) {
					deferredUploadId = Promise.resolve(touchedFile.uploadId);
				} else if (isIdConflictError) {
					// will occur when the backend receives a fileId that already exists in which case
					// we will create a single upload session for that file and use that uploadId
					deferredUploadId = mediaClient.mediaStore
						.createUpload(1, collection, traceContext)
						.then((res) => {
							return res.data[0].id;
						});
				} else {
					// in the case of unexpected errors, we want to defer the throwing of the error
					// until after the files-added has been emitted,
					// allows editor to show a broken media card for unexpected errors
					deferredUploadId = Promise.reject(caughtError);
				}

				const uploadableFile: UploadableFile = {
					collection,
					content: file,
					name: file.name,
					mimeType: file.type,
					size: file.size,
				};

				const uploadableUpfrontIds: UploadableFileUpfrontIds = {
					id,
					occurrenceKey,
					deferredUploadId,
				};

				const controller = this.createUploadController();
				const sourceFileObservable = mediaClient.file.upload(
					uploadableFile,
					controller,
					uploadableUpfrontIds,
					traceContext,
				);

				const mediaFile: MediaFile = {
					id,
					name: file.name,
					size: file.size,
					creationDate,
					type: file.type,
					occurrenceKey,
				};

				const cancellableFileUpload: CancellableFileUpload = {
					mediaFile,
					file,
					source,
					cancel: () => {
						// we can't do "cancellableFileUpload.cancel = controller.abort" because will change the "this" mediaClient
						controller.abort();
					},
				};

				let resolveUploadCompletion: (() => void) | undefined;
				if (awaitUploadCompletion) {
					uploadCompletions.push(
						new Promise<void>((resolve) => {
							resolveUploadCompletion = resolve;
						}),
					);
				}

				const { unsubscribe } = sourceFileObservable.subscribe({
					next: (state) => {
						if (
							state.status === 'processing' ||
							state.status === 'processed' ||
							state.status === 'failed-processing'
						) {
							unsubscribe();
							if (shouldCopyFileToRecents) {
								mediaClient.emit('file-added', state);
								globalMediaEventEmitter.emit('file-added', state);
							}
							this.onFileSuccess(cancellableFileUpload, id, traceContext);
							resolveUploadCompletion?.();
						}
						if (state.status === 'error') {
							this.onFileError(
								mediaFile,
								'upload_fail',
								state.message || 'no-message',
								traceContext,
							);
							resolveUploadCompletion?.();
						}
					},
					error: (error) => {
						this.onFileError(mediaFile, 'upload_fail', error, traceContext);
						resolveUploadCompletion?.();
					},
				});

				this.cancellableFilesUploads[id] = cancellableFileUpload;

				return cancellableFileUpload;
			},
		);

		const filteredCancellableFileUploads = cancellableFileUploads.filter(
			this.isCancellableFileUpload,
		);

		const mediaFiles = filteredCancellableFileUploads.map(
			(cancellableFileUpload) => cancellableFileUpload.mediaFile,
		);

		this.emit('files-added', { files: mediaFiles, traceContext });
		this.emitPreviews(filteredCancellableFileUploads);

		if (awaitUploadCompletion && uploadCompletions.length > 0) {
			await Promise.allSettled(uploadCompletions);
		}
	}

	private readonly emit = <E extends keyof UploadServiceEventPayloadTypes>(
		event: E,
		payload: UploadServiceEventPayloadTypes[E],
	): void => {
		this.emitter.emit(event, payload);
	};

	private emitPreviews(cancellableFileUploads: CancellableFileUpload[]) {
		cancellableFileUploads.forEach((cancellableFileUpload) => {
			const { file, mediaFile, source } = cancellableFileUpload;
			const { type } = file;
			const mediaType = this.getMediaTypeFromFile(file);

			if (!isMimeTypeSupportedByBrowser(type)) {
				this.emit('file-preview-update', {
					file: mediaFile,
					preview: {},
				});
				return;
			}

			if (mediaType === 'image') {
				getPreviewFromImage(
					file,
					source === LocalFileSource.PastedScreenshot ? window.devicePixelRatio : undefined,
				).then((preview) => {
					this.emit('file-preview-update', {
						file: mediaFile,
						preview,
					});
				});
			} else {
				getPreviewFromBlob(mediaType, file)
					.then((preview) => {
						this.emit('file-preview-update', {
							file: mediaFile,
							preview,
						});
					})
					.catch(() =>
						this.emit('file-preview-update', {
							file: mediaFile,
							preview: {},
						}),
					);
			}
		});
	}

	private getMediaTypeFromFile(file: File): MediaType {
		const { type } = file;

		return getMediaTypeFromMimeType(type);
	}

	private releaseCancellableFile(mediaFile: MediaFile): void {
		delete this.cancellableFilesUploads[mediaFile.id];
	}

	private readonly onFileSuccess = async (
		cancellableFileUpload: CancellableFileUpload,
		fileId: string,
		traceContext?: MediaTraceContext,
	) => {
		const { mediaFile } = cancellableFileUpload;

		this.emit('file-converting', {
			file: mediaFile,
			traceContext,
		});

		cancellableFileUpload.cancel = () => {
			this.releaseCancellableFile(mediaFile);
		};
	};

	private readonly onFileError = (
		mediaFile: MediaFile,
		name: MediaErrorName,
		error: Error | string,
		traceContext?: MediaTraceContext,
	) => {
		this.releaseCancellableFile(mediaFile);

		if (error === 'canceled') {
			// Specific error coming from chunkinator via rejected fileId promise.
			// We do not want to trigger error in this case.
			return;
		}

		let description: string;
		let rawError: Error | undefined;
		if (error instanceof Error) {
			description = error.message;
			rawError = error;
		} else if (fg('platform_media_filereader_error_surfacing')) {
			rawError = normalizeUploadError(error);
			description = rawError?.message ?? (typeof error === 'string' ? error : 'unknown');
		} else {
			description = error;
			rawError = undefined;
		}

		this.emit('file-upload-error', {
			fileId: mediaFile.id,
			error: {
				fileId: mediaFile.id,
				name,
				description,
				rawError,
			},
			traceContext,
		});
	};

	onFileEmpty(handler: (fileEmptyData: FileEmptyData) => void): void {
		this.fileEmptyHandler = handler;
	}

	onFileRejection(handler: (rejectionData: UploadRejectionData) => void): void {
		this.fileRejectionHandler = handler;
	}
}

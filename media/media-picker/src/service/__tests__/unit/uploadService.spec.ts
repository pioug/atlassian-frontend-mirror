jest.mock('../../../util/getPreviewFromBlob');
jest.mock('../../../util/getPreviewFromImage');

jest.mock('uuid/v4', () => ({
	__esModule: true, // this property makes it work
	default: jest.fn().mockReturnValue('some-scope'),
}));

import {
	type MediaClient,
	type UploadableFile,
	createMediaSubject,
	type FileState,
} from '@atlaskit/media-client';
import {
	type TouchedFiles,
	type ProcessingFileState,
	fromObservable,
	RequestError,
} from '@atlaskit/media-client';
// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import uuidV4 from 'uuid/v4';
import { asMock, fakeMediaClient } from '@atlaskit/media-test-helpers';
import { UploadServiceImpl } from '../../uploadServiceImpl';
import * as getPreviewModule from '../../../util/getPreviewFromBlob';
import * as getPreviewFromImage from '../../../util/getPreviewFromImage';
import {
	type Preview,
	type UploadParams,
	type UploadPreviewUpdateEventPayload,
	type UploadsStartEventPayload,
} from '../../../types';
import { LocalFileSource, type LocalFileWithSource } from '../../../service/types';
import { waitFor } from '@testing-library/react';
import { ffTest } from '@atlassian/feature-flags-test-utils';

describe('UploadService', () => {
	const baseUrl = 'some-api-url';
	const usersClientId = 'some-users-collection-client-id';
	const usersToken = 'some-users-collection-client-id';
	const previewObject: Preview = { someImagePreview: true } as any;

	const file = {
		size: 100,
		name: 'some-filename',
		type: 'video/mp4',
	} as File;
	const localFileWithSource = {
		file,
		source: LocalFileSource.LocalUpload,
	} as LocalFileWithSource;

	const successfulTouchedFiles: TouchedFiles = {
		created: [
			{
				fileId: 'uuid1',
				uploadId: 'some-upload-id-uuid1',
			},
			{
				fileId: 'uuid3',
				uploadId: 'some-upload-id-uuid2',
			},
			{
				fileId: 'uuid5',
				uploadId: 'some-upload-id-uuid3',
			},
			{
				fileId: 'uuid7',
				uploadId: 'some-upload-id-uuid4',
			},
		],
		rejected: [],
	};

	const getMediaClient = (options = {}) =>
		fakeMediaClient({
			authProvider: () =>
				Promise.resolve({
					clientId: usersClientId,
					token: usersToken,
					baseUrl,
				}),
			...options,
		});

	const setup = (
		mediaClient: MediaClient = getMediaClient(),
		tenantUploadParams: UploadParams = { collection: '', expireAfter: 2 },
		shouldCopyFileToRecents: boolean = true,
		maxUploadBatchSize = 255,
	) => {
		asMock(mediaClient.file.touchFiles).mockResolvedValue(successfulTouchedFiles);
		const fileStateObservable = createMediaSubject();
		asMock(mediaClient.file.upload).mockReturnValue(fromObservable(fileStateObservable));

		(getPreviewFromImage.getPreviewFromImage as any).mockReturnValue(
			Promise.resolve(previewObject),
		);

		const uploadService = new UploadServiceImpl(
			mediaClient,
			tenantUploadParams,
			shouldCopyFileToRecents,
			maxUploadBatchSize,
		);

		const filesAddedPromise = new Promise<void>((resolve) =>
			uploadService.on('files-added', () => resolve()),
		);

		return {
			uploadService,
			filesAddedPromise,
			mediaClient,
			fileStateObservable,
		};
	};

	beforeEach(() => {
		(getPreviewModule.getPreviewFromBlob as any).mockReset();
		(getPreviewModule.getPreviewFromBlob as any).mockReturnValue(Promise.resolve());
		(uuidV4 as unknown as jest.Mock)
			.mockReturnValueOnce('uuid1')
			.mockReturnValueOnce('uuid2')
			.mockReturnValueOnce('uuid3')
			.mockReturnValueOnce('uuid4')
			.mockReturnValueOnce('uuid5')
			.mockReturnValueOnce('uuid6')
			.mockReturnValueOnce('uuid7')
			.mockReturnValue('uuidX');
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('setUploadParams', () => {
		it('should set new uploadParams', () => {
			const uploadService = new UploadServiceImpl(getMediaClient(), {}, false);

			uploadService.setUploadParams({
				collection: 'new-collection',
				expireAfter: 1,
			});

			expect(uploadService['tenantUploadParams']).toEqual({
				collection: 'new-collection',
				expireAfter: 1,
			});
		});
	});

	describe('addFiles', () => {
		it('should emit file-preview-update for video files', async () => {
			const { uploadService } = setup();

			const callback = jest.fn();
			uploadService.on('file-preview-update', callback);

			const previewObject: Preview = { someImagePreview: true } as any;
			(getPreviewModule.getPreviewFromBlob as any).mockReturnValue(Promise.resolve(previewObject));

			uploadService.addFiles([file]);

			await waitFor(() => {
				expect(callback).toHaveBeenCalled();
			});

			const expectedPayload: UploadPreviewUpdateEventPayload = {
				file: {
					creationDate: expect.any(Number),
					id: 'uuid1',
					name: 'some-filename',
					size: 100,
					type: 'video/mp4',
					occurrenceKey: expect.any(String),
				},
				preview: previewObject,
			};
			expect(callback).toHaveBeenCalledWith(expectedPayload);
		});

		it('should emit file-preview-update for image files', async () => {
			const { uploadService } = setup();
			const file = { size: 100, name: 'some-filename', type: 'image/png' };

			const callback = jest.fn();
			uploadService.on('file-preview-update', callback);

			uploadService.addFiles([file as File]);

			await waitFor(() => {
				expect(callback).toHaveBeenCalled();
			});

			const expectedPayload: UploadPreviewUpdateEventPayload = {
				file: {
					creationDate: expect.any(Number),
					id: 'uuid1',
					name: 'some-filename',
					size: 100,
					type: 'image/png',
					occurrenceKey: expect.any(String),
				},
				preview: previewObject,
			};
			expect(callback).toHaveBeenCalledWith(expectedPayload);
		});

		it('should emit empty file-preview-update for non native files', async () => {
			const { uploadService } = setup();
			const file = { size: 100, name: 'some-filename', type: 'video/3gpp' };

			const callback = jest.fn();
			uploadService.on('file-preview-update', callback);

			uploadService.addFiles([file as File]);

			await waitFor(() => {
				expect(callback).toHaveBeenCalled();
			});

			const expectedPayload: UploadPreviewUpdateEventPayload = {
				file: {
					creationDate: expect.any(Number),
					id: expect.any(String),
					name: 'some-filename',
					size: 100,
					type: 'video/3gpp',
					occurrenceKey: expect.any(String),
				},
				preview: {},
			};
			expect(callback).toHaveBeenCalledWith(expectedPayload);
		});

		it('should emit empty file-preview-update if getPreviewFromBlob() fails', (done) => {
			const { uploadService } = setup();
			const file = { size: 100, name: 'some-filename', type: 'video/mp4' };

			uploadService.on('file-preview-update', (payload) => {
				expect(payload).toMatchObject({
					file: {
						creationDate: expect.any(Number),
						id: expect.any(String),
						name: 'some-filename',
						size: 100,
						type: 'video/mp4',
						occurrenceKey: expect.any(String),
					},
					preview: {},
				});
				done();
			});

			(getPreviewModule.getPreviewFromBlob as any).mockReturnValue(
				Promise.reject(new Error('Something went wrong')),
			);

			uploadService.addFiles([file as File]);
			expect.assertions(1);
		});

		it('should use getPreviewFromBlob for non-image files when emitting preview', async () => {
			const { uploadService } = setup();
			const file = { size: 100, name: 'some-filename', type: 'video/mp4' };

			const callback = jest.fn();
			uploadService.on('file-preview-update', callback);

			(getPreviewModule.getPreviewFromBlob as any).mockReturnValue(
				Promise.resolve({ someImagePreview: true }),
			);

			uploadService.addFiles([file as File]);

			await waitFor(() => {
				expect(getPreviewModule.getPreviewFromBlob).toHaveBeenCalledWith('video', file);
			});
		});

		it('should not emit files-added if files is empty list', () => {
			const { uploadService } = setup();
			const filesAddedCallback = jest.fn();
			uploadService.on('files-added', filesAddedCallback);
			uploadService.addFiles([]);
			expect(filesAddedCallback).not.toHaveBeenCalled();
		});

		it('should emit files-added event with correct payload when addFiles() is called with multiple files', async () => {
			const { uploadService } = setup();
			const currentTimestamp = Date.now();
			const file2: File = {
				size: 10e7,
				name: 'some-other-filename',
				type: 'image/png',
			} as any;

			const filesAddedCallback = jest.fn();
			uploadService.on('files-added', filesAddedCallback);

			uploadService.addFiles([file, file2]);

			await waitFor(() => {
				expect(filesAddedCallback).toHaveBeenCalled();
			});

			const expectedPayload: UploadsStartEventPayload = {
				files: [
					{
						id: expect.any(String),
						creationDate: expect.any(Number),
						name: 'some-filename',
						size: 100,
						type: 'video/mp4',
						occurrenceKey: expect.any(String),
					},
					{
						id: expect.any(String),
						creationDate: expect.any(Number),
						name: 'some-other-filename',
						size: 100000000,
						type: 'image/png',
						occurrenceKey: expect.any(String),
					},
				],
				traceContext: expect.any(Object),
			};
			expect(filesAddedCallback).toHaveBeenCalledWith(expectedPayload);
			expect(filesAddedCallback.mock.calls[0][0].files[0].id).not.toEqual(
				filesAddedCallback.mock.calls[0][0].files[1].id,
			);
			expect(filesAddedCallback.mock.calls[0][0].files[0].creationDate).toBeGreaterThanOrEqual(
				currentTimestamp,
			);
			expect(filesAddedCallback.mock.calls[0][0].files[1].creationDate).toBeGreaterThanOrEqual(
				currentTimestamp,
			);
		});

		it('should call upload for each given file', async () => {
			const file2: File = {
				size: 10e7,
				name: 'some-other-filename',
				type: 'image/png',
			} as File;
			const { mediaClient, uploadService } = setup(undefined, {
				collection: 'some-collection',
			});
			uploadService.addFiles([file, file2]);
			const expectedUploadableFile2: UploadableFile = {
				collection: 'some-collection',
				content: file2,
				name: 'some-other-filename',
				mimeType: 'image/png',
				size: 10e7,
			};
			const expectedUploadableFile1: UploadableFile = {
				collection: 'some-collection',
				content: file,
				name: 'some-filename',
				mimeType: 'video/mp4',
				size: 100,
			};

			await waitFor(() => {
				expect(mediaClient.file.upload).toHaveBeenCalledTimes(2);
			});
			expect(asMock(mediaClient.file.upload).mock.calls[0][0]).toEqual(expectedUploadableFile1);
			expect(asMock(mediaClient.file.upload).mock.calls[1][0]).toEqual(expectedUploadableFile2);
		});

		it('should touch files in batches', async () => {
			const file2: File = {
				size: 10e7,
				name: 'some-other-filename',
				type: 'image/png',
			} as File;

			const file3: File = {
				size: 50e7,
				name: 'some-other-other-filename',
				type: 'image/png',
			} as File;

			const file4: File = {
				size: 40e7,
				name: 'some-other-other-other-filename',
				type: 'image/png',
			} as File;

			const maxUploadBatchSize = 3;
			const expireAfter = 100;
			const collection = 'some-collection';

			const { mediaClient, uploadService } = setup(
				undefined,
				{ collection, expireAfter },
				undefined,
				maxUploadBatchSize,
			);

			uploadService.addFiles([file, file2, file3, file4]);

			await waitFor(() => {
				expect(mediaClient.file.touchFiles).toHaveBeenCalledTimes(2);
			});

			const inputDescriptors0 = asMock(mediaClient.file.touchFiles).mock.calls[0][0];
			expect(inputDescriptors0).toHaveLength(3);
			expect(inputDescriptors0).toEqual([
				{
					fileId: expect.any(String),
					occurrenceKey: expect.any(String),
					size: file.size,
					collection,
					expireAfter,
				},
				{
					fileId: expect.any(String),
					occurrenceKey: expect.any(String),
					size: file2.size,
					collection,
					expireAfter,
				},
				{
					fileId: expect.any(String),
					occurrenceKey: expect.any(String),
					size: file3.size,
					collection,
					expireAfter,
				},
			]);

			const input1 = asMock(mediaClient.file.touchFiles).mock.calls[1][0];
			expect(input1).toHaveLength(1);

			expect(input1).toEqual([
				{
					fileId: expect.any(String),
					occurrenceKey: expect.any(String),
					size: file4.size,
					collection,
					expireAfter,
				},
			]);

			// Trace context must be the same for all the calls
			const inputTrace0 = asMock(mediaClient.file.touchFiles).mock.calls[0][2];
			const inputTrace1 = asMock(mediaClient.file.touchFiles).mock.calls[1][2];
			expect(inputTrace0).toEqual(inputTrace1);
		});

		it('should add files in batches', async () => {
			const file2: File = {
				size: 10e7,
				name: 'some-other-filename',
				type: 'image/png',
			} as File;

			const file3: File = {
				size: 50e7,
				name: 'some-other-other-filename',
				type: 'image/png',
			} as File;

			const file4: File = {
				size: 40e7,
				name: 'some-other-other-other-filename',
				type: 'image/png',
			} as File;

			const maxUploadBatchSize = 3;
			const expireAfter = 100;
			const collection = 'some-collection';

			const { mediaClient, uploadService } = setup(
				undefined,
				{ collection, expireAfter },
				undefined,
				maxUploadBatchSize,
			);

			uploadService.addFilesWithSource(
				[file, file2, file3, file4].map((file) => ({
					file,
					source: LocalFileSource.LocalUpload,
				})),
			);

			await waitFor(() => {
				expect(mediaClient.file.touchFiles).toHaveBeenCalledTimes(2);
			});

			const inputDescriptors0 = asMock(mediaClient.file.touchFiles).mock.calls[0][0];
			expect(inputDescriptors0).toHaveLength(3);
			expect(inputDescriptors0).toEqual([
				{
					fileId: expect.any(String),
					occurrenceKey: expect.any(String),
					size: file.size,
					collection,
					expireAfter,
				},
				{
					fileId: expect.any(String),
					occurrenceKey: expect.any(String),
					size: file2.size,
					collection,
					expireAfter,
				},
				{
					fileId: expect.any(String),
					occurrenceKey: expect.any(String),
					size: file3.size,
					collection,
					expireAfter,
				},
			]);

			const input1 = asMock(mediaClient.file.touchFiles).mock.calls[1][0];
			expect(input1).toHaveLength(1);

			expect(input1).toEqual([
				{
					fileId: expect.any(String),
					occurrenceKey: expect.any(String),
					size: file4.size,
					collection,
					expireAfter,
				},
			]);

			// Trace context must be the same for all the calls
			const inputTrace0 = asMock(mediaClient.file.touchFiles).mock.calls[0][2];
			const inputTrace1 = asMock(mediaClient.file.touchFiles).mock.calls[1][2];
			expect(inputTrace0).toEqual(inputTrace1);
		});

		it.each(['processing', 'processed', 'failed-processing'])(
			'should emit once file-converting when uploadFile resolves with status %s',
			async (status) => {
				const mediaClient = getMediaClient();
				const { uploadService, fileStateObservable } = setup(mediaClient, {
					collection: 'some-collection',
				});
				const fileConvertingCallback = jest.fn();
				uploadService.on('file-converting', fileConvertingCallback);
				uploadService.addFiles([file]);

				const filesAddedCallback = jest.fn();
				uploadService.on('files-added', filesAddedCallback);
				await waitFor(() => expect(filesAddedCallback).toHaveBeenCalled());

				fileStateObservable.next({
					status: status,
					id: 'public-file-id',
				} as FileState);

				// Second file state should not trigger a new event
				fileStateObservable.next({
					status: status,
					id: 'public-file-id',
				} as FileState);

				expect(fileConvertingCallback).toHaveBeenCalledTimes(1);

				expect(fileConvertingCallback).toHaveBeenCalledWith({
					file: {
						id: expect.any(String),
						creationDate: expect.any(Number),
						name: 'some-filename',
						size: 100,
						type: 'video/mp4',
						occurrenceKey: expect.any(String),
					},
					traceContext: expect.any(Object),
				});
			},
		);

		it('should emit file-upload-error when uploadFile resolves with status error', async () => {
			const mediaClient = getMediaClient();
			const { uploadService, fileStateObservable } = setup(mediaClient, {
				collection: 'some-collection',
			});
			const fileConvertingCallback = jest.fn();
			uploadService.on('file-upload-error', fileConvertingCallback);
			uploadService.addFiles([file]);

			fileStateObservable.next({
				status: 'error',
				message: 'some error',
				id: 'public-file-id',
			} as FileState);

			await waitFor(() => {
				expect(fileConvertingCallback).toHaveBeenCalledTimes(1);
			});
			expect(fileConvertingCallback).toHaveBeenCalledWith({
				fileId: 'uuid1',
				error: {
					fileId: 'uuid1',
					name: 'upload_fail',
					description: 'some error',
				},
				traceContext: expect.any(Object),
			});
		});

		it('should emit file-upload-error when uploadFile fail', async () => {
			const mediaClient = getMediaClient();
			const { uploadService, fileStateObservable } = setup(mediaClient, {
				collection: 'some-collection',
			});
			const error = new Error('Some reason');
			const fileUploadErrorCallback = jest.fn();
			uploadService.on('file-upload-error', fileUploadErrorCallback);

			uploadService.addFiles([file]);

			fileStateObservable.error(error);

			await waitFor(() => {
				expect(fileUploadErrorCallback).toHaveBeenCalledWith({
					fileId: 'uuid1',
					error: {
						fileId: 'uuid1',
						name: 'upload_fail',
						description: 'Some reason',
						rawError: error,
					},
					traceContext: expect.any(Object),
				});
			});
		});

		describe('when the upload fails with a non-Error throwable (FileReader leak)', () => {
			const setupNonError = () => {
				const mediaClient = getMediaClient();
				const { uploadService, fileStateObservable } = setup(mediaClient, {
					collection: 'some-collection',
				});
				const fileUploadErrorCallback = jest.fn();
				uploadService.on('file-upload-error', fileUploadErrorCallback);
				uploadService.addFiles([file]);
				return { fileStateObservable, fileUploadErrorCallback };
			};

			ffTest.on(
				'platform_media_filereader_error_surfacing',
				'surfaces the underlying DOMException name',
				() => {
					it('surfaces the name from a FileReader ProgressEvent-like object', async () => {
						const { fileStateObservable, fileUploadErrorCallback } = setupNonError();

						const progressEventLike = {
							isTrusted: true,
							target: { error: new DOMException('not found', 'NotFoundError') },
						};
						fileStateObservable.error(progressEventLike as any);

						await waitFor(() => {
							expect(fileUploadErrorCallback).toHaveBeenCalledWith({
								fileId: 'uuid1',
								error: {
									fileId: 'uuid1',
									name: 'upload_fail',
									description: 'NotFoundError',
									rawError: expect.objectContaining({
										name: 'NotFoundError',
										message: 'NotFoundError',
									}),
								},
								traceContext: expect.any(Object),
							});
						});
					});

					it('falls back to "unknown" when no DOMException can be extracted', async () => {
						const { fileStateObservable, fileUploadErrorCallback } = setupNonError();

						fileStateObservable.error({ isTrusted: true } as any);

						await waitFor(() => {
							expect(fileUploadErrorCallback).toHaveBeenCalledWith({
								fileId: 'uuid1',
								error: {
									fileId: 'uuid1',
									name: 'upload_fail',
									description: 'unknown',
									rawError: undefined,
								},
								traceContext: expect.any(Object),
							});
						});
					});
				},
			);

			ffTest.off(
				'platform_media_filereader_error_surfacing',
				'passes the raw event through (legacy behaviour)',
				() => {
					it('leaves rawError undefined and passes the raw event as description', async () => {
						const { fileStateObservable, fileUploadErrorCallback } = setupNonError();

						const progressEventLike = {
							isTrusted: true,
							target: { error: new DOMException('cannot read', 'NotReadableError') },
						};
						fileStateObservable.error(progressEventLike as any);

						await waitFor(() => {
							expect(fileUploadErrorCallback).toHaveBeenCalledWith({
								fileId: 'uuid1',
								error: {
									fileId: 'uuid1',
									name: 'upload_fail',
									description: progressEventLike,
									rawError: undefined,
								},
								traceContext: expect.any(Object),
							});
						});
					});
				},
			);
		});

		it('should not call the file rejection handler when all uploads are successful', async () => {
			const { uploadService } = setup();

			const callback = jest.fn();
			uploadService.onFileRejection(callback);

			uploadService.addFiles([file]);

			expect(callback).not.toHaveBeenCalled();
		});

		it('should not call the file empty handler when all uploads are successful', async () => {
			const { uploadService } = setup();

			const callback = jest.fn();
			uploadService.onFileEmpty(callback);

			uploadService.addFiles([file]);

			expect(callback).not.toHaveBeenCalled();
		});

		it('should set deferredUploadId to correctly when a batch of upload sessions are successfully created', async () => {
			const { mediaClient, uploadService } = setup();

			uploadService.addFiles([file]);

			await waitFor(() => {
				expect(mediaClient.file.upload).toHaveBeenCalled();
			});

			const uploadId = await asMock(mediaClient.file.upload).mock.calls[0][2].deferredUploadId;
			expect(uploadId).toEqual('some-upload-id-uuid1');
		});

		it('should set deferredUploadId to the ID of a manually created upload session when an conflict error occurrs', async () => {
			const { mediaClient, uploadService } = setup();

			asMock(mediaClient.file.touchFiles).mockRejectedValueOnce(
				new RequestError('serverUnexpectedError', { statusCode: 409 }),
			);

			asMock(mediaClient.mediaStore.createUpload).mockResolvedValueOnce({
				data: [
					{
						id: 'manually-created-upload-id',
					},
				],
			} as any);

			uploadService.addFiles([file]);

			await waitFor(() => {
				expect(mediaClient.file.upload).toHaveBeenCalled();
			});

			const uploadId = await asMock(mediaClient.file.upload).mock.calls[0][2].deferredUploadId;
			expect(uploadId).toEqual('manually-created-upload-id');
		});

		it('should set deferredUploadId to a an error when an unexpected error occurrs', async () => {
			const { mediaClient, uploadService } = setup();

			const error = new Error('some error');
			mediaClient.file.touchFiles = jest.fn(() => Promise.reject(error));

			const fileStateObservable = createMediaSubject();
			mediaClient.file.upload = jest.fn(
				(file: any, controller?: any, uploadableFileUpfrontIds?: any) => {
					uploadableFileUpfrontIds?.deferredUploadId.catch(() => {});
					return fromObservable(fileStateObservable);
				},
			);

			uploadService.addFiles([file]);

			await waitFor(async () => {
				await expect(
					asMock(mediaClient.file.upload).mock.calls[0][2].deferredUploadId,
				).rejects.toThrow(error);
			});
		});
	});

	describe('FileSizeLimitExceeded in addFilesWithSource', () => {
		it('should emit file-preview-update only for successfully created files', async () => {
			const touchedFiles: TouchedFiles = {
				created: [
					{
						fileId: 'uuid1',
						uploadId: 'some-upload-id-uuid1',
					},
					{
						fileId: 'uuid3',
						uploadId: 'some-upload-id-uuid2',
					},
				],
				rejected: [
					{
						fileId: 'uuid5',
						error: {
							code: 'ExceedMaxFileSizeLimit',
							title: 'The expected file size exceeded the maximum size limit.',
							href: 'https://dt-api-filestore--app.ap-southeast-2.dev.atl-paas.net/api.html#BadRequest',
							limit: 100000,
							size: 100800,
						},
					},
					{
						fileId: 'uuid7',
						error: {
							code: 'ExceedMaxFileSizeLimit',
							title: 'The expected file size exceeded the maximum size limit.',
							href: 'https://dt-api-filestore--app.ap-southeast-2.dev.atl-paas.net/api.html#BadRequest',
							limit: 100000,
							size: 200000,
						},
					},
				],
			};
			const { mediaClient, uploadService } = setup();
			asMock(mediaClient.file.touchFiles).mockResolvedValue(touchedFiles);

			const callback = jest.fn();
			uploadService.on('file-preview-update', callback);

			const previewObject: Preview = { someImagePreview: true } as any;
			(getPreviewModule.getPreviewFromBlob as any).mockReturnValue(Promise.resolve(previewObject));

			const file2: File = {
				size: 10e7,
				name: 'file2-name',
				type: 'image/png',
			} as File;
			const file3: File = {
				size: 100800,
				name: 'file3-name',
				type: 'video/mp4',
			} as File;
			const file4: File = {
				size: 200000,
				name: 'file4-name',
				type: 'video/mp4',
			} as File;

			uploadService.addFiles([file, file2, file3, file4]);

			await waitFor(() => {
				expect(callback).toHaveBeenCalled();
			});

			const expectedPayload: UploadPreviewUpdateEventPayload = {
				file: {
					creationDate: expect.any(Number),
					id: 'uuid1',
					name: 'some-filename',
					size: 100,
					type: 'video/mp4',
					occurrenceKey: expect.any(String),
				},
				preview: previewObject,
			};
			expect(callback).toHaveBeenCalledWith(expectedPayload);
			expect(callback).toHaveBeenCalledWith({
				file: {
					creationDate: expect.any(Number),
					id: 'uuid3',
					name: 'file2-name',
					size: 10e7,
					type: 'image/png',
					occurrenceKey: expect.any(String),
				},
				preview: previewObject,
			});
			expect(callback).not.toHaveBeenCalledWith({
				file: {
					creationDate: expect.any(Number),
					id: 'uuid5',
					name: 'file3-name',
					size: 10e7,
					type: 'video/mp4',
					occurrenceKey: expect.any(String),
				},
				preview: previewObject,
			});
			expect(callback).not.toHaveBeenCalledWith({
				file: {
					creationDate: expect.any(Number),
					id: 'uuid7',
					name: 'file4-name',
					size: 10e7,
					type: 'video/mp4',
					occurrenceKey: expect.any(String),
				},
				preview: previewObject,
			});
		});

		it('should call file rejection handler when files are rejected', async () => {
			const touchedFiles: TouchedFiles = {
				created: [
					{
						fileId: 'uuid1',
						uploadId: 'some-upload-id-uuid1',
					},
					{
						fileId: 'uuid3',
						uploadId: 'some-upload-id-uuid2',
					},
				],
				rejected: [
					{
						fileId: 'uuid5',
						error: {
							code: 'ExceedMaxFileSizeLimit',
							title: 'The expected file size exceeded the maximum size limit.',
							href: 'https://dt-api-filestore--app.ap-southeast-2.dev.atl-paas.net/api.html#BadRequest',
							limit: 500,
							size: 1000,
						},
					},
					{
						fileId: 'uuid7',
						error: {
							code: 'ExceedMaxFileSizeLimit',
							title: 'The expected file size exceeded the maximum size limit.',
							href: 'https://dt-api-filestore--app.ap-southeast-2.dev.atl-paas.net/api.html#BadRequest',
							limit: 500,
							size: 10e7,
						},
					},
				],
			};
			const { mediaClient, uploadService } = setup();
			asMock(mediaClient.file.touchFiles).mockResolvedValue(touchedFiles);

			const callback = jest.fn();
			const rejectionCallback = jest.fn();
			uploadService.onFileRejection(rejectionCallback);
			uploadService.on('file-preview-update', callback);

			const previewObject: Preview = { someImagePreview: true } as any;
			(getPreviewModule.getPreviewFromBlob as any).mockReturnValue(Promise.resolve(previewObject));

			uploadService.addFiles([file, file, file, file]);

			await waitFor(() => {
				expect(rejectionCallback).toHaveBeenCalled();
			});

			expect(rejectionCallback).toHaveBeenNthCalledWith(1, {
				reason: 'fileSizeLimitExceeded',
				fileName: 'some-filename',
				limit: 500,
			});
			expect(rejectionCallback).toHaveBeenNthCalledWith(2, {
				reason: 'fileSizeLimitExceeded',
				fileName: 'some-filename',
				limit: 500,
			});
		});

		it('should not call file rejection handler when an unexpected error occurs', async () => {
			const { mediaClient, uploadService } = setup();

			const error = new Error('some error');
			mediaClient.file.touchFiles = jest.fn(() => Promise.reject(error));

			const fileStateObservable = createMediaSubject();
			mediaClient.file.upload = jest.fn(
				(file: any, controller?: any, uploadableFileUpfrontIds?: any) => {
					uploadableFileUpfrontIds?.deferredUploadId.catch(() => {});
					return fromObservable(fileStateObservable);
				},
			);

			const rejectionCallback = jest.fn();
			uploadService.onFileRejection(rejectionCallback);

			uploadService.addFiles([file]);

			expect(rejectionCallback).not.toHaveBeenCalled();
		});

		it('should not emit file-upload-error when files are rejected', async () => {
			const touchedFiles: TouchedFiles = {
				created: [
					{
						fileId: 'uuid1',
						uploadId: 'some-upload-id-uuid1',
					},
					{
						fileId: 'uuid3',
						uploadId: 'some-upload-id-uuid2',
					},
				],
				rejected: [
					{
						fileId: 'uuid5',
						error: {
							code: 'ExceedMaxFileSizeLimit',
							title: 'The expected file size exceeded the maximum size limit.',
							href: 'https://dt-api-filestore--app.ap-southeast-2.dev.atl-paas.net/api.html#BadRequest',
							limit: 500,
							size: 10e7,
						},
					},
					{
						fileId: 'uuid7',
						error: {
							code: 'ExceedMaxFileSizeLimit',
							title: 'The expected file size exceeded the maximum size limit.',
							href: 'https://dt-api-filestore--app.ap-southeast-2.dev.atl-paas.net/api.html#BadRequest',
							limit: 500,
							size: 10e7,
						},
					},
				],
			};
			const { mediaClient, uploadService } = setup();
			asMock(mediaClient.file.touchFiles).mockResolvedValue(touchedFiles);

			const fileUploadErrorCallback = jest.fn();
			uploadService.on('file-upload-error', fileUploadErrorCallback);

			uploadService.addFiles([file]);

			expect(fileUploadErrorCallback).not.toHaveBeenCalled();
		});

		it('should emit files-added only for successfully created files', async () => {
			const file2: File = {
				size: 200,
				name: 'some-other-filename',
				type: 'image/png',
			} as any;
			const fileOverSize: File = {
				size: 1000,
				name: 'over-size-filename',
				type: 'image/png',
			} as any;
			const touchedFiles: TouchedFiles = {
				created: [
					{
						fileId: 'uuid1',
						uploadId: 'some-upload-id-uuid1',
					},
					{
						fileId: 'uuid3',
						uploadId: 'some-upload-id-uuid2',
					},
				],
				rejected: [
					{
						fileId: 'uuid5',
						error: {
							code: 'ExceedMaxFileSizeLimit',
							title: 'The expected file size exceeded the maximum size limit.',
							href: 'https://dt-api-filestore--app.ap-southeast-2.dev.atl-paas.net/api.html#BadRequest',
							limit: 500,
							size: 1000,
						},
					},
				],
			};
			const { mediaClient, uploadService } = setup();
			const currentTimestamp = Date.now();

			asMock(mediaClient.file.touchFiles).mockResolvedValue(touchedFiles);
			const fileStateObservable = createMediaSubject();
			mediaClient.file.upload = jest.fn(
				(file: any, controller?: any, uploadableFileUpfrontIds?: any) => {
					uploadableFileUpfrontIds?.deferredUploadId.catch(() => {});
					return fromObservable(fileStateObservable);
				},
			);

			const filesAddedCallback = jest.fn();
			uploadService.on('files-added', filesAddedCallback);

			uploadService.addFiles([file, file2, fileOverSize]);

			await waitFor(() => {
				expect(filesAddedCallback).toHaveBeenCalled();
			});

			const expectedPayload: UploadsStartEventPayload = {
				files: [
					{
						id: expect.any(String),
						creationDate: expect.any(Number),
						name: 'some-filename',
						size: 100,
						type: 'video/mp4',
						occurrenceKey: expect.any(String),
					},
					{
						id: expect.any(String),
						creationDate: expect.any(Number),
						name: 'some-other-filename',
						size: 200,
						type: 'image/png',
						occurrenceKey: expect.any(String),
					},
				],
				traceContext: expect.any(Object),
			};
			expect(filesAddedCallback).toHaveBeenCalledWith(expectedPayload);
			expect(filesAddedCallback.mock.calls[0][0].files[0].id).not.toEqual(
				filesAddedCallback.mock.calls[0][0].files[1].id,
			);
			expect(filesAddedCallback.mock.calls[0][0].files[0].creationDate).toBeGreaterThanOrEqual(
				currentTimestamp,
			);
			expect(filesAddedCallback.mock.calls[0][0].files[1].creationDate).toBeGreaterThanOrEqual(
				currentTimestamp,
			);
		});

		it('should emit files-added for all files when an unexpected error occurs', async () => {
			const file2: File = {
				size: 200,
				name: 'some-other-filename',
				type: 'image/png',
			} as any;
			const fileOverSize: File = {
				size: 1000,
				name: 'over-size-filename',
				type: 'image/png',
			} as any;

			const { mediaClient, uploadService } = setup();
			const currentTimestamp = Date.now();

			const error = new Error('some error');
			mediaClient.file.touchFiles = jest.fn(() => Promise.reject(error));

			const fileStateObservable = createMediaSubject();
			mediaClient.file.upload = jest.fn(
				(file: any, controller?: any, uploadableFileUpfrontIds?: any) => {
					uploadableFileUpfrontIds?.deferredUploadId.catch(() => {});
					return fromObservable(fileStateObservable);
				},
			);

			const filesAddedCallback = jest.fn();
			uploadService.on('files-added', filesAddedCallback);

			uploadService.addFiles([file, file2, fileOverSize]);

			await waitFor(() => {
				expect(filesAddedCallback).toHaveBeenCalled();
			});

			const expectedPayload: UploadsStartEventPayload = {
				files: [
					{
						id: expect.any(String),
						creationDate: expect.any(Number),
						name: 'some-filename',
						size: 100,
						type: 'video/mp4',
						occurrenceKey: expect.any(String),
					},
					{
						id: expect.any(String),
						creationDate: expect.any(Number),
						name: 'some-other-filename',
						size: 200,
						type: 'image/png',
						occurrenceKey: expect.any(String),
					},
					{
						id: expect.any(String),
						creationDate: expect.any(Number),
						name: 'over-size-filename',
						size: 1000,
						type: 'image/png',
						occurrenceKey: expect.any(String),
					},
				],
				traceContext: expect.any(Object),
			};
			expect(filesAddedCallback).toHaveBeenCalledWith(expectedPayload);
			expect(filesAddedCallback.mock.calls[0][0].files[0].id).not.toEqual(
				filesAddedCallback.mock.calls[0][0].files[1].id,
			);
			expect(filesAddedCallback.mock.calls[0][0].files[0].creationDate).toBeGreaterThanOrEqual(
				currentTimestamp,
			);
			expect(filesAddedCallback.mock.calls[0][0].files[1].creationDate).toBeGreaterThanOrEqual(
				currentTimestamp,
			);
			expect(filesAddedCallback.mock.calls[0][0].files[2].creationDate).toBeGreaterThanOrEqual(
				currentTimestamp,
			);
		});
	});

	describe('FileEmpty in addFilesWithSource', () => {
		const emptyFile: File = {
			size: 0,
			name: 'emptyFile-name',
			type: 'image/png',
		} as File;

		const touchedFiles: TouchedFiles = {
			created: [
				{
					fileId: 'uuid1',
					uploadId: 'some-upload-id-uuid1',
				},
				{
					fileId: 'uuid2',
					uploadId: 'some-upload-id-uuid2',
				},
			],
		};

		it('should emit file-preview-update only for successfully created files', async () => {
			const { mediaClient, uploadService } = setup();

			asMock(mediaClient.file.touchFiles).mockResolvedValue(touchedFiles);

			const callback = jest.fn();
			uploadService.on('file-preview-update', callback);

			const previewObject: Preview = { someImagePreview: true } as any;
			(getPreviewModule.getPreviewFromBlob as any).mockReturnValue(Promise.resolve(previewObject));

			uploadService.addFiles([file, emptyFile]);

			await waitFor(() => {
				expect(callback).toHaveBeenCalled();
			});

			const expectedPayload: UploadPreviewUpdateEventPayload = {
				file: {
					creationDate: expect.any(Number),
					id: 'uuid1',
					name: 'some-filename',
					size: 100,
					type: 'video/mp4',
					occurrenceKey: expect.any(String),
				},
				preview: previewObject,
			};
			expect(callback).toHaveBeenCalledWith(expectedPayload);
			expect(callback).not.toHaveBeenCalledWith({
				file: {
					creationDate: expect.any(Number),
					id: 'uuid2',
					name: 'emptyFile-name',
					size: 0,
					type: 'image/png',
					occurrenceKey: expect.any(String),
				},
				preview: previewObject,
			});
		});

		it('should call file empty handler when file is empty i.e., zero bytes', async () => {
			const { uploadService } = setup();

			const callback = jest.fn();
			uploadService.onFileEmpty(callback);

			uploadService.addFiles([emptyFile]);

			await waitFor(() => {
				expect(callback).toHaveBeenCalled();
			});

			expect(callback).toHaveBeenNthCalledWith(1, {
				reason: 'fileEmpty',
				fileName: 'emptyFile-name',
			});
		});

		it('should not call file empty handler when an unexpected error occurs', async () => {
			const { mediaClient, uploadService } = setup();

			const error = new Error('some error');
			mediaClient.file.touchFiles = jest.fn(() => Promise.reject(error));

			const fileStateObservable = createMediaSubject();
			mediaClient.file.upload = jest.fn(
				(file: any, controller?: any, uploadableFileUpfrontIds?: any) => {
					uploadableFileUpfrontIds?.deferredUploadId.catch(() => {});
					return fromObservable(fileStateObservable);
				},
			);

			const callback = jest.fn();
			uploadService.onFileEmpty(callback);

			uploadService.addFiles([file]);

			expect(callback).not.toHaveBeenCalled();
		});

		it('should not emit file-upload-error when file is empty', async () => {
			const { uploadService } = setup();

			const callback = jest.fn();
			uploadService.on('file-upload-error', callback);

			uploadService.addFiles([emptyFile]);

			expect(callback).not.toHaveBeenCalled();
		});

		it('should emit files-added only for successfully created files', async () => {
			const { mediaClient, uploadService } = setup();
			const currentTimestamp = Date.now();

			asMock(mediaClient.file.touchFiles).mockResolvedValue(touchedFiles);
			const fileStateObservable = createMediaSubject();
			mediaClient.file.upload = jest.fn(
				(file: any, controller?: any, uploadableFileUpfrontIds?: any) => {
					uploadableFileUpfrontIds?.deferredUploadId.catch(() => {});
					return fromObservable(fileStateObservable);
				},
			);

			const callback = jest.fn();
			uploadService.on('files-added', callback);

			uploadService.addFiles([file, emptyFile]);

			await waitFor(() => {
				expect(callback).toHaveBeenCalled();
			});

			const expectedPayload: UploadsStartEventPayload = {
				files: [
					{
						creationDate: expect.any(Number),
						id: 'uuid1',
						name: 'some-filename',
						size: 100,
						type: 'video/mp4',
						occurrenceKey: expect.any(String),
					},
				],
				traceContext: expect.any(Object),
			};
			expect(callback).toHaveBeenCalledWith(expectedPayload);
			expect(callback.mock.calls[0][0].files[0].creationDate).toBeGreaterThanOrEqual(
				currentTimestamp,
			);
		});

		it('should emit files-added for all non-empty files when an unexpected error occurs', async () => {
			const fileOverSize: File = {
				size: 1000,
				name: 'over-size-filename',
				type: 'image/png',
			} as any;

			const { mediaClient, uploadService } = setup();
			const currentTimestamp = Date.now();

			const error = new Error('some error');
			mediaClient.file.touchFiles = jest.fn(() => Promise.reject(error));

			const fileStateObservable = createMediaSubject();
			mediaClient.file.upload = jest.fn(
				(file: any, controller?: any, uploadableFileUpfrontIds?: any) => {
					uploadableFileUpfrontIds?.deferredUploadId.catch(() => {});
					return fromObservable(fileStateObservable);
				},
			);

			const callback = jest.fn();
			uploadService.on('files-added', callback);

			uploadService.addFiles([file, emptyFile, fileOverSize]);

			await waitFor(() => {
				expect(callback).toHaveBeenCalled();
			});

			const expectedPayload: UploadsStartEventPayload = {
				files: [
					{
						id: expect.any(String),
						creationDate: expect.any(Number),
						name: 'some-filename',
						size: 100,
						type: 'video/mp4',
						occurrenceKey: expect.any(String),
					},
					{
						id: expect.any(String),
						creationDate: expect.any(Number),
						name: 'over-size-filename',
						size: 1000,
						type: 'image/png',
						occurrenceKey: expect.any(String),
					},
				],
				traceContext: expect.any(Object),
			};
			expect(callback).toHaveBeenCalledWith(expectedPayload);
			expect(callback.mock.calls[0][0].files[0].id).not.toEqual(
				callback.mock.calls[0][0].files[1].id,
			);
			expect(callback.mock.calls[0][0].files[0].creationDate).toBeGreaterThanOrEqual(
				currentTimestamp,
			);
			expect(callback.mock.calls[0][0].files[1].creationDate).toBeGreaterThanOrEqual(
				currentTimestamp,
			);
		});
	});

	describe('TraceContext in addFilesWithSource', () => {
		it('should pass traceContext to mediaClient filefetch', async () => {
			const { uploadService, mediaClient } = setup();

			await uploadService.addFilesWithSource([localFileWithSource]);

			await waitFor(() => {
				expect(mediaClient.file.touchFiles).toHaveBeenCalled();
			});

			expect(asMock(mediaClient.file.touchFiles).mock.calls[0][0]).toEqual([
				{
					collection: '',
					expireAfter: 2,
					fileId: 'uuid1',
					size: 100,
					occurrenceKey: 'uuid2',
				},
			]);
			expect(asMock(mediaClient.file.touchFiles).mock.calls[0][2]).toEqual({
				traceId: expect.any(String),
			});

			expect(mediaClient.file.upload).toHaveBeenCalledTimes(1);
			expect(asMock(mediaClient.file.upload).mock.calls[0][3]).toEqual({
				traceId: expect.any(String),
			});
		});

		it('should pass traceContext to mediaClient.mediaStore if any error is thrown when resolving touchedFiles', async () => {
			const { uploadService, mediaClient } = setup();
			const createUploadMock = asMock(mediaClient.mediaStore.createUpload);
			createUploadMock.mockResolvedValue({ data: [{ id: 'some-id' }] });
			asMock(mediaClient.file.touchFiles).mockRejectedValueOnce(
				new RequestError('serverUnexpectedError', { statusCode: 409 }),
			);

			await uploadService.addFilesWithSource([localFileWithSource]);

			await waitFor(() => {
				expect(mediaClient.mediaStore.createUpload).toHaveBeenCalled();
			});

			expect(createUploadMock.mock.calls[0][2]).toEqual({
				traceId: expect.any(String),
			});
		});

		it('should pass traceContext in files-added event', async () => {
			const { uploadService } = setup();
			const filesAddedCallback = jest.fn();
			uploadService.on('files-added', filesAddedCallback);

			await uploadService.addFilesWithSource([localFileWithSource]);

			await waitFor(() => {
				expect(filesAddedCallback).toHaveBeenCalled();
			});

			expect(filesAddedCallback.mock.calls[0][0]).toEqual(
				expect.objectContaining({
					traceContext: { traceId: expect.any(String) },
				}),
			);
		});

		it('should pass traceContext in file-converting event if upload succeeded', async () => {
			const { uploadService, mediaClient } = setup();
			const fileConvertingCallback = jest.fn();
			uploadService.on('file-converting', fileConvertingCallback);

			const fileStateObservable = createMediaSubject();
			mediaClient.file.upload = jest.fn(() => {
				return fromObservable(fileStateObservable);
			});

			await uploadService.addFilesWithSource([localFileWithSource]);

			fileStateObservable.next({
				status: 'processing',
				id: 'public-file-id',
			} as ProcessingFileState);

			await waitFor(() => {
				expect(fileConvertingCallback).toHaveBeenCalled();
			});

			expect(fileConvertingCallback.mock.calls[0][0]).toEqual(
				expect.objectContaining({
					traceContext: { traceId: expect.any(String) },
				}),
			);
		});

		it('should pass traceContext in file-upload-error event if upload failed', async () => {
			const { uploadService, fileStateObservable } = setup();
			const error = new Error('Some reason');
			const fileUploadErrorCallback = jest.fn();
			uploadService.on('file-upload-error', fileUploadErrorCallback);

			await uploadService.addFilesWithSource([localFileWithSource]);

			fileStateObservable.error(error);

			await waitFor(() => {
				expect(fileUploadErrorCallback).toHaveBeenCalled();
			});

			expect(fileUploadErrorCallback.mock.calls[0][0]).toEqual(
				expect.objectContaining({
					traceContext: { traceId: expect.any(String) },
				}),
			);
		});
	});

	describe('#cancel()', () => {
		it('should cancel specific upload', async () => {
			const file: File = {
				size: 100,
				name: 'some-filename',
				type: 'doc',
			} as any;
			const { uploadService } = setup();
			const abort = jest.fn();
			(uploadService as any).createUploadController = () => ({ abort });

			const filesAddedCallback = jest.fn();
			uploadService.on('files-added', filesAddedCallback);

			uploadService.addFiles([file]);

			await waitFor(() => {
				expect(filesAddedCallback).toHaveBeenCalled();
			});

			const generatedId = filesAddedCallback.mock.calls[0][0].files[0].id;
			uploadService.cancel(generatedId);
			expect(abort).toHaveBeenCalled();
		});

		it('should cancel all uploads when #cancel is not passed any arguments', async () => {
			const file1: File = {
				size: 100,
				name: 'some-filename',
				type: 'doc',
			} as any;
			const file2: File = {
				size: 10e7,
				name: 'some-other-filename',
				type: 'image/png',
			} as any;
			const { uploadService } = setup();
			const createUploadController = jest.fn().mockReturnValue({ abort() {} });
			(uploadService as any).createUploadController = createUploadController;

			const filesAddedCallback = jest.fn();

			uploadService.on('files-added', filesAddedCallback);
			uploadService.addFiles([file1, file2]);

			await waitFor(() => {
				expect(filesAddedCallback).toHaveBeenCalled();
			});

			uploadService.cancel();
			expect(createUploadController).toHaveBeenCalledTimes(2);
		});

		it.skip('should release cancellableFilesUpload after file failed to upload', async () => {
			const file: File = {
				size: 100,
				name: 'some-filename',
				type: 'doc',
			} as any;

			const mediaClient = getMediaClient();
			const { uploadService, fileStateObservable } = setup(mediaClient);

			const filesAddedCallback = jest.fn();
			uploadService.on('files-added', filesAddedCallback);

			const error = new Error('Some reason');
			uploadService.addFiles([file]);

			await waitFor(() => {
				expect(filesAddedCallback).toHaveBeenCalled();
			});

			expect(Object.keys((uploadService as any).cancellableFilesUploads)).toHaveLength(1);

			fileStateObservable.error(error);

			expect(Object.keys((uploadService as any).cancellableFilesUploads)).toHaveLength(0);
		});
	});

	describe('sequential upload batching', () => {
		const setupWithBatching = (uploadBatchSize?: number, uploadBatchDelayMs: number = 0) => {
			const mediaClient = getMediaClient();
			asMock(mediaClient.file.touchFiles).mockResolvedValue(successfulTouchedFiles);

			const fileStateSubjects: ReturnType<typeof createMediaSubject>[] = [];
			asMock(mediaClient.file.upload).mockImplementation(() => {
				const subject = createMediaSubject();
				fileStateSubjects.push(subject);
				return fromObservable(subject);
			});

			(getPreviewFromImage.getPreviewFromImage as any).mockReturnValue(
				Promise.resolve({ someImagePreview: true }),
			);

			const uploadService = new UploadServiceImpl(
				mediaClient,
				{ collection: 'some-collection', expireAfter: 2 },
				true,
				255,
				uploadBatchSize,
				uploadBatchDelayMs,
			);

			return { uploadService, mediaClient, fileStateSubjects };
		};

		const createFiles = (count: number): LocalFileWithSource[] =>
			Array.from({ length: count }, (_, i) => ({
				file: { size: 100 + i, name: `file-${i}`, type: 'video/mp4' } as File,
				source: LocalFileSource.LocalUpload,
			}));

		it('should not batch sequentially when uploadBatchSize is not set', async () => {
			const { uploadService, mediaClient } = setupWithBatching(undefined);

			const files = createFiles(4);
			uploadService.addFilesWithSource(files);

			await waitFor(() => {
				expect(mediaClient.file.touchFiles).toHaveBeenCalledTimes(1);
				expect(mediaClient.file.upload).toHaveBeenCalledTimes(4);
			});
		});

		ffTest.on(
			'platform_media_picker_upload_batching',
			'when upload batching flag is enabled',
			() => {
				it('should process files in sequential batches that complete before next batch starts', async () => {
					const { uploadService, mediaClient, fileStateSubjects } = setupWithBatching(2);

					const files = createFiles(4);

					const addPromise = uploadService.addFilesWithSource(files);

					// First batch (2 files) should have started
					await waitFor(() => {
						expect(mediaClient.file.touchFiles).toHaveBeenCalledTimes(1);
						expect(mediaClient.file.upload).toHaveBeenCalledTimes(2);
					});

					// Second batch should NOT have started yet
					expect(mediaClient.file.touchFiles).toHaveBeenCalledTimes(1);

					// Complete the first batch uploads
					fileStateSubjects[0].next({
						status: 'processing',
						id: 'file-0',
					} as FileState);
					fileStateSubjects[1].next({
						status: 'processing',
						id: 'file-1',
					} as FileState);

					// Now second batch should start
					await waitFor(() => {
						expect(mediaClient.file.touchFiles).toHaveBeenCalledTimes(2);
						expect(mediaClient.file.upload).toHaveBeenCalledTimes(4);
					});

					// Complete second batch
					fileStateSubjects[2].next({
						status: 'processing',
						id: 'file-2',
					} as FileState);
					fileStateSubjects[3].next({
						status: 'processing',
						id: 'file-3',
					} as FileState);

					await addPromise;
				});

				it('should continue to next batch even when a file in the current batch errors', async () => {
					const { uploadService, mediaClient, fileStateSubjects } = setupWithBatching(2);

					const files = createFiles(4);
					const addPromise = uploadService.addFilesWithSource(files);

					await waitFor(() => {
						expect(mediaClient.file.upload).toHaveBeenCalledTimes(2);
					});

					// First file succeeds, second errors
					fileStateSubjects[0].next({
						status: 'processing',
						id: 'file-0',
					} as FileState);
					fileStateSubjects[1].error(new Error('upload failed'));

					// Second batch should still start
					await waitFor(() => {
						expect(mediaClient.file.touchFiles).toHaveBeenCalledTimes(2);
						expect(mediaClient.file.upload).toHaveBeenCalledTimes(4);
					});

					fileStateSubjects[2].next({
						status: 'processing',
						id: 'file-2',
					} as FileState);
					fileStateSubjects[3].next({
						status: 'processing',
						id: 'file-3',
					} as FileState);

					await addPromise;
				});

				it('should handle single file with batching enabled', async () => {
					const { uploadService, mediaClient, fileStateSubjects } = setupWithBatching(2);

					const files = createFiles(1);
					const addPromise = uploadService.addFilesWithSource(files);

					await waitFor(() => {
						expect(mediaClient.file.touchFiles).toHaveBeenCalledTimes(1);
						expect(mediaClient.file.upload).toHaveBeenCalledTimes(1);
					});

					fileStateSubjects[0].next({
						status: 'processing',
						id: 'file-0',
					} as FileState);

					await addPromise;
				});

				it('should wait for the configured delay between batches', async () => {
					jest.useFakeTimers();
					const delayMs = 500;
					const { uploadService, mediaClient, fileStateSubjects } = setupWithBatching(2, delayMs);

					const files = createFiles(4);
					const addPromise = uploadService.addFilesWithSource(files);

					// First batch starts immediately (no delay before first batch)
					await waitFor(() => {
						expect(mediaClient.file.upload).toHaveBeenCalledTimes(2);
					});

					// Complete first batch
					fileStateSubjects[0].next({ status: 'processing', id: 'file-0' } as FileState);
					fileStateSubjects[1].next({ status: 'processing', id: 'file-1' } as FileState);

					// Flush microtasks so the await Promise.allSettled resolves
					await Promise.resolve();

					// Second batch should NOT have started — delay timer is pending
					expect(mediaClient.file.touchFiles).toHaveBeenCalledTimes(1);

					// Advance timer past the delay
					jest.advanceTimersByTime(delayMs);

					// Now second batch should start
					await waitFor(() => {
						expect(mediaClient.file.touchFiles).toHaveBeenCalledTimes(2);
						expect(mediaClient.file.upload).toHaveBeenCalledTimes(4);
					});

					// Complete second batch
					fileStateSubjects[2].next({ status: 'processing', id: 'file-2' } as FileState);
					fileStateSubjects[3].next({ status: 'processing', id: 'file-3' } as FileState);

					await addPromise;
					jest.useRealTimers();
				});

				it('should not delay before the first batch', async () => {
					const { uploadService, mediaClient, fileStateSubjects } = setupWithBatching(2, 5000);

					const files = createFiles(2);
					const addPromise = uploadService.addFilesWithSource(files);

					// First batch should start immediately despite large delay value
					await waitFor(() => {
						expect(mediaClient.file.upload).toHaveBeenCalledTimes(2);
					});

					fileStateSubjects[0].next({ status: 'processing', id: 'file-0' } as FileState);
					fileStateSubjects[1].next({ status: 'processing', id: 'file-1' } as FileState);

					await addPromise;
				});
			},
		);

		ffTest.off(
			'platform_media_picker_upload_batching',
			'when upload batching flag is disabled',
			() => {
				it('should process all files in parallel regardless of uploadBatchSize', async () => {
					const { uploadService, mediaClient } = setupWithBatching(2);

					const files = createFiles(4);
					uploadService.addFilesWithSource(files);

					await waitFor(() => {
						expect(mediaClient.file.touchFiles).toHaveBeenCalledTimes(1);
						expect(mediaClient.file.upload).toHaveBeenCalledTimes(4);
					});
				});
			},
		);
	});
});

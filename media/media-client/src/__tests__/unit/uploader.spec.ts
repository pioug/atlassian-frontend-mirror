jest.mock('@atlaskit/chunkinator');

import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs/observable/from';
import { mapTo } from 'rxjs/operators/mapTo';
import { chunkinator, type HashedBlob } from '@atlaskit/chunkinator';
import { type AuthProvider, type MediaApiConfig } from '@atlaskit/media-core';
import { uploadFile, type UploadableFileUpfrontIds, type MediaStore } from '../..';
import { asMockFunction, nextTick } from '@atlaskit/media-common/test-helpers';
import * as calculateChunkSize from '../../uploader/calculateChunkSize';
import * as getMediaFeatureFlag from '@atlaskit/media-common';
import { UploaderError } from '../../uploader/error';

jest.mock('@atlaskit/media-common');

describe('Uploader', () => {
	const calculateChunkSizeSpy = jest.spyOn(calculateChunkSize, 'calculateChunkSize');

	const getMediaFeatureFlagSpy = jest.spyOn(getMediaFeatureFlag, 'getMediaFeatureFlag');

	afterEach(() => {
		jest.resetAllMocks();
	});

	afterAll(() => {
		jest.resetAllMocks();
	});

	const file = {
		content: 'file-content',
		name: 'file-name',
		collection: 'file-collection',
		mimeType: 'file-mime-type',
	};

	const blob: HashedBlob = {
		partNumber: 1,
		blob: new Blob(),
		hash: 'some-hash',
	};

	const uploadableFileUpfrontIds: UploadableFileUpfrontIds = {
		id: 'some-file-id',
		occurrenceKey: 'some-occurrence-key',
		deferredUploadId: Promise.resolve('some-upload-id'),
	};

	const setup = () => {
		const ChunkinatorMock = asMockFunction(chunkinator);
		const config: MediaApiConfig = {
			authProvider,
		};
		const createFileFromUpload = jest
			.fn()
			.mockReturnValue(Promise.resolve({ data: { id: '123' } }));
		const appendChunksToUpload = jest.fn().mockReturnValue(Promise.resolve(1));
		const mediaStore: Partial<MediaStore> = {
			createFileFromUpload,
			appendChunksToUpload,
		};
		const cancel = jest.fn();
		const blob: Blob = null as any;
		ChunkinatorMock.mockImplementation((file, options, callbacks) => {
			return from(
				(async () => {
					callbacks.onProgress && callbacks.onProgress(0.1);
					await options.processingFunction!([
						{ hash: '1', blob, partNumber: 1 },
						{ hash: '2', blob, partNumber: 2 },
						{ hash: '3', blob, partNumber: 3 },
					]);
					callbacks.onProgress && callbacks.onProgress(0.2);
					await options.processingFunction!([
						{ hash: '4', blob, partNumber: 4 },
						{ hash: '5', blob, partNumber: 5 },
						{ hash: '6', blob, partNumber: 6 },
					]);
				})(),
			).pipe(mapTo([{ hash: '0', blob, partNumber: 0 }]));
		});

		return {
			mediaStore,
			ChunkinatorMock,
			config,
			cancel,
			createFileFromUpload,
			appendChunksToUpload,
		};
	};
	const authProvider: AuthProvider = () =>
		Promise.resolve({
			clientId: '',
			token: '',
			baseUrl: '',
		});

	it('should pass down the file content to Chunkinator', async () => {
		const { mediaStore, ChunkinatorMock } = setup();

		uploadFile(file, mediaStore as MediaStore, uploadableFileUpfrontIds);

		expect(ChunkinatorMock.mock.calls[0][0]).toEqual('file-content');
	});

	it('should use provided file name, collection names, occurrence key and trace context when creating the file', (done) => {
		const { mediaStore, ChunkinatorMock, createFileFromUpload } = setup();

		ChunkinatorMock.mockImplementation(() => from(Promise.resolve([blob])));

		uploadFile(
			file,
			mediaStore as MediaStore,
			uploadableFileUpfrontIds,
			{
				onProgress: jest.fn(),
				onUploadFinish: () => {
					expect(createFileFromUpload).toHaveBeenCalledTimes(1);
					expect(createFileFromUpload).toBeCalledWith(
						{
							uploadId: 'some-upload-id',
							name: 'file-name',
							mimeType: 'file-mime-type',
						},
						{
							occurrenceKey: 'some-occurrence-key',
							collection: 'file-collection',
							replaceFileId: 'some-file-id',
						},
						{ traceId: 'some-trace-id', spanId: 'some-span-id' },
					);
					done();
				},
			},
			{ traceId: 'some-trace-id', spanId: 'some-span-id' },
		);

		expect.assertions(2);
	});

	it('should append the chunks to the upload in processing function', async () => {
		const { mediaStore, appendChunksToUpload } = setup();
		const onProgress = jest.fn();

		await new Promise<void>((resolve, reject) => {
			uploadFile(
				{ content: '' },
				mediaStore as MediaStore,
				uploadableFileUpfrontIds,
				{
					onProgress,
					onUploadFinish: (err) => (err ? reject(err) : resolve()),
				},
				{ traceId: 'some-trace-id', spanId: 'some-span-id' },
			);
		});

		expect(appendChunksToUpload).toHaveBeenCalledTimes(2);
		expect(appendChunksToUpload.mock.calls[0][0]).toEqual('some-upload-id');
		expect(appendChunksToUpload.mock.calls[0][1].chunks).toEqual(['1', '2', '3']);
		expect(appendChunksToUpload.mock.calls[0][1].offset).toEqual(0);
		expect(appendChunksToUpload.mock.calls[0][3]).toEqual({
			traceId: 'some-trace-id',
			spanId: 'some-span-id',
		});

		expect(appendChunksToUpload.mock.calls[1][0]).toEqual('some-upload-id');
		expect(appendChunksToUpload.mock.calls[1][1].chunks).toEqual(['4', '5', '6']);
		expect(appendChunksToUpload.mock.calls[1][1].offset).toEqual(3);
		expect(appendChunksToUpload.mock.calls[1][3]).toEqual({
			traceId: 'some-trace-id',
			spanId: 'some-span-id',
		});
	});

	it('should call onProgress with the upload percentage', async () => {
		const { mediaStore } = setup();
		const onProgress = jest.fn();

		await new Promise<void>((resolve, reject) => {
			uploadFile({ content: '' }, mediaStore as MediaStore, uploadableFileUpfrontIds, {
				onProgress,
				onUploadFinish: (err) => (err ? reject(err) : resolve()),
			});
		});

		expect(onProgress).toHaveBeenCalledTimes(2);
		expect(onProgress.mock.calls[0][0]).toEqual(0.1);
		expect(onProgress.mock.calls[1][0]).toEqual(0.2);
	});

	it('should reject if there was an error with the upload', async () => {
		const { mediaStore, ChunkinatorMock } = setup();

		ChunkinatorMock.mockImplementation(() => from(Promise.reject('some upload error')));

		const error = await new Promise((resolve, reject) => {
			uploadFile({ content: '' }, mediaStore as MediaStore, uploadableFileUpfrontIds, {
				onProgress: jest.fn(),
				onUploadFinish: (err) => (err ? resolve(err) : reject()),
			});
		});
		expect(error).toEqual('some upload error');
	});

	// FIXME: Jest upgrade
	// throws error
	it.skip('should reject if deferredUploadId rejects', async () => {
		const { mediaStore } = setup();

		const failedUploadIdError = new Error('some-failed-upload-id');

		const uploadableFileUpfrontIds: UploadableFileUpfrontIds = {
			id: 'some-file-id',
			occurrenceKey: 'some-occurrence-key',
			deferredUploadId: Promise.reject(failedUploadIdError),
		};

		const err = await new Promise((resolve, reject) => {
			uploadFile({ content: '' }, mediaStore as MediaStore, uploadableFileUpfrontIds, {
				onProgress: jest.fn(),
				onUploadFinish: (err) => (err ? resolve(err) : reject()),
			});
		});
		expect(err).toEqual(failedUploadIdError);
	});

	it('should create the file after all chunks have been appended', async () => {
		const { mediaStore, appendChunksToUpload, createFileFromUpload } = setup();

		mediaStore.createFileFromUpload = () => {
			expect(appendChunksToUpload).toHaveBeenCalledTimes(2);
			return createFileFromUpload();
		};
		mediaStore.appendChunksToUpload = () => {
			expect(createFileFromUpload).toHaveBeenCalledTimes(0);
			return appendChunksToUpload();
		};

		expect.assertions(3);

		await new Promise<void>((resolve, reject) => {
			uploadFile({ content: '' }, mediaStore as MediaStore, uploadableFileUpfrontIds, {
				onProgress: jest.fn(),
				onUploadFinish: (err) => (err ? reject(err) : resolve()),
			});
		});
	});

	it('should not subscribe to Chunkinator Observable if cancel() initially called', (done) => {
		const { mediaStore, ChunkinatorMock, appendChunksToUpload, createFileFromUpload } = setup();

		const chunkinatorCalled = jest.fn();

		ChunkinatorMock.mockImplementation(
			() =>
				new Observable(() => {
					chunkinatorCalled();
				}),
		);

		const { cancel } = uploadFile(file, mediaStore as MediaStore, uploadableFileUpfrontIds, {
			onProgress: jest.fn(),
			onUploadFinish: (error) => {
				expect(error).toEqual('canceled');
				expect(chunkinatorCalled).toHaveBeenCalledTimes(0);
				expect(appendChunksToUpload).toHaveBeenCalledTimes(0);
				expect(createFileFromUpload).toHaveBeenCalledTimes(0);
				done();
			},
		});

		cancel();
		expect.assertions(4);
	});

	it('should interrupt upload if cancel() is called', async () => {
		const { mediaStore, appendChunksToUpload, createFileFromUpload } = setup();

		const { cancel } = uploadFile(file, mediaStore as MediaStore, uploadableFileUpfrontIds, {
			onProgress: jest.fn(),
			onUploadFinish: (error) => {
				expect(error).toEqual('canceled');
				expect(appendChunksToUpload).toHaveBeenCalledTimes(1);
				expect(createFileFromUpload).toHaveBeenCalledTimes(0);
			},
		});

		await nextTick();
		cancel();

		expect.assertions(3);
	});

	it('should call `calculateChunkSize` when file.content is a Blob', () => {
		const { mediaStore } = setup();
		getMediaFeatureFlagSpy.mockReturnValue(true);

		uploadFile(
			{
				...file,
				content: new Blob([]),
			},
			mediaStore as MediaStore,
			uploadableFileUpfrontIds,
			{
				onProgress: jest.fn(),
				onUploadFinish: jest.fn(),
			},
		);

		expect(calculateChunkSizeSpy).toHaveBeenCalled();
	});

	it('should NOT call `calculateChunkSize` when file.content is a string', async () => {
		const { mediaStore } = setup();
		getMediaFeatureFlagSpy.mockReturnValue(true);

		uploadFile(
			{
				...file,
				content: '',
			},
			mediaStore as MediaStore,
			uploadableFileUpfrontIds,
			{
				onProgress: jest.fn(),
				onUploadFinish: jest.fn(),
			},
		);

		expect(calculateChunkSizeSpy).not.toHaveBeenCalled();
	});

	it('should call handle errors from `calculateChunkSize`', async () => {
		const { mediaStore } = setup();
		getMediaFeatureFlagSpy.mockReturnValue(true);

		calculateChunkSizeSpy.mockImplementation(() => {
			throw new Error(calculateChunkSize.fileSizeError);
		});

		expect(
			uploadFile(
				{
					...file,
					content: new Blob([]),
				},
				mediaStore as MediaStore,
				uploadableFileUpfrontIds,
				{
					onProgress: jest.fn(),
					onUploadFinish: (error) => {
						expect(error).toBeInstanceOf(UploaderError);
						expect(error.id).toStrictEqual('some-file-id');
						expect(error.reason).toStrictEqual('fileSizeExceedsLimit');
						expect(error.metadata).toStrictEqual({
							collectionName: 'file-collection',
							occurrenceKey: 'some-occurrence-key',
						});
					},
				},
			),
		).toEqual(
			expect.objectContaining({
				cancel: expect.any(Function),
			}),
		);
	});
});

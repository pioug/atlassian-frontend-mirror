import { authToOwner, type AuthProvider } from '@atlaskit/media-core';
import fetchMock from 'fetch-mock/cjs/client';
import {
	type ResponseFileItem,
	type MediaFile,
	type MediaStore,
	RECENTS_COLLECTION,
	globalMediaEventEmitter,
	type MediaViewedEventPayload,
	uploadFile,
	type UploadableFile,
	type UploadableFileUpfrontIds,
	UploadController,
	type FilePreview,
	isPreviewableFileState,
	isFileFetcherError,
	FileFetcherError,
	getDimensionsFromBlob,
} from '../..';
import { getFileStreamsCache } from '../../file-streams-cache';
import uuid from 'uuid';
import { type UploadFileCallbacks } from '../../uploader';
import { FileFetcherImpl } from '../../client/file-fetcher';
import {
	expectFunctionToHaveBeenCalledWith,
	asMock,
	asMockFunction,
	asMockFunctionResolvedValue,
	sleep,
	timeoutPromise,
} from '@atlaskit/media-common/test-helpers';
import { fakeMediaClient } from '../../test-helpers';
import { fromObservable, toPromise } from '../../utils/mediaSubscribable';
import { isMimeTypeSupportedByServer } from '@atlaskit/media-common/mediaTypeUtils';
import type * as MediaStoreModule from '../../client/media-store';
import { createMediaStore, mediaStore as fileStateStore } from '@atlaskit/media-state';

jest.mock('../../utils/getDimensionsFromBlob', () => {
	return {
		getDimensionsFromBlob: jest.fn(),
	};
});

jest.mock('../../uploader');

describe('FileFetcher', () => {
	const fileId = 'some-file-id';
	const collectionName = 'some-collection-name';
	const fileName = 'some-name';
	const binaryUrl = 'http://some-binary-url.com/';

	const setup = () => {
		getFileStreamsCache().removeAll();

		const items: ResponseFileItem[] = [
			{
				id: uuid(),
				type: 'file',
				collection: 'collection-1',
				details: {
					name: 'file-1',
					mimeType: 'image/jpeg',
					mediaType: 'image',
					processingStatus: 'pending',
					size: 0,
					artifacts: {},
					representations: {},
				},
			},
			{
				id: uuid(),
				type: 'file',
				collection: 'collection-1',
				details: {
					name: 'file-2',
					mimeType: 'image/jpeg',
					mediaType: 'image',
					processingStatus: 'pending',
					size: 0,
					artifacts: {},
					representations: {},
				},
			},
			{
				id: uuid(),
				type: 'file',
				collection: 'collection-2',
				details: {
					name: 'file-3',
					mimeType: 'image/jpeg',
					mediaType: 'image',
					processingStatus: 'pending',
					size: 0,
					artifacts: {},
					representations: {},
				},
			},
		];

		const createUploadableFile = (
			name: string,
			mimeType: string,
			collection?: string,
		): UploadableFile => ({
			content: new Blob([], { type: mimeType }),
			name,
			mimeType,
			collection,
		});

		const uploadFileUpfrontIds: UploadableFileUpfrontIds = {
			id: 'upfront-id',
			deferredUploadId: Promise.resolve('deferred-upload-id'),
			occurrenceKey: 'upfront-occurrence-key',
		};

		asMockFunction(uploadFile).mockImplementation(
			(
				_1: UploadableFile,
				_2: MediaStore,
				_3: UploadableFileUpfrontIds,
				callbacks?: UploadFileCallbacks,
			) => {
				if (callbacks) {
					callbacks.onProgress(0);
					callbacks.onProgress(0.5);
					callbacks.onProgress(1);
					callbacks.onUploadFinish();
				}

				return {
					cancel: jest.fn(),
				};
			},
		);

		const mediaClient = fakeMediaClient();
		const touchFiles = asMockFunctionResolvedValue(mediaClient.mediaStore.touchFiles, {
			data: {
				created: [
					{
						fileId: '1',
						uploadId: '1',
					},
					{
						fileId: '2',
						uploadId: '2',
					},
				],
				rejected: [],
			},
		});

		const mockAuthProvider: jest.Mocked<AuthProvider> = jest.fn().mockResolvedValue({
			clientId: 'some-client-id',
			token: 'some-token',
			baseUrl: 'some-service-host',
		});

		const mediaStore = new MockMediaStoreConstructor({
			authProvider: mockAuthProvider,
		}) as jest.Mocked<MediaStore>;

		mediaStore.getFileBinaryURL = asMockFunctionResolvedValue(
			mediaClient.mediaStore.getFileBinaryURL,
			binaryUrl,
		);
		mediaStore.getItems = asMockFunctionResolvedValue(mediaClient.mediaStore.getItems, {
			data: {
				items,
			},
		});
		mediaStore.touchFiles = touchFiles;
		mediaStore.uploadArtifact = jest.fn();

		const fileFetcher = new FileFetcherImpl(mediaStore, fileStateStore);

		(fileFetcher as any).generateUploadableFileUpfrontIds = jest.fn().mockReturnValue({
			id: 'upfront-id',
			occurrenceKey: 'upfront-occurrence-key',
		});

		return {
			fileFetcher,
			mediaStore,
			items,
			createUploadableFile,
			uploadFileUpfrontIds,
			mockAuthProvider,
		};
	};

	const MockMediaStoreConstructor = (
		jest.genMockFromModule('../../client/media-store') as typeof MediaStoreModule
	)['MediaStore'];

	const createMockMediaStore = (authProvider: AuthProvider) =>
		new MockMediaStoreConstructor({
			authProvider,
		});

	beforeEach(() => {
		(getDimensionsFromBlob as jest.Mock).mockReturnValue({ width: 1, height: 1 });
		jest.spyOn(globalMediaEventEmitter, 'emit');
	});

	afterEach(() => {
		getFileStreamsCache().removeAll();
		jest.restoreAllMocks();
		fetchMock.restore();
	});

	describe('downloadBinary()', () => {
		let appendChild: jest.SpyInstance<any>;

		describe('touchFiles', () => {
			it('masks mediaStore touchFiles', () => {
				const { mediaStore, fileFetcher } = setup();

				const descriptors = [
					{
						fileId: 'id-1',
						collection: 'collection-1',
						occurrenceKey: 'occ-1',
						expireAfter: 100,
						deletable: true,
					},
					{
						fileId: 'id-2',
						collection: 'collection-2',
						occurrenceKey: 'occ-2',
						expireAfter: 200,
						deletable: false,
					},
				];

				const traceContext = {
					traceId: 'some-trace-id',
					spanId: 'some-span-id',
				};

				fileFetcher.touchFiles(descriptors, 'some-collection', traceContext);

				expect(mediaStore.touchFiles).toHaveBeenCalledWith(
					{ descriptors },
					{ collection: 'some-collection' },
					traceContext,
				);
			});
		});

		describe('with normal browser', () => {
			beforeEach(() => {
				appendChild = jest.spyOn(document.body, 'appendChild');
			});

			it('should trigger media-viewed in globalMediaEventEmitter for recents collection', async () => {
				const { fileFetcher } = setup();
				await fileFetcher.downloadBinary(fileId, fileName, RECENTS_COLLECTION);

				expect(globalMediaEventEmitter.emit).toHaveBeenCalledTimes(1);
				expectFunctionToHaveBeenCalledWith(globalMediaEventEmitter.emit, [
					'media-viewed',
					{
						fileId,
						viewingLevel: 'download',
						isUserCollection: true,
					} as MediaViewedEventPayload,
				]);
			});

			it('should trigger media-viewed in globalMediaEventEmitter for non-recents collection', async () => {
				const { fileFetcher } = setup();
				await fileFetcher.downloadBinary(fileId, fileName, collectionName);

				expect(globalMediaEventEmitter.emit).toHaveBeenCalledTimes(1);
				expectFunctionToHaveBeenCalledWith(globalMediaEventEmitter.emit, [
					'media-viewed',
					{
						fileId,
						viewingLevel: 'download',
						isUserCollection: false,
					} as MediaViewedEventPayload,
				]);
			});

			it('should not trigger media-viewed in globalMediaEventEmitter if getFileBinaryURL fails', async () => {
				const { fileFetcher, mediaStore } = setup();
				asMock(mediaStore.getFileBinaryURL).mockRejectedValue(new Error());
				try {
					await fileFetcher.downloadBinary(fileId, fileName, collectionName);
				} catch {
					expect(globalMediaEventEmitter.emit).toHaveBeenCalledTimes(0);
				}
			});

			it('should call getFileBinaryURL', () => {
				const { mediaStore, fileFetcher } = setup();
				fileFetcher.downloadBinary(fileId, fileName, collectionName);
				expect(mediaStore.getFileBinaryURL).toHaveBeenCalledWith(fileId, collectionName);
			});

			it('should create a link', async () => {
				const { fileFetcher } = setup();
				await fileFetcher.downloadBinary(fileId, fileName, collectionName);
				const lastAppendCall = appendChild.mock.calls[appendChild.mock.calls.length - 1];
				const link = lastAppendCall[0] as HTMLAnchorElement;
				expect(link.download).toBe(fileName);
				expect(link.href).toBe(binaryUrl);
				expect(link.target).toBe('media-download-iframe');
			});

			it('should create iframe and open binary url in it', () => {
				const { fileFetcher } = setup();
				fileFetcher.downloadBinary(fileId, fileName, collectionName);

				const iframe = document.getElementById('media-download-iframe') as HTMLIFrameElement;
				expect(iframe).toBeDefined();
			});
		});

		describe('with IE11', () => {
			beforeEach(() => {
				const { fileFetcher } = setup();
				appendChild = jest.spyOn(document.body, 'appendChild');
				(window as any).MSInputMethodContext = true;
				(document as any).documentMode = true;
				fileFetcher.downloadBinary(fileId, fileName, collectionName);
			});

			it('should detect IE11 and use _blank as target', () => {
				const lastAppendCall = appendChild.mock.calls[appendChild.mock.calls.length - 1];
				const link = lastAppendCall[0] as HTMLAnchorElement;
				expect(link.target).toBe('_blank');
			});
		});
	});

	describe('getFileState()', () => {
		it('should return an errored observable if we pass an invalid file id', (done) => {
			const { fileFetcher } = setup();

			const expectedErrorAttributes = {
				reason: 'invalidFileId',
				id: 'invalid-id',
				collectionName: 'collection',
				occurrenceKey: 'occurrence-key',
			};

			const expectedFileStateDetails = {
				...expectedErrorAttributes,
				error: {
					innerError: undefined,
					metadata: {
						collectionName: 'collection',
						id: 'invalid-id',
						occurrenceKey: 'occurrence-key',
					},
					reason: 'invalidFileId',
				},
			};

			fileFetcher
				.getFileState('invalid-id', {
					collectionName: 'collection',
					occurrenceKey: 'occurrence-key',
				})
				.subscribe({
					error(error) {
						expect(isFileFetcherError(error)).toBeTruthy();
						expect(error.attributes).toEqual(expectedErrorAttributes);
						done();
					},
				});
			const storedFileState: any = fileStateStore.getState().files['invalid-id'];
			expect(storedFileState.details).toEqual(expectedFileStateDetails);
		});

		it('should split calls to /items by collection name', (done) => {
			const { fileFetcher, mediaStore, items } = setup();

			fileFetcher
				.getFileState(items[0].id, {
					collectionName: items[0].collection,
				})
				.subscribe((fileState) => {
					expect(fileState.id).toEqual(items[0].id);
				});

			fileFetcher
				.getFileState(items[1].id, {
					collectionName: items[1].collection,
				})
				.subscribe((fileState) => {
					expect(fileState.id).toEqual(items[1].id);
				});

			fileFetcher
				.getFileState(items[2].id, {
					collectionName: items[2].collection,
				})
				.subscribe((fileState) => {
					expect(fileState.id).toEqual(items[2].id);
					expect(mediaStore.getItems).toHaveBeenCalledTimes(2);
					expect(mediaStore.getItems.mock.calls[0]).toEqual([
						[items[0].id, items[1].id],
						'collection-1',
						expect.any(Object),
					]);
					expect(mediaStore.getItems.mock.calls[1]).toEqual([
						[items[2].id],
						'collection-2',
						expect.any(Object),
					]);
					done();
				});

			setImmediate(() => {
				const { files } = fileStateStore.getState();
				expect(files[items[0].id]).toEqual(
					expect.objectContaining({
						id: items[0].id,
						name: 'file-1',
					}),
				);
				expect(files[items[1].id]).toEqual(
					expect.objectContaining({
						id: items[1].id,
						name: 'file-2',
					}),
				);
				expect(files[items[2].id]).toEqual(
					expect.objectContaining({
						id: items[2].id,
						name: 'file-3',
					}),
				);
				done();
			});
		});

		it('should group ids without collection in the same call to /items', (done) => {
			const { fileFetcher, mediaStore, items } = setup();

			// omit collection from original response
			asMockFunctionResolvedValue(mediaStore.getItems, {
				data: {
					items: items.map((item) => ({
						id: item.id,
						type: item.type,
						details: item.details,
					})),
				},
			});

			fileFetcher.getFileState(items[0].id).subscribe((fileState) => {
				expect(fileState.id).toEqual(items[0].id);
			});

			fileFetcher.getFileState(items[1].id).subscribe((fileState) => {
				expect(fileState.id).toEqual(items[1].id);
			});

			fileFetcher.getFileState(items[2].id).subscribe((fileState) => {
				expect(fileState.id).toEqual(items[2].id);
				expect(mediaStore.getItems).toHaveBeenCalledTimes(1);
				expect(mediaStore.getItems.mock.calls[0]).toEqual([
					[items[0].id, items[1].id, items[2].id],
					undefined,
					expect.any(Object),
				]);
				done();
			});

			setImmediate(() => {
				const { files } = fileStateStore.getState();
				expect(files[items[0].id]).toEqual(
					expect.objectContaining({
						id: items[0].id,
						name: 'file-1',
					}),
				);
				expect(files[items[1].id]).toEqual(
					expect.objectContaining({
						id: items[1].id,
						name: 'file-2',
					}),
				);
				expect(files[items[2].id]).toEqual(
					expect.objectContaining({
						id: items[2].id,
						name: 'file-3',
					}),
				);
				done();
			});
		});

		it('should handle failures when fetching items', (done) => {
			const { fileFetcher, mediaStore, items } = setup();
			const next = jest.fn();
			const error = jest.fn();

			mediaStore.getItems.mockImplementation((_: string[], collectionName?: string) => {
				// We want to make one of the /items call to fail
				if (collectionName === 'collection-1') {
					return Promise.reject(new Error('any error'));
				}

				return Promise.resolve({
					data: {
						items: [items[2]],
					},
				});
			});

			fileFetcher.getFileState(items[0].id, { collectionName: items[0].collection }).subscribe({
				error,
			});

			fileFetcher.getFileState(items[2].id, { collectionName: items[2].collection }).subscribe({
				next,
			});

			setImmediate(() => {
				const expectedFileState = {
					id: items[2].id,
					status: 'processing',
					name: 'file-3',
					mimeType: 'image/jpeg',
					mediaType: 'image',
					size: 0,
					artifacts: {},
					representations: {},
					metadataTraceContext: expect.any(Object),
				};
				expect(error).toBeCalledTimes(1);
				expect(next).toBeCalledTimes(1);
				expect(mediaStore.getItems).toHaveBeenCalledTimes(2);
				expect(error).toBeCalledWith(expect.any(Error));
				expect(next).toBeCalledWith(expectedFileState);
				const storedFileState = fileStateStore.getState().files[items[2].id];
				expect(storedFileState).toEqual(expectedFileState);
				done();
			});
		});

		it('should create emptyItems error when no item returned', (done) => {
			const { fileFetcher, mediaStore, items } = setup();

			mediaStore.getItems.mockImplementation(() =>
				Promise.resolve({
					data: {
						items: [], // no item
					},
				}),
			);

			fileFetcher.getFileState(items[0].id, { collectionName: items[0].collection }).subscribe({
				error: (err) => {
					expect(err).toBeInstanceOf(FileFetcherError);
					expect(err.attributes.reason).toEqual('emptyItems');
					expect(err.attributes.id).toEqual(items[0].id);
					expect(err.attributes.collectionName).toEqual(items[0].collection);

					const expectedErrorAttributes = {
						collectionName: 'collection-1',
						id: items[0].id,
						occurrenceKey: undefined,
						reason: 'emptyItems',
						metadata: {
							traceContext: {
								traceId: expect.any(String),
								spanId: expect.any(String),
							},
						},
						error: {
							innerError: undefined,
							metadata: {
								collectionName: 'collection-1',
								id: items[0].id,
								occurrenceKey: undefined,
								traceContext: {
									spanId: expect.any(String),
									traceId: expect.any(String),
								},
							},
							reason: 'emptyItems',
						},
					};

					const expectedFileState = {
						details: expectedErrorAttributes,
						id: items[0].id,
						message: 'emptyItems',
						occurrenceKey: undefined,
						reason: 'emptyItems',
						status: 'error',
					};

					const storedFileState = fileStateStore.getState().files[items[0].id];
					expect(storedFileState).toEqual(expectedFileState);
					done();
				},
			});
		});

		it('should return processing file state for empty files', (done) => {
			const { fileFetcher, mediaStore, items } = setup();
			const next = jest.fn();
			const error = jest.fn();

			const expectedFileState = {
				id: items[0].id,
				status: 'processing',
				name: 'file-1',
				mimeType: 'image/jpeg',
				mediaType: 'image',
				size: 0,
				artifacts: {},
				representations: {},
				metadataTraceContext: expect.any(Object),
			};

			asMockFunctionResolvedValue(mediaStore.getItems, {
				data: {
					items: [
						{
							id: items[0].id,
							type: 'file',
							collection: items[0].collection,
							details: {
								name: items[0].details.name,
								mimeType: items[0].details.mimeType,
								mediaType: items[0].details.mediaType,
								processingStatus: items[0].details.processingStatus,
								size: 0,
								artifacts: {},
								representations: {},
							},
						},
					],
				},
			});

			fileFetcher.getFileState(items[0].id, { collectionName: items[0].collection }).subscribe({
				next,
				error,
			});

			setImmediate(() => {
				expect(next).toBeCalledTimes(1);
				expect(error).toBeCalledTimes(0);
				expect(next).toBeCalledWith(expectedFileState);
				const storedFileState = fileStateStore.getState().files[items[0].id];
				expect(storedFileState).toEqual(expectedFileState);
				done();
			});
		});
	});

	describe('copyFile', () => {
		it('should call mediaStore.copyFileWithToken', async () => {
			const { items, fileFetcher, mockAuthProvider } = setup();
			const copyFileWithTokenMock = jest
				.fn()
				.mockResolvedValue({ data: { mimeType: 'application/octet-stream' } });
			const authProvider = jest.fn();
			const mediaStore = createMockMediaStore(authProvider);

			mediaStore.copyFileWithToken = copyFileWithTokenMock;

			const destinationAuthProvider = jest.fn();

			const source = {
				id: items[0].id,
				collection: 'someCollectionName',
				authProvider: mockAuthProvider,
			};
			const destination = {
				collection: RECENTS_COLLECTION,
				authProvider: destinationAuthProvider,
				mediaStore,
			};
			await fileFetcher.copyFile(source, destination);
			expectFunctionToHaveBeenCalledWith(copyFileWithTokenMock, [
				{
					sourceFile: {
						id: items[0].id,
						collection: 'someCollectionName',
						owner: authToOwner(await mockAuthProvider()),
					},
				},
				{
					collection: RECENTS_COLLECTION,
				},
				undefined,
			]);
		});

		it('should call mediaStore.copyFile when authProvider is not given', async () => {
			const { items, fileFetcher, mediaStore } = setup();
			const copyFileMock = jest
				.fn()
				.mockResolvedValue({ data: { mimeType: 'application/octet-stream' } });

			mediaStore.copyFile = copyFileMock;

			const source = {
				id: items[0].id,
				collection: 'someCollectionName',
			};
			const destination = {
				collection: RECENTS_COLLECTION,
				mediaStore,
			};

			await fileFetcher.copyFile(source, destination);
			expectFunctionToHaveBeenCalledWith(copyFileMock, [
				source.id,
				{
					collection: RECENTS_COLLECTION,
					sourceCollection: source.collection,
					replaceFileId: undefined,
				},
				undefined,
			]);
		});

		it('should populate cache when copied file "processingStatus" is succeeded', async () => {
			const { items, fileFetcher, mockAuthProvider } = setup();
			const copiedFile: MediaFile = {
				id: 'copied-file-id',
				name: 'copied-file-name',
				processingStatus: 'succeeded',
				artifacts: {},
				mediaType: 'archive',
				mimeType: 'application/zip',
				representations: {},
				size: 1,
				createdAt: -1,
			};
			const mediaStore = createMockMediaStore(jest.fn());
			asMock(mediaStore.copyFileWithToken).mockResolvedValue({
				data: copiedFile,
			});
			const source = {
				id: items[0].id,
				collection: 'someCollectionName',
				authProvider: mockAuthProvider,
			};
			const destination = {
				collection: RECENTS_COLLECTION,
				authProvider: mockAuthProvider,
				mediaStore,
			};

			await fileFetcher.copyFile(source, destination);

			const copiedFileObservable = getFileStreamsCache().get('copied-file-id');
			if (!copiedFileObservable) {
				return expect(copiedFileObservable).toBeDefined();
			}

			const copiedFileState = await toPromise(fromObservable(copiedFileObservable));
			const expectedFileState = {
				id: 'copied-file-id',
				name: 'copied-file-name',
				status: 'processed',
				artifacts: {},
				mediaType: 'archive',
				mimeType: 'application/zip',
				representations: {},
				size: 1,
				createdAt: -1,
			};
			expect(copiedFileState).toEqual(expectedFileState);

			const storedFileState = fileStateStore.getState().files['copied-file-id'];
			expect(storedFileState).toEqual(expectedFileState);
		});

		it('should populate cache when copied file "processingStatus" is failed', async () => {
			const { items, fileFetcher, mockAuthProvider } = setup();
			const copiedFile: MediaFile = {
				id: 'copied-file-id',
				name: 'copied-file-name',
				processingStatus: 'failed',
				artifacts: {},
				mediaType: 'archive',
				mimeType: 'application/zip',
				representations: {},
				size: 1,
				createdAt: -1,
			};
			const mediaStore = createMockMediaStore(jest.fn());
			asMock(mediaStore.copyFileWithToken).mockResolvedValue({
				data: copiedFile,
			});
			const source = {
				id: items[0].id,
				collection: 'someCollectionName',
				authProvider: mockAuthProvider,
			};
			const destination = {
				collection: RECENTS_COLLECTION,
				authProvider: mockAuthProvider,
				mediaStore,
			};

			await fileFetcher.copyFile(source, destination);

			const copiedFileObservable = getFileStreamsCache().get('copied-file-id');
			if (!copiedFileObservable) {
				return expect(copiedFileObservable).toBeDefined();
			}

			const copiedFileState = await toPromise(fromObservable(copiedFileObservable));
			const expectedFileState = {
				id: 'copied-file-id',
				name: 'copied-file-name',
				status: 'failed-processing',
				artifacts: {},
				mediaType: 'archive',
				mimeType: 'application/zip',
				representations: {},
				size: 1,
				createdAt: -1,
			};
			expect(copiedFileState).toEqual(expectedFileState);

			const storedFileState = fileStateStore.getState().files['copied-file-id'];
			expect(storedFileState).toEqual(expectedFileState);
		});

		it('should populate cache when copied file "processingStatus" is pending', async () => {
			const { items, fileFetcher, mockAuthProvider } = setup();
			const copiedFile: MediaFile = {
				id: 'copied-file-id',
				name: 'copied-file-name',
				processingStatus: 'pending',
				artifacts: {},
				mediaType: 'archive',
				mimeType: 'application/zip',
				representations: {},
				size: 1,
				createdAt: -1,
			};
			const mediaStore = createMockMediaStore(jest.fn());
			asMock(mediaStore.copyFileWithToken).mockResolvedValue({
				data: copiedFile,
			});
			const source = {
				id: items[0].id,
				collection: 'someCollectionName',
				authProvider: mockAuthProvider,
			};
			const destination = {
				collection: RECENTS_COLLECTION,
				authProvider: mockAuthProvider,
				mediaStore,
			};

			await fileFetcher.copyFile(source, destination);

			const copiedFileObservable = getFileStreamsCache().get('copied-file-id');
			if (!copiedFileObservable) {
				return expect(copiedFileObservable).toBeDefined();
			}

			try {
				await Promise.race([
					toPromise(fromObservable(copiedFileObservable)),
					timeoutPromise(300, 'There should be no emission from copiedFileObservable'),
				]);
			} catch (e) {
				expect(e).toEqual('There should be no emission from copiedFileObservable');
			}
		});

		it('should update cache in case of an error', async () => {
			const { items, fileFetcher, mockAuthProvider } = setup();
			const error = new Error('error while copying source file');
			const mediaStore = createMockMediaStore(jest.fn());
			asMock(mediaStore.copyFileWithToken).mockRejectedValue(error);

			const source = {
				id: items[0].id,
				collection: 'someCollectionName',
				authProvider: mockAuthProvider,
			};
			const destination = {
				collection: RECENTS_COLLECTION,
				replaceFileId: 'copied-file-id',
				authProvider: mockAuthProvider,
				mediaStore,
			};

			try {
				await fileFetcher.copyFile(source, destination);
			} catch (err) {
				expect(err).toEqual(error);

				const fileObservable = getFileStreamsCache().get(items[0].id);
				if (!fileObservable) {
					return expect(fileObservable).toBeDefined();
				}

				try {
					await toPromise(fromObservable(fileObservable));
				} catch (err) {
					expect(err).toEqual(error);
				}
			}

			const storedFileState = fileStateStore.getState().files['copied-file-id'];
			expect(storedFileState).toEqual(expect.objectContaining(error));
		});

		it('should override preview when provided', async () => {
			const { items, fileFetcher, mockAuthProvider } = setup();
			const copiedFile: MediaFile = {
				id: 'copied-file-id',
				name: 'copied-file-name',
				processingStatus: 'succeeded',
				artifacts: {},
				mediaType: 'image',
				mimeType: 'image/jpeg',
				representations: {},
				size: 1,
			};
			const mediaStore = createMockMediaStore(jest.fn());
			asMock(mediaStore.copyFileWithToken).mockResolvedValue({
				data: copiedFile,
			});

			const source = {
				id: items[0].id,
				collection: 'someCollectionName',
				authProvider: mockAuthProvider,
			};
			const destination = {
				collection: RECENTS_COLLECTION,
				authProvider: mockAuthProvider,
				mediaStore,
			};
			const copyOptions = {
				preview: {
					value: new Blob([], { type: 'image/jpeg' }),
					origin: 'local',
				} as FilePreview,
			};
			await fileFetcher.copyFile(source, destination, copyOptions);

			const copiedFileObservable = getFileStreamsCache().get('copied-file-id');
			if (!copiedFileObservable) {
				return expect(copiedFileObservable).toBeDefined();
			}

			const copiedFileState = await toPromise(fromObservable(copiedFileObservable));
			if (!isPreviewableFileState(copiedFileState)) {
				return expect(isPreviewableFileState(copiedFileState)).toBeTruthy();
			}
			expect(copiedFileState.preview).toEqual(copyOptions.preview);

			const storedFileState = fileStateStore.getState().files['copied-file-id'];
			if (!isPreviewableFileState(storedFileState)) {
				return expect(isPreviewableFileState(storedFileState)).toBeTruthy();
			}

			expect(storedFileState.preview).toEqual(copiedFileState.preview);
		});

		it('should override mimeType when provided', async () => {
			const { items, fileFetcher, mockAuthProvider } = setup();
			const copiedFile: MediaFile = {
				id: 'copied-file-id',
				name: 'copied-file-name',
				processingStatus: 'succeeded',
				artifacts: {},
				mediaType: 'unknown',
				mimeType: 'binary/octet-stream',
				representations: {},
				size: 1,
			};
			const mediaStore = createMockMediaStore(jest.fn());
			asMock(mediaStore.copyFileWithToken).mockResolvedValue({
				data: copiedFile,
			});

			const source = {
				id: items[0].id,
				collection: 'someCollectionName',
				authProvider: mockAuthProvider,
			};
			const destination = {
				collection: RECENTS_COLLECTION,
				authProvider: mockAuthProvider,
				mediaStore,
			};
			const copyOptions = {
				preview: {
					value: new Blob([], { type: 'image/jpeg' }),
					origin: 'local',
				} as FilePreview,
				mimeType: 'image/jpeg',
			};
			await fileFetcher.copyFile(source, destination, copyOptions);

			const copiedFileObservable = getFileStreamsCache().get('copied-file-id');
			if (!copiedFileObservable) {
				return expect(copiedFileObservable).toBeDefined();
			}

			const copiedFileState = await toPromise(fromObservable(copiedFileObservable));
			if (!isPreviewableFileState(copiedFileState)) {
				return expect(isPreviewableFileState(copiedFileState)).toBeTruthy();
			}

			expect(copiedFileState.mimeType).toEqual(copyOptions.mimeType);

			const storedFileState = fileStateStore.getState().files['copied-file-id'];
			if (!isPreviewableFileState(storedFileState)) {
				return expect(isPreviewableFileState(storedFileState)).toBeTruthy();
			}
			expect(storedFileState.preview).toEqual(copyOptions.preview);
		});

		it('should not override mimeType when not provided', async () => {
			const { items, fileFetcher, mockAuthProvider } = setup();
			const copiedFile: MediaFile = {
				id: 'copied-file-id',
				name: 'copied-file-name',
				processingStatus: 'succeeded',
				artifacts: {},
				mediaType: 'unknown',
				mimeType: 'binary/octet-stream',
				representations: {},
				size: 1,
			};
			const mediaStore = createMockMediaStore(jest.fn());
			asMock(mediaStore.copyFileWithToken).mockResolvedValue({
				data: copiedFile,
			});

			const source = {
				id: items[0].id,
				collection: 'someCollectionName',
				authProvider: mockAuthProvider,
			};
			const destination = {
				collection: RECENTS_COLLECTION,
				authProvider: mockAuthProvider,
				mediaStore,
			};
			const copyOptions = {
				preview: {
					value: new Blob([], { type: 'image/jpeg' }),
					origin: 'local',
				} as FilePreview,
			};
			await fileFetcher.copyFile(source, destination, copyOptions);

			const copiedFileObservable = getFileStreamsCache().get('copied-file-id');
			if (!copiedFileObservable) {
				return expect(copiedFileObservable).toBeDefined();
			}

			const copiedFileState = await toPromise(fromObservable(copiedFileObservable));
			if (!isPreviewableFileState(copiedFileState)) {
				return expect(isPreviewableFileState(copiedFileState)).toBeTruthy();
			}

			expect(copiedFileState.mimeType).toEqual(copiedFile.mimeType);

			const storedFileState = fileStateStore.getState().files['copied-file-id'];

			if (!isPreviewableFileState(storedFileState)) {
				return expect(isPreviewableFileState(storedFileState)).toBeTruthy();
			}

			expect(storedFileState.mimeType).toEqual(copiedFileState.mimeType);
		});

		it('should fetch remote processing states for files requiring remote preview', async () => {
			const { items, fileFetcher, mediaStore, mockAuthProvider } = setup();
			const copiedFile: MediaFile = {
				id: 'copied-file-id',
				name: 'copied-file-name',
				artifacts: {},
				mediaType: 'doc',
				mimeType: 'application/pdf',
				representations: {},
				size: 1,
			};
			const copyFileWithTokenMock = jest.fn().mockResolvedValue({ data: copiedFile });
			const tenantMediaStore = createMockMediaStore(jest.fn());
			tenantMediaStore.copyFileWithToken = copyFileWithTokenMock;

			const source = {
				id: items[0].id,
				collection: 'someCollectionName',
				authProvider: mockAuthProvider,
			};
			const destination = {
				collection: RECENTS_COLLECTION,
				authProvider: mockAuthProvider,
				mediaStore: tenantMediaStore,
			};
			await fileFetcher.copyFile(source, destination);
			expect(copyFileWithTokenMock).toHaveBeenCalledTimes(1);
			const { files } = fileStateStore.getState();
			expect(files['copied-file-id']).toEqual(expect.objectContaining(copiedFile));
			await sleep(0);
			expect(mediaStore.getItems).toHaveBeenCalledTimes(1);
			expect(mediaStore.getItems).toHaveBeenCalledWith(
				['copied-file-id'],
				destination.collection,
				expect.any(Object),
				undefined,
			);
		});

		it('should not fetch remote processing states for files not requiring remote preview', async () => {
			const { items, fileFetcher, mediaStore, mockAuthProvider } = setup();
			const copiedFile: MediaFile = {
				id: 'copied-file-id',
				name: 'copied-file-name',
				artifacts: {},
				mediaType: 'image',
				mimeType: 'image/jpeg',
				representations: {},
				size: 1,
			};
			const copyFileWithTokenMock = jest.fn().mockResolvedValue({ data: copiedFile });
			const tenantMediaStore = createMockMediaStore(jest.fn());
			tenantMediaStore.copyFileWithToken = copyFileWithTokenMock;

			const source = {
				id: items[0].id,
				collection: 'someCollectionName',
				authProvider: mockAuthProvider,
			};
			const destination = {
				collection: RECENTS_COLLECTION,
				authProvider: mockAuthProvider,
				mediaStore: tenantMediaStore,
			};

			const options = {
				preview: {
					value: new Blob([], { type: 'image/jpeg' }),
					origin: 'local',
				} as FilePreview,
			};

			await fileFetcher.copyFile(source, destination, options);
			expect(copyFileWithTokenMock).toHaveBeenCalledTimes(1);

			await sleep(0);
			expect(mediaStore.getItems).toHaveBeenCalledTimes(0);
		});

		it('should fetch remote processing states for files not supported by server', async () => {
			const { items, fileFetcher, mediaStore, mockAuthProvider } = setup();
			const copiedFile: MediaFile = {
				id: 'copied-file-id',
				name: 'copied-file-name',
				artifacts: {},
				mediaType: 'archive',
				mimeType: 'application/zip',
				representations: {},
				size: 1,
			};
			const copyFileWithTokenMock = jest.fn().mockResolvedValue({ data: copiedFile });
			const tenantMediaStore = createMockMediaStore(jest.fn());
			tenantMediaStore.copyFileWithToken = copyFileWithTokenMock;

			const source = {
				id: items[0].id,
				collection: 'someCollectionName',
				authProvider: mockAuthProvider,
			};
			const destination = {
				collection: RECENTS_COLLECTION,
				authProvider: mockAuthProvider,
				mediaStore: tenantMediaStore,
			};
			await fileFetcher.copyFile(source, destination);
			expect(copyFileWithTokenMock).toHaveBeenCalledTimes(1);

			await sleep(0);
			expect(mediaStore.getItems).toHaveBeenCalledTimes(0);
		});
	});

	describe('uploadExternal()', () => {
		const url = 'https://atlassian/logo.png';

		it('should return the correct format', async () => {
			const { fileFetcher } = setup();
			fetchMock.mock(
				url,
				{
					headers: { 'Content-Type': 'image/jpeg' },
					body: new Blob([], { type: 'image/jpeg' }),
				},
				{ sendAsJson: false },
			);
			const result = await fileFetcher.uploadExternal(url);

			expect(result).toEqual({
				dimensions: {
					height: 1,
					width: 1,
				},
				mimeType: 'image/jpeg',
				uploadableFileUpfrontIds: {
					id: 'upfront-id',
					occurrenceKey: 'upfront-occurrence-key',
				},
			});
		});

		it('should populate cache before upload finishes', async () => {
			const { fileFetcher } = setup();

			fileFetcher.uploadExternal(url);

			const fileObservable = getFileStreamsCache().get('upfront-id');
			if (!fileObservable) {
				return expect(fileObservable).toBeDefined();
			}

			const expectedFileState = expect.objectContaining({
				status: 'processing',
				name: 'logo.png',
				size: 0,
				mediaType: 'unknown',
				mimeType: '',
				id: 'upfront-id',
				occurrenceKey: 'upfront-occurrence-key',
			});

			const fileState = await toPromise(fromObservable(fileObservable));
			expect(fileState).toEqual(expectedFileState);

			const storedFileState = fileStateStore.getState().files['upfront-id'];
			expect(storedFileState).toEqual(expectedFileState);
		});

		it('should set preview on cache for that file', async () => {
			const { fileFetcher } = setup();
			fetchMock.mock(
				url,
				{
					headers: { 'Content-Type': 'image/jpeg' },
					body: new Blob([], { type: 'image/jpeg' }),
				},
				{ sendAsJson: false },
			);

			await fileFetcher.uploadExternal(url);

			const fileObservable = getFileStreamsCache().get('upfront-id');
			if (!fileObservable) {
				return expect(fileObservable).toBeDefined();
			}

			const fileState: any = await toPromise(fromObservable(fileObservable));
			expect(fileState.status).not.toBe('error');
			expect(fileState.preview).toBeDefined();

			expect((await fileState.preview).value).toBeInstanceOf(Blob);

			const storedFileState: any = fileStateStore.getState().files['upfront-id'];

			expect(storedFileState.status).not.toBe('error');
			expect(storedFileState.preview).toBeDefined();
		});

		it('should use collection name', async () => {
			const { fileFetcher } = setup();
			const uploadSpy = jest.spyOn(fileFetcher, 'upload');
			const collection = 'destination-collection';
			await fileFetcher.uploadExternal(url, collection);

			expect((fileFetcher as any).generateUploadableFileUpfrontIds).toBeCalledWith(
				collection,
				undefined,
			);
			expect(uploadSpy.mock.calls[0][0]).toEqual(expect.objectContaining({ collection }));
		});

		it('should pass trace context to generateUploadableFileUpfrontIds', async () => {
			const { fileFetcher } = setup();
			const uploadSpy = jest.spyOn(fileFetcher, 'upload');
			const collection = 'destination-collection';

			const traceContext = {
				traceId: 'some-trace-id',
				spanId: 'some-span-id',
			};

			await fileFetcher.uploadExternal(url, collection, traceContext);

			expect((fileFetcher as any).generateUploadableFileUpfrontIds).toBeCalledWith(
				collection,
				traceContext,
			);

			expect(uploadSpy.mock.calls[0][0]).toEqual(expect.objectContaining({ collection }));
			expect(uploadSpy.mock.calls[0][3]).toEqual(traceContext);
		});

		it('should extract the name from the url', async () => {
			const { fileFetcher } = setup();

			fileFetcher.uploadExternal('domain.com/path/file_name.mov');

			const fileObservable = getFileStreamsCache().get('upfront-id');
			if (!fileObservable) {
				return expect(fileObservable).toBeDefined();
			}

			const fileState = await toPromise(fromObservable(fileObservable));
			expect(fileState).toEqual(
				expect.objectContaining({
					name: 'file_name.mov',
				}),
			);
		});

		it('should set the right mediaType', async () => {
			const { fileFetcher } = setup();
			fetchMock.mock(
				url,
				{
					headers: { 'Content-Type': 'image/jpeg' },
					body: new Blob([], { type: 'image/jpeg' }),
				},
				{ sendAsJson: false },
			);

			await fileFetcher.uploadExternal(url);

			const fileObservable = getFileStreamsCache().get('upfront-id');
			if (!fileObservable) {
				return expect(fileObservable).toBeDefined();
			}

			const expectedFileState = expect.objectContaining({
				mediaType: 'image',
			});

			const fileState = await toPromise(fromObservable(fileObservable));
			expect(fileState).toEqual(expectedFileState);

			expect(fileStateStore.getState().files['upfront-id']).toEqual(expectedFileState);
		});

		it('should set throw an error when `getDimensionsFromBlob` throws an error ', async () => {
			const error = new Error('Test Error');
			(getDimensionsFromBlob as jest.Mock).mockImplementation(() => {
				throw error;
			});
			const { fileFetcher } = setup();
			fetchMock.mock(
				url,
				{
					headers: { 'Content-Type': 'image/jpeg' },
					body: new Blob([], { type: 'text/html' }),
				},
				{ sendAsJson: false },
			);

			await expect(fileFetcher.uploadExternal(url)).rejects.toEqual(error);
		});
	});

	describe('upload()', () => {
		it('should populate cache before upload finishes', async () => {
			const { fileFetcher, createUploadableFile, uploadFileUpfrontIds } = setup();
			fileFetcher.upload(
				createUploadableFile('logo.png', 'image/png'),
				undefined,
				uploadFileUpfrontIds,
			);

			const fileObservable = getFileStreamsCache().get('upfront-id');
			if (!fileObservable) {
				return expect(fileObservable).toBeDefined();
			}

			const expectedFileState = expect.objectContaining({
				status: 'uploading',
				name: 'logo.png',
				size: 0,
				mediaType: 'image',
				mimeType: 'image/png',
				id: 'upfront-id',
				occurrenceKey: 'upfront-occurrence-key',
			});

			const fileState = await toPromise(fromObservable(fileObservable));
			expect(fileState).toEqual(
				expect.objectContaining({
					status: 'uploading',
					name: 'logo.png',
					size: 0,
					mediaType: 'image',
					mimeType: 'image/png',
					id: 'upfront-id',
					occurrenceKey: 'upfront-occurrence-key',
				}),
			);

			const storedFileState = fileStateStore.getState().files['upfront-id'];
			expect(storedFileState).toEqual(expectedFileState);
		});

		it('should be abortable', async () => {
			const { fileFetcher, createUploadableFile, uploadFileUpfrontIds } = setup();
			const uploadController = new UploadController();

			asMockFunction(uploadFile).mockImplementation(
				(
					_1: UploadableFile,
					_2: MediaStore,
					_3: UploadableFileUpfrontIds,
					callbacks?: UploadFileCallbacks,
				) => {
					if (callbacks) {
						callbacks.onProgress(0);
						setImmediate(() => {
							callbacks.onProgress(0.5);
							callbacks.onProgress(1);
							callbacks.onUploadFinish();
						});
					}

					return {
						cancel: jest.fn(),
					};
				},
			);
			fileFetcher.upload(
				createUploadableFile('logo.png', 'image/png'),
				uploadController,
				uploadFileUpfrontIds,
			);

			uploadController.abort();

			const fileObservable = getFileStreamsCache().get('upfront-id');
			if (!fileObservable) {
				return expect(fileObservable).toBeDefined();
			}
			const expectedFileState = expect.objectContaining({
				status: 'uploading',
				progress: 0,
				name: 'logo.png',
				size: 0,
				mediaType: 'image',
				mimeType: 'image/png',
				id: 'upfront-id',
				occurrenceKey: 'upfront-occurrence-key',
			});

			const fileState = await toPromise(fromObservable(fileObservable));
			expect(fileState).toEqual(expectedFileState);

			const storedFileState = fileStateStore.getState().files['upfront-id'];
			expect(storedFileState).toEqual(expectedFileState);
		});

		it('should set preview on cache for that file', async () => {
			const { fileFetcher, createUploadableFile, uploadFileUpfrontIds } = setup();

			fileFetcher.upload(
				createUploadableFile('logo.png', 'image/png'),
				undefined,
				uploadFileUpfrontIds,
			);

			const fileObservable = getFileStreamsCache().get('upfront-id');
			if (!fileObservable) {
				return expect(fileObservable).toBeDefined();
			}

			const fileState: any = await toPromise(fromObservable(fileObservable));

			const filePreview = fileState.preview;
			if (!filePreview) {
				return expect(filePreview).toBeDefined();
			}

			expect((await filePreview).value).toBeInstanceOf(Blob);

			const storedFileState: any = fileStateStore.getState().files['upfront-id'];
			expect(storedFileState.preview).toBeDefined();
		});

		it('should set the right mediaType', async () => {
			const { fileFetcher, createUploadableFile, uploadFileUpfrontIds } = setup();

			fileFetcher.upload(
				createUploadableFile('logo.png', 'image/png'),
				undefined,
				uploadFileUpfrontIds,
			);

			const fileObservable = getFileStreamsCache().get('upfront-id');
			if (!fileObservable) {
				return expect(fileObservable).toBeDefined();
			}

			const expectedFileState = expect.objectContaining({
				mediaType: 'image',
			});

			const fileState = await toPromise(fromObservable(fileObservable));
			expect(fileState).toEqual(expectedFileState);

			const storedFileState = fileStateStore.getState().files['upfront-id'];
			expect(storedFileState).toEqual(expectedFileState);
		});

		it('should emit @atlaskit/chunkinator errors through ReplaySubject', async () => {
			const { fileFetcher, createUploadableFile, uploadFileUpfrontIds } = setup();

			const error = new Error('chunkinator any kind of error');

			asMockFunction(uploadFile).mockImplementation(
				(
					_1: UploadableFile,
					_2: MediaStore,
					_3: UploadableFileUpfrontIds,
					callbacks?: UploadFileCallbacks,
				) => {
					if (callbacks) {
						callbacks.onUploadFinish(error);
					}

					return {
						cancel: jest.fn(),
					};
				},
			);

			fileFetcher.upload(
				createUploadableFile('logo.png', 'image/png'),
				undefined,
				uploadFileUpfrontIds,
			);

			const fileObservable = getFileStreamsCache().get('upfront-id');
			if (!fileObservable) {
				return expect(fileObservable).toBeDefined();
			}

			try {
				await toPromise(fromObservable(fileObservable));
			} catch (err) {
				expect(err).toEqual(error);
			}
			const storedFileState = fileStateStore.getState().files['upfront-id'];
			expect(storedFileState).toEqual(expect.objectContaining(error));
		});

		it('should fetch remote processing states for files requiring remote preview', (done) => {
			const { mediaStore, fileFetcher, createUploadableFile, uploadFileUpfrontIds } = setup();

			fileFetcher.upload(
				createUploadableFile('image.heic', 'image/heic'), // requires remote preview

				undefined,
				uploadFileUpfrontIds,
			);

			setImmediate(() => {
				expect(mediaStore.getItems).toHaveBeenCalledTimes(1);
				done();
			});
		});

		it(`should fetch remote processing states for files not requiring remote preview`, (done) => {
			const { mediaStore, fileFetcher, createUploadableFile, uploadFileUpfrontIds } = setup();

			fileFetcher.upload(
				createUploadableFile('image.jpg', 'image/jpeg'), // doesn't require remote preview
				undefined,
				uploadFileUpfrontIds,
			);

			setImmediate(() => {
				expect(mediaStore.getItems).toHaveBeenCalledTimes(1);
				done();
			});
		});

		it(`should fetch remote processing states for files not supported by server`, (done) => {
			const { mediaStore, fileFetcher, createUploadableFile, uploadFileUpfrontIds } = setup();

			fileFetcher.upload(
				createUploadableFile('archive.zip', 'application/zip'), // not supported by server
				undefined,
				uploadFileUpfrontIds,
			);

			expect(isMimeTypeSupportedByServer('application/zip')).toEqual(false);

			setImmediate(() => {
				expect(mediaStore.getItems).toHaveBeenCalledTimes(1);
				done();
			});
		});

		it('should pass trace context to generateUploadableFileUpfrontIds and uploadFile', async () => {
			const { fileFetcher, createUploadableFile } = setup();
			asMock(uploadFile).mockClear();
			const collection = 'destination-collection';

			const traceContext = {
				traceId: 'some-trace-id',
				spanId: 'some-span-id',
			};

			await fileFetcher.upload(
				createUploadableFile('image.jpg', 'image/jpeg', collection), // doesn't require remote preview
				undefined,
				undefined,
				traceContext,
			);

			expect((fileFetcher as any).generateUploadableFileUpfrontIds).toBeCalledWith(
				collection,
				traceContext,
			);
			expect(asMock(uploadFile).mock.calls[0][4]).toBe(traceContext);
		});
	});

	describe('getVideoDurations()', () => {
		const processedVideoState = {
			id: 'some-id',
			status: 'processed',
			name: 'my video',
			size: 11222,
			mediaType: 'video',
			mimeType: 'mp4',
			artifacts: {
				'video.mp4': {
					url: '/video',
					processingStatus: 'succeeded',
				},
			},
			representations: {},
		} as const;

		const responseData =
			'AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAUQbW9vdgAAAGxtdmhkAAAAAAAAAAAAAAAAAAAD6AAAEh0AAQAAAQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAABDt0cmFrAAAAXHRraGQAAAADAAAAAAAAAAAAAAABAAAAAAAAEh0AAAAAAAAAAAAAAAA=';

		it('should return duration of video when requested for valid video file', async () => {
			const fileStateStore = createMediaStore({
				files: { 'some-id': processedVideoState },
			});

			const mediaApi = createMockMediaStore(jest.fn());
			mediaApi.getArtifactURL = async () => 'http://some-api/file/id?somep-param';

			mediaApi.request = async () => {
				const arrayBuffer = Uint8Array.from(atob(responseData), (c) => c.charCodeAt(0));
				return new Response(arrayBuffer.buffer);
			};

			const fileFetcher = new FileFetcherImpl(mediaApi, fileStateStore);

			const durations = await fileFetcher.getVideoDurations([{ id: 'some-id' }]);

			expect(durations).toEqual({
				'some-id': 4,
			});
		});

		it.each([
			['file is not a video', { ...processedVideoState, mediaType: 'unknown' } as const],
			['file is not processed', { ...processedVideoState, status: 'processing' } as const],
			[
				'video does not have video.mp4 artifact',
				{ ...processedVideoState, artifacts: {} } as const,
			],
		])('should not return the duration when %s', async (_title, fileState) => {
			const fileStateStore = createMediaStore({
				files: { 'some-id': fileState },
			});

			const mediaApi = createMockMediaStore(jest.fn());
			mediaApi.getArtifactURL = async () => 'http://some-api/file/id?somep-param';

			mediaApi.request = async () => {
				const arrayBuffer = Uint8Array.from(atob(responseData), (c) => c.charCodeAt(0));
				return new Response(arrayBuffer.buffer);
			};

			const fileFetcher = new FileFetcherImpl(mediaApi, fileStateStore);

			const durations = await fileFetcher.getVideoDurations([{ id: 'some-id' }]);

			expect(durations).toEqual({});
		});

		it('should not return the duration of a file that is not a video', async () => {
			const fileStateStore = createMediaStore({
				files: { 'some-id': { ...processedVideoState } },
			});

			const mediaApi = createMockMediaStore(jest.fn());
			mediaApi.getArtifactURL = async () => 'http://some-api/file/id?somep-param';

			mediaApi.request = async () => {
				const arrayBuffer = Uint8Array.from(atob(responseData), (c) => c.charCodeAt(0));
				return new Response(arrayBuffer.buffer);
			};

			const fileFetcher = new FileFetcherImpl(mediaApi, fileStateStore);

			const durations = await fileFetcher.getVideoDurations([{ id: 'some-id' }]);

			expect(durations).toEqual({
				'some-id': 4,
			});
		});
	});

	describe('FileFetcherError', () => {
		it('should be identifiable', () => {
			const unknownError = new Error('unknown error');
			expect(isFileFetcherError(unknownError)).toBeFalsy();
			const fileFetcherError = new FileFetcherError('invalidFileId', { id: 'some-id' });
			expect(isFileFetcherError(fileFetcherError)).toBeTruthy();
		});

		it('should return the right arguments', () => {
			const fileFetcherError = new FileFetcherError('invalidFileId', {
				id: 'id',
				collectionName: 'collectionName',
				occurrenceKey: 'occurrenceKey',
			});
			expect(fileFetcherError.reason).toBe('invalidFileId');
			expect(fileFetcherError.metadata).toMatchObject({
				id: 'id',
				collectionName: 'collectionName',
				occurrenceKey: 'occurrenceKey',
			});
		});
	});

	describe('uploadArtifact', () => {
		it('should call mediaApi.uploadArtifact and return data', async () => {
			const { fileFetcher, mediaStore } = setup();
			const fileId = 'test-file-id';
			const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
			const params = {
				type: 'caption' as const,
				language: 'en',
			};
			const collectionName = 'test-collection';
			const traceContext = {
				traceId: 'test-trace-id',
				spanId: 'test-span-id',
			};

			const expectedResponse = {
				id: fileId,
				name: 'test.txt',
				mimeType: 'text/plain',
				processingStatus: 'succeeded',
				artifacts: {
					'test-artifact': {
						url: 'https://test-url.com/artifact',
					},
				},
				representations: {},
				size: 12,
			};

			(mediaStore.uploadArtifact as jest.Mock).mockResolvedValue({
				data: expectedResponse,
			});

			const result = await fileFetcher.uploadArtifact(
				fileId,
				file,
				params,
				collectionName,
				traceContext,
			);

			expect(mediaStore.uploadArtifact).toHaveBeenCalledWith(
				fileId,
				file,
				params,
				collectionName,
				traceContext,
			);
			expect(result).toEqual(expectedResponse);
		});

		it('should handle errors from mediaApi.uploadArtifact', async () => {
			const { fileFetcher, mediaStore } = setup();
			const fileId = 'test-file-id';
			const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
			const params = {
				type: 'caption' as const,
				language: 'en',
			};
			const collectionName = 'test-collection';
			const traceContext = {
				traceId: 'test-trace-id',
				spanId: 'test-span-id',
			};

			const error = new Error('Upload failed');
			(mediaStore.uploadArtifact as jest.Mock).mockRejectedValue(error);

			await expect(
				fileFetcher.uploadArtifact(fileId, file, params, collectionName, traceContext),
			).rejects.toThrow('Upload failed');

			expect(mediaStore.uploadArtifact).toHaveBeenCalledWith(
				fileId,
				file,
				params,
				collectionName,
				traceContext,
			);
		});
	});
});

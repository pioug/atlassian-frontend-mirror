jest.mock('../../utils/checkWebpSupport');
jest.mock('../../client/media-store/resolveAuth');
jest.mock('../../utils/pathBasedUrl');
import {
	type CreatedTouchedFile,
	MediaStore,
	type MediaUpload,
	type MediaFile,
	type MediaStoreGetFileParams,
	type ItemsPayload,
	type ImageMetadata,
	type MediaStoreTouchFileBody,
	type TouchFileDescriptor,
	type TouchedFiles,
	type MediaStoreTouchFileParams,
	type MediaFileArtifacts,
	checkWebpSupport,
	isRequestError,
	isMediaStoreError,
	MediaStoreError,
	getMediaEnvironment,
	getMediaRegion,
} from '../..';
import { FILE_CACHE_MAX_AGE } from '../../constants';
import { resolveAuth, resolveInitialAuth } from '../../client/media-store/resolveAuth';
import { type Auth } from '@atlaskit/media-core';
import * as requestModule from '../../utils/request';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { nextTick } from '@atlaskit/media-common/test-helpers';
import { mapToPathBasedUrl } from '../../utils/pathBasedUrl';

const requestModuleMock = jest.spyOn(requestModule, 'request');
const mapToPathBasedUrlMock = mapToPathBasedUrl as jest.MockedFunction<typeof mapToPathBasedUrl>;

export const ZipkinHeaderKeys = {
	traceId: 'x-b3-traceid',
	spanId: 'x-b3-spanid',
	parentSpanId: 'x-b3-parentspanid',
	sampled: 'x-b3-sampled',
	flags: 'x-b3-flags',
};

const baseUrl = 'http://some-host';
const clientId = 'some-client-id';
const token = 'some-token';
const auth = {
	baseUrl,
	clientId,
	token,
};
(resolveAuth as jest.Mock).mockResolvedValue(auth);
(resolveInitialAuth as jest.Mock).mockImplementation((auth: Auth) => auth);
const authProvider = jest.fn();
let mediaStore: MediaStore;

describe('MediaStore', () => {
	const checkWebpSupportMock = checkWebpSupport as jest.Mock;

	beforeAll(() => {
		jest.useFakeTimers();
	});

	afterAll(() => {
		jest.useRealTimers();
	});

	afterEach(() => {
		fetchMock.resetMocks();
	});

	describe('given auth provider resolves', () => {
		const data: MediaFile = {
			id: 'faee2a3a-f37d-11e4-aae2-3c15c2c70ce6',
			mediaType: 'doc',
			mimeType: 'application/pdf',
			name: 'example document.pdf',
			processingStatus: 'pending',
			size: 231392,
			artifacts: {},
			representations: {},
		};

		beforeEach(() => {
			jest.clearAllMocks();
			mediaStore = new MediaStore({ authProvider });

			// @ts-expect-error - TS2790 - The operand of a 'delete' operator must be optional.
			delete global.MICROS_PERIMETER;
			window.location.hostname = 'hello.atlassian.net';

			// Reset path-based URL mock to return input unchanged by default
			mapToPathBasedUrlMock.mockImplementation((url: string) => url);
		});

		describe('fetch media region & environment', () => {
			const setup = async (headers: any) => {
				const collectionName = 'some-collection-name';
				const data: ItemsPayload[] = [];

				fetchMock.once(JSON.stringify({ data }), {
					status: 201,
					statusText: 'Created',
					headers,
				});

				await mediaStore.getItems(['some-id'], collectionName);
			};

			it('should give media environment as undefined if not received', async () => {
				await setup({});

				const receivedMediaEnv = getMediaEnvironment();

				expect(receivedMediaEnv).toEqual(undefined);
			});

			it('should get media environment from header', async () => {
				await setup({ 'x-media-env': 'mediaRegion' });

				const receivedMediaEnv = getMediaEnvironment();

				expect(receivedMediaEnv).toEqual('mediaRegion');
			});

			it('should return media region as undefined if not set', () => {
				const receivedMediaRegion = getMediaRegion();

				expect(receivedMediaRegion).toBe(undefined);
			});

			it('should store region from header in sessionStorage', async () => {
				await setup({ 'x-media-region': 'someRegion' });

				expect(window.sessionStorage.getItem('media-api-region')).toEqual('someRegion');
				expect(getMediaRegion()).toEqual('someRegion');
			});
		});

		describe('path-based URL transformation', () => {
			ffTest(
				'platform_media_path_based_route',
				async () => {
					const collectionName = 'some-collection-name';
					const data: ItemsPayload[] = [];
					const transformedUrl = 'https://current.atlassian.net/items';

					// Mock the transformation
					mapToPathBasedUrlMock.mockReturnValue(transformedUrl);

					fetchMock.once(JSON.stringify({ data }), {
						status: 200,
						statusText: 'Ok',
					});

					await mediaStore.getItems(['some-id'], collectionName);

					// Verify mapToPathBasedUrl was called with the original URL
					expect(mapToPathBasedUrlMock).toHaveBeenCalledWith(`${baseUrl}/items`);
					expect(mapToPathBasedUrlMock).toHaveBeenCalledTimes(1);

					// Verify the transformed URL was used in the request
					expect(requestModuleMock).toHaveBeenCalledWith(
						transformedUrl,
						expect.objectContaining({
							auth: expect.objectContaining({
								baseUrl,
								clientId,
								token,
							}),
							method: 'POST',
							endpoint: '/items',
						}),
						undefined,
					);
				},
				async () => {
					const collectionName = 'some-collection-name';
					const data: ItemsPayload[] = [];

					fetchMock.once(JSON.stringify({ data }), {
						status: 200,
						statusText: 'Ok',
					});

					await mediaStore.getItems(['some-id'], collectionName);

					// Verify mapToPathBasedUrl was NOT called
					expect(mapToPathBasedUrlMock).not.toHaveBeenCalled();

					// Verify the original URL was used
					expect(requestModuleMock).toHaveBeenCalledWith(
						`${baseUrl}/items`,
						expect.objectContaining({
							method: 'POST',
							endpoint: '/items',
						}),
						undefined,
					);
				},
			);
		});

		describe('createUpload', () => {
			it('should POST to /upload endpoint with correct options', async () => {
				const createUpTo = 1;
				const data: MediaUpload[] = [{ id: 'some-upload-id', created: 123, expires: 456 }];

				fetchMock.once(JSON.stringify({ data }), {
					status: 201,
					statusText: 'Created',
				});

				const response = await mediaStore.createUpload(createUpTo);
				expect(response).toEqual({ data });

				expect(fetchMock).toHaveBeenCalledWith(
					`${baseUrl}/upload?createUpTo=${createUpTo}&hashAlgorithm=sha256`,
					{
						method: 'POST',
						headers: {
							'X-Client-Id': clientId,
							Authorization: `Bearer ${token}`,
							Accept: 'application/json',
						},
					},
				);
			});

			it('should include optional upload algorithm when calling POST /upload', async () => {
				const createUpTo = 1;
				const data: MediaUpload[] = [{ id: 'some-upload-id', created: 123, expires: 456 }];

				fetchMock.once(JSON.stringify({ data }), {
					status: 201,
					statusText: 'Created',
				});

				const response = await mediaStore.createUpload(createUpTo);
				expect(response).toEqual({ data });

				expect(fetchMock).toHaveBeenCalledWith(
					`${baseUrl}/upload?createUpTo=${createUpTo}&hashAlgorithm=sha256`,
					{
						method: 'POST',
						headers: {
							'X-Client-Id': clientId,
							Authorization: `Bearer ${token}`,
							Accept: 'application/json',
						},
					},
				);
			});

			it('should pass collection name to the authContext', async () => {
				mediaStore.request = jest.fn().mockReturnValue(Promise.resolve({ json() {} }));
				await mediaStore.createUpload(undefined, 'my-collection');

				expect(mediaStore.request).toBeCalledWith('/upload', {
					method: 'POST',
					endpoint: '/upload',
					authContext: {
						collectionName: 'my-collection',
					},
					params: { createUpTo: 1, hashAlgorithm: 'sha256' },
					headers: {
						Accept: 'application/json',
					},
				});
			});

			it('should fail if response is malformed JSON', async () => {
				const createUpTo = 1;

				fetchMock.once('Invalid Body', {
					status: 201,
					statusText: 'Created',
					headers: { 'x-media-region': 'ap-southeast-2' },
				});

				try {
					await mediaStore.createUpload(createUpTo);
				} catch (err) {
					// @ts-expect-error
					if (!isRequestError(err)) {
						// @ts-expect-error
						return expect(isRequestError(err)).toBeTruthy();
					}

					expect(err.attributes).toMatchObject({
						reason: 'serverInvalidBody',
						method: 'POST',
						endpoint: '/upload',
						mediaRegion: 'ap-southeast-2',
						mediaEnv: 'unknown',
						statusCode: 201,
						innerError: expect.any(Error),
					});
					expect(err.reason).toBe('serverInvalidBody');
					expect(err.metadata).toMatchObject({
						method: 'POST',
						endpoint: '/upload',
						mediaRegion: 'ap-southeast-2',
						mediaEnv: 'unknown',
						statusCode: 201,
					});
					expect(err.innerError).toMatchObject(expect.any(Error));
				}

				expect.assertions(4);
			});

			it('calls request with traceContext', async () => {
				const createUpTo = 1;
				const data: MediaUpload[] = [{ id: 'some-upload-id', created: 123, expires: 456 }];

				fetchMock.once(JSON.stringify({ data }), {
					status: 201,
					statusText: 'Created',
				});

				await mediaStore.createUpload(createUpTo, undefined, {
					traceId: 'test-trace-id',
				});

				expect(requestModuleMock).toBeCalledWith(
					`${baseUrl}/upload`,
					expect.objectContaining({
						auth: {
							baseUrl: 'http://some-host',
							clientId: 'some-client-id',
							token: 'some-token',
						},
						endpoint: '/upload',
						headers: { Accept: 'application/json' },
						method: 'POST',
						params: { createUpTo: 1, hashAlgorithm: 'sha256' },
						traceContext: {
							traceId: 'test-trace-id',
							spanId: expect.any(String),
						},
					}),
					undefined,
				);
			});
		});

		describe('uploadChunk', () => {
			const testUploadId = 'test-upload-id';
			const testPartNumber = 191;
			const etag = 'some-etag';
			const blob = new Blob(['some-blob']);

			it.each([
				['', undefined, undefined],
				[`?partNumber=${testPartNumber}&uploadId=${testUploadId}`, testUploadId, testPartNumber],
				[`?partNumber=${testPartNumber}`, undefined, testPartNumber],
				[`?uploadId=${testUploadId}`, testUploadId, undefined],
			])(
				'should PUT to /chunk/:etag endpoint with correct query %s',

				async (query, uploadId, partNumber) => {
					fetchMock.once('', {
						status: 201,
						statusText: 'Created',
					});

					await mediaStore.uploadChunk(etag, blob, uploadId!, partNumber!);

					expect(fetchMock).toHaveBeenCalledWith(`${baseUrl}/chunk/${etag}${query}`, {
						method: 'PUT',
						headers: {
							'X-Client-Id': clientId,
							Authorization: `Bearer ${token}`,
						},
						body: blob,
					});
				},
			);

			it('calls request with traceContext', async () => {
				const data: MediaUpload[] = [{ id: 'some-upload-id', created: 123, expires: 456 }];

				fetchMock.once(JSON.stringify({ data }), {
					status: 201,
					statusText: 'Created',
				});
				await mediaStore.uploadChunk(etag, blob, testUploadId, testPartNumber, undefined, {
					traceId: 'test-trace-id',
				});

				expect(requestModuleMock).toBeCalledWith(
					`${baseUrl}/chunk/some-etag`,
					expect.objectContaining({
						auth: {
							baseUrl: 'http://some-host',
							clientId: 'some-client-id',
							token: 'some-token',
						},
						/**
						 * tests would not pass is left as
						 * body: {} */
						body: expect.any(Object),
						clientOptions: undefined,
						endpoint: '/chunk/{etag}',
						headers: undefined,
						method: 'PUT',
						params: { partNumber: 191, uploadId: 'test-upload-id' },
						traceContext: {
							traceId: 'test-trace-id',
							spanId: expect.any(String),
						},
					}),
					undefined,
				);
			});
		});

		describe('createFileFromUpload', () => {
			it('should POST to /file/upload endpoint with correct options', async () => {
				const body = {
					uploadId: 'some-upload-id',
					name: 'some-name',
					mimeType: 'application/pdf',
					conditions: {
						hash: 'sha1:da39a3ee5e6b4b0d3255bfef95601890afd80709',
						size: 42,
					},
				};
				const params = {
					collection: 'some-collection',
					occurrenceKey: 'some-occurrence-key',
					expireAfter: 123,
					replaceFileId: 'some-replace-file-id',
					skipConversions: true,
				};

				fetchMock.once(JSON.stringify({ data }), {
					status: 201,
					statusText: 'Created',
				});

				const response = await mediaStore.createFileFromUpload(body, params);
				const expectedQueryParams =
					'collection=some-collection&expireAfter=123&occurrenceKey=some-occurrence-key&replaceFileId=some-replace-file-id&skipConversions=true';
				expect(response).toEqual({ data });
				expect(fetchMock).toHaveBeenCalledWith(`${baseUrl}/file/upload?${expectedQueryParams}`, {
					method: 'POST',
					headers: {
						'X-Client-Id': clientId,
						Authorization: `Bearer ${token}`,
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(body),
				});
			});

			it('should fail if response is malformed JSON', async () => {
				const body = {
					uploadId: 'some-upload-id',
					name: 'some-name',
					mimeType: 'application/pdf',
					conditions: {
						hash: 'sha1:da39a3ee5e6b4b0d3255bfef95601890afd80709',
						size: 42,
					},
				};
				const params = {
					collection: 'some-collection',
					occurrenceKey: 'some-occurrence-key',
					expireAfter: 123,
					replaceFileId: 'some-replace-file-id',
					skipConversions: true,
				};

				fetchMock.once('Invalid Body', {
					status: 201,
					statusText: 'Created',
				});

				try {
					await mediaStore.createFileFromUpload(body, params);
				} catch (err) {
					// @ts-expect-error
					if (!isRequestError(err)) {
						// @ts-expect-error
						return expect(isRequestError(err)).toBeTruthy();
					}

					expect(err.attributes).toMatchObject({
						reason: 'serverInvalidBody',
						method: 'POST',
						endpoint: '/file/upload',
						statusCode: 201,
						innerError: expect.any(Error),
					});
					expect(err.reason).toBe('serverInvalidBody');
					expect(err.metadata).toMatchObject({
						method: 'POST',
						endpoint: '/file/upload',
						statusCode: 201,
					});
					expect(err.innerError).toMatchObject(expect.any(Error));
				}

				expect.assertions(4);
			});

			it('calls request with traceContext', async () => {
				const body = {
					uploadId: 'some-upload-id',
					name: 'some-name',
					mimeType: 'application/pdf',
					conditions: {
						hash: 'sha1:da39a3ee5e6b4b0d3255bfef95601890afd80709',
						size: 42,
					},
				};
				const params = {
					collection: 'some-collection',
					occurrenceKey: 'some-occurrence-key',
					expireAfter: 123,
					replaceFileId: 'some-replace-file-id',
					skipConversions: true,
				};

				fetchMock.once(JSON.stringify({ data }), {
					status: 201,
					statusText: 'Created',
				});

				await mediaStore.createFileFromUpload(body, params, {
					traceId: 'test-trace-id',
				});

				fetchMock.once(JSON.stringify({ data }), {
					status: 200,
					statusText: 'Ok',
				});

				expect(requestModuleMock).toBeCalledWith(
					`${baseUrl}/file/upload`,
					expect.objectContaining({
						auth: {
							baseUrl: 'http://some-host',
							clientId: 'some-client-id',
							token: 'some-token',
						},
						body: '{"uploadId":"some-upload-id","name":"some-name","mimeType":"application/pdf","conditions":{"hash":"sha1:da39a3ee5e6b4b0d3255bfef95601890afd80709","size":42}}',
						clientOptions: undefined,
						endpoint: '/file/upload',
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json',
						},
						method: 'POST',
						params: {
							collection: 'some-collection',
							expireAfter: 123,
							occurrenceKey: 'some-occurrence-key',
							replaceFileId: 'some-replace-file-id',
							skipConversions: true,
						},
						traceContext: {
							traceId: 'test-trace-id',
							spanId: expect.any(String),
						},
					}),
					undefined,
				);
			});
		});

		describe('getFile', () => {
			it('should GET to /file/{fileId} endpoint with correct options', async () => {
				const collectionName = 'some-collection-name';
				const fileId = 'faee2a3a-f37d-11e4-aae2-3c15c2c70ce6';
				const params: MediaStoreGetFileParams = {
					collection: collectionName,
				};

				fetchMock.once(JSON.stringify({ data }), {
					status: 200,
					statusText: 'Ok',
				});

				const response = await mediaStore.getFile(fileId, params);

				expect(response).toEqual({ data });
				expect(fetchMock).toHaveBeenCalledWith(
					`${baseUrl}/file/${fileId}?collection=${collectionName}`,
					{
						method: 'GET',
						headers: {
							'X-Client-Id': clientId,
							Authorization: `Bearer ${token}`,
						},
					},
				);
				expect(resolveAuth).toHaveBeenCalledWith(
					authProvider,
					{
						collectionName,
					},
					undefined,
				);
			});

			it('should fail if response is malformed JSON', async () => {
				const collectionName = 'some-collection-name';
				const fileId = 'faee2a3a-f37d-11e4-aae2-3c15c2c70ce6';
				const params: MediaStoreGetFileParams = {
					collection: collectionName,
				};

				fetchMock.once('Invalid Body', {
					status: 200,
					statusText: 'Ok',
				});

				try {
					await mediaStore.getFile(fileId, params);
				} catch (err) {
					// @ts-expect-error
					if (!isRequestError(err)) {
						// @ts-expect-error
						return expect(isRequestError(err)).toBeTruthy();
					}

					expect(err.attributes).toMatchObject({
						reason: 'serverInvalidBody',
						method: 'GET',
						endpoint: '/file/{fileId}',
						statusCode: 200,
						innerError: expect.any(Error),
					});
					expect(err.reason).toBe('serverInvalidBody');
					expect(err.metadata).toMatchObject({
						method: 'GET',
						endpoint: '/file/{fileId}',
						statusCode: 200,
					});
					expect(err.innerError).toMatchObject(expect.any(Error));
				}

				expect.assertions(4);
			});

			it('calls request with traceContext', async () => {
				const collectionName = 'some-collection-name';
				const fileId = 'faee2a3a-f37d-11e4-aae2-3c15c2c70ce6';
				const params: MediaStoreGetFileParams = {
					collection: collectionName,
				};

				fetchMock.once(JSON.stringify({ data }), {
					status: 200,
					statusText: 'Ok',
				});

				await mediaStore.getFile(fileId, params, { traceId: 'test-trace-id' });

				expect(requestModuleMock).toBeCalledWith(
					`${baseUrl}/file/faee2a3a-f37d-11e4-aae2-3c15c2c70ce6`,
					expect.objectContaining({
						auth: {
							baseUrl: 'http://some-host',
							clientId: 'some-client-id',
							token: 'some-token',
						},
						body: undefined,
						clientOptions: undefined,
						endpoint: '/file/{fileId}',
						headers: undefined,
						method: 'GET',
						params: { collection: 'some-collection-name' },
						traceContext: {
							traceId: 'test-trace-id',
							spanId: expect.any(String),
						},
					}),
					undefined,
				);
			});
		});

		describe('appendChunksToUpload', () => {
			it('should PUT to /upload/{uploadId}/chunks endpoint with correct options', async () => {
				const uploadId = '29c49470-adac-4b16-82ec-301340c7b16a';
				const body = {
					chunks: [
						'0675a983536736a69f835438bcf8629e044f190d-4096',
						'e6295a0966535d295582670afeeb14059969d359-209',
					],
					hash: 'sha1:b0edf951dd0c86f80d989e20b9dc3060c53d66a6',
					offset: 0,
				};

				fetchMock.once('', {
					status: 200,
					statusText: 'Ok',
				});

				await mediaStore.appendChunksToUpload(uploadId, body);

				expect(fetchMock).toHaveBeenCalledWith(`${baseUrl}/upload/${uploadId}/chunks`, {
					method: 'PUT',
					headers: {
						'X-Client-Id': clientId,
						Authorization: `Bearer ${token}`,
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(body),
				});
			});

			it('calls request with traceContext', async () => {
				const uploadId = '29c49470-adac-4b16-82ec-301340c7b16a';
				const body = {
					chunks: [
						'0675a983536736a69f835438bcf8629e044f190d-4096',
						'e6295a0966535d295582670afeeb14059969d359-209',
					],
					hash: 'sha1:b0edf951dd0c86f80d989e20b9dc3060c53d66a6',
					offset: 0,
				};

				fetchMock.once('', {
					status: 200,
					statusText: 'Ok',
				});

				await mediaStore.appendChunksToUpload(uploadId, body, undefined, {
					traceId: 'test-trace-id',
				});

				expect(requestModuleMock).toBeCalledWith(
					`${baseUrl}/upload/29c49470-adac-4b16-82ec-301340c7b16a/chunks`,
					expect.objectContaining({
						auth: {
							baseUrl: 'http://some-host',
							clientId: 'some-client-id',
							token: 'some-token',
						},
						body: '{"chunks":["0675a983536736a69f835438bcf8629e044f190d-4096","e6295a0966535d295582670afeeb14059969d359-209"],"hash":"sha1:b0edf951dd0c86f80d989e20b9dc3060c53d66a6","offset":0}',
						clientOptions: undefined,
						endpoint: '/upload/{uploadId}/chunks',
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json',
						},
						method: 'PUT',
						params: undefined,
						traceContext: {
							traceId: 'test-trace-id',
							spanId: expect.any(String),
						},
					}),
					undefined,
				);
			});
		});

		describe('touchFiles', () => {
			const createdTouchedFile1: CreatedTouchedFile = {
				fileId: 'some-file-id',
				uploadId: 'some-upload-id',
			};
			const createdTouchedFile2: CreatedTouchedFile = {
				fileId: 'some-other-file-id',
				uploadId: 'some-other-upload-id',
			};
			const params: MediaStoreTouchFileParams = {
				collection: 'some-collection-name',
			};

			const descriptor1: TouchFileDescriptor = {
				fileId: 'some-file-id',
			};
			const descriptor2: TouchFileDescriptor = {
				fileId: 'some-other-file-id',
				occurrenceKey: 'some-occurrence-key',
				collection: 'some-collection',
				deletable: false,
				expireAfter: 42,
			};

			it('should POST to /upload/createWithFiles', async () => {
				const data: TouchedFiles = {
					created: [createdTouchedFile1, createdTouchedFile2],
				};

				fetchMock.once(JSON.stringify({ data }), {
					status: 201,
					statusText: 'Created',
				});

				const body: MediaStoreTouchFileBody = {
					descriptors: [descriptor1, descriptor2],
				};

				const response = await mediaStore.touchFiles(body, params);

				expect(response).toEqual({ data });
				expect(fetchMock).toHaveBeenCalledWith(
					`${baseUrl}/upload/createWithFiles?hashAlgorithm=sha256`,
					{
						method: 'POST',
						headers: {
							'X-Client-Id': clientId,
							Authorization: `Bearer ${token}`,
							Accept: 'application/json',
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(body),
					},
				);
				expect(resolveAuth).toHaveBeenCalledWith(
					authProvider,
					{
						collectionName: params.collection,
					},
					undefined,
				);
			});

			it('should fail if error status is returned', async () => {
				fetchMock.once('something went wrong', {
					status: 403,
					statusText: 'Forbidden',
				});

				const body: MediaStoreTouchFileBody = {
					descriptors: [descriptor1],
				};
				try {
					await mediaStore.touchFiles(body, params);
				} catch (err) {
					// @ts-expect-error
					if (!isRequestError(err)) {
						// @ts-expect-error
						return expect(isRequestError(err)).toBeTruthy();
					}

					expect(err.attributes).toMatchObject({
						reason: 'serverForbidden',
						method: 'POST',
						endpoint: '/upload/createWithFiles',
						statusCode: 403,
					});
					expect(err.reason).toBe('serverForbidden');
					expect(err.metadata).toMatchObject({
						method: 'POST',
						endpoint: '/upload/createWithFiles',
						statusCode: 403,
					});
				}

				expect.assertions(3);
			});

			it('should fail if response is malformed JSON', async () => {
				fetchMock.once('Invalid Body', {
					status: 201,
					statusText: 'Created',
				});

				const body: MediaStoreTouchFileBody = {
					descriptors: [descriptor1],
				};

				try {
					await mediaStore.touchFiles(body, params);
				} catch (err) {
					// @ts-expect-error
					if (!isRequestError(err)) {
						// @ts-expect-error
						return expect(isRequestError(err)).toBeTruthy();
					}

					expect(err.attributes).toMatchObject({
						reason: 'serverInvalidBody',
						method: 'POST',
						endpoint: '/upload/createWithFiles',
						statusCode: 201,
						innerError: expect.any(Error),
					});
					expect(err.reason).toBe('serverInvalidBody');
					expect(err.metadata).toMatchObject({
						method: 'POST',
						endpoint: '/upload/createWithFiles',
						statusCode: 201,
					});
					expect(err.innerError).toMatchObject(expect.any(Error));
				}

				expect.assertions(4);
			});

			it('calls request with traceContext', async () => {
				const data: TouchedFiles = {
					created: [createdTouchedFile1, createdTouchedFile2],
				};

				fetchMock.once(JSON.stringify({ data }), {
					status: 201,
					statusText: 'Created',
				});

				const body: MediaStoreTouchFileBody = {
					descriptors: [descriptor1, descriptor2],
				};

				await mediaStore.touchFiles(body, params, {
					traceId: 'test-trace-id',
				});

				expect(requestModuleMock).toBeCalledWith(
					`${baseUrl}/upload/createWithFiles`,
					expect.objectContaining({
						auth: {
							baseUrl: 'http://some-host',
							clientId: 'some-client-id',
							token: 'some-token',
						},
						body: '{"descriptors":[{"fileId":"some-file-id"},{"fileId":"some-other-file-id","occurrenceKey":"some-occurrence-key","collection":"some-collection","deletable":false,"expireAfter":42}]}',
						clientOptions: undefined,
						endpoint: '/upload/createWithFiles',
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json',
						},
						method: 'POST',
						params: { hashAlgorithm: 'sha256' },
						traceContext: {
							traceId: 'test-trace-id',
							spanId: expect.any(String),
						},
					}),
					undefined,
				);
			});
		});

		describe('getFileImageURL', () => {
			describe('should return the file image preview url based on the file id only in commercial environment', () => {
				// createFileImageURL is a private function that is called within this function, its output has been altered based on the feature flag 'platform_media_cdn_delivery'
				const collection = 'some-collection';

				const nonCdnURL = `${baseUrl}/file/1234/image?allowAnimated=true&client=some-client-id&collection=${collection}&max-age=${FILE_CACHE_MAX_AGE}&mode=crop&token=${token}`;

				const cdnURL = `${baseUrl}/file/1234/image/cdn?allowAnimated=true&client=some-client-id&collection=${collection}&max-age=${FILE_CACHE_MAX_AGE}&mode=crop&token=${token}`;

				ffTest(
					'platform_media_cdn_delivery',
					async () => {
						// Test against fedramp micros perimeter, should return non-cdn url
						global.MICROS_PERIMETER = 'fedramp-moderate';
						let url = await mediaStore.getFileImageURL('1234', {
							collection,
						});
						expect(resolveAuth).toHaveBeenCalledWith(
							authProvider,
							{
								collectionName: collection,
							},
							undefined,
						);
						expect(url).toEqual(nonCdnURL);

						// Test against fedramp hostname, should return non-cdn url
						window.location.hostname = 'atlassian-us-gov-mod.com';
						url = await mediaStore.getFileImageURL('1234', {
							collection,
						});
						expect(resolveAuth).toHaveBeenCalledWith(
							authProvider,
							{
								collectionName: collection,
							},
							undefined,
						);
						expect(url).toEqual(nonCdnURL);

						// Test against commercial micros perimeter and hostname, should return cdn url
						global.MICROS_PERIMETER = 'commercial';
						window.location.hostname = 'hello.atlassian.net';
						url = await mediaStore.getFileImageURL('1234', {
							collection,
						});
						expect(resolveAuth).toHaveBeenCalledWith(
							authProvider,
							{
								collectionName: collection,
							},
							undefined,
						);
						expect(url).toEqual(cdnURL);
					},
					async () => {
						const url = await mediaStore.getFileImageURL('1234', {
							collection,
						});
						expect(resolveAuth).toHaveBeenCalledWith(
							authProvider,
							{
								collectionName: collection,
							},
							undefined,
						);
						expect(url).toEqual(nonCdnURL);
					},
				);
			});

			it('should return the file image preview url based on the file id', async () => {
				const collection = 'some-collection';
				const url = await mediaStore.getFileImageURL('1234', { collection });
				expect(resolveAuth).toHaveBeenCalledWith(
					authProvider,
					{
						collectionName: collection,
					},
					undefined,
				);
				expect(url).toEqual(
					`${baseUrl}/file/1234/image?allowAnimated=true&client=some-client-id&collection=${collection}&max-age=${FILE_CACHE_MAX_AGE}&mode=crop&token=${token}`,
				);
			});

			it('should return the same file image preview url if given explicit undefined in params', async () => {
				const collection = 'some-collection';
				const url = await mediaStore.getFileImageURL('1234', {
					collection,
					'max-age': undefined,
					mode: undefined,
				});
				expect(resolveAuth).toHaveBeenCalledWith(
					authProvider,
					{
						collectionName: collection,
					},
					undefined,
				);
				expect(url).toEqual(
					`${baseUrl}/file/1234/image?allowAnimated=true&client=some-client-id&collection=${collection}&max-age=${FILE_CACHE_MAX_AGE}&mode=crop&token=${token}`,
				);
			});
		});

		describe('path-based URL functionality', () => {
			const collection = 'some-collection';
			const fileId = '1234';
			const pathBasedUrl =
				'https://current.atlassian.net/media-api/file/1234/image?allowAnimated=true&client=some-client-id&collection=some-collection&max-age=2592000&mode=crop&token=some-token';
			const originalUrl = `${baseUrl}/file/1234/image?allowAnimated=true&client=some-client-id&collection=${collection}&max-age=${FILE_CACHE_MAX_AGE}&mode=crop&token=${token}`;

			describe('getFileImageURL', () => {
				ffTest(
					'platform_media_path_based_route',
					async () => {
						// Mock mapToPathBasedUrl to return a transformed URL
						mapToPathBasedUrlMock.mockReturnValue(pathBasedUrl);

						const url = await mediaStore.getFileImageURL(fileId, { collection });

						expect(resolveAuth).toHaveBeenCalledWith(
							authProvider,
							{
								collectionName: collection,
							},
							undefined,
						);

						// Verify mapToPathBasedUrl was called with the original URL
						expect(mapToPathBasedUrlMock).toHaveBeenCalledWith(originalUrl);
						expect(mapToPathBasedUrlMock).toHaveBeenCalledTimes(1);

						// Should return the path-based URL
						expect(url).toEqual(pathBasedUrl);
					},
					async () => {
						const url = await mediaStore.getFileImageURL(fileId, { collection });

						expect(resolveAuth).toHaveBeenCalledWith(
							authProvider,
							{
								collectionName: collection,
							},
							undefined,
						);

						// mapToPathBasedUrl should NOT be called when feature flag is off
						expect(mapToPathBasedUrlMock).not.toHaveBeenCalled();

						// Should return the original CDN URL (existing behavior)
						expect(url).toEqual(originalUrl);
					},
				);
			});

			describe('getFileImageURLSync', () => {
				let mediaStoreSync: MediaStore;

				beforeEach(() => {
					mediaStoreSync = new MediaStore({
						authProvider,
						initialAuth: auth,
					});
				});

				ffTest(
					'platform_media_path_based_route',
					() => {
						// Mock mapToPathBasedUrl to return a transformed URL
						mapToPathBasedUrlMock.mockReturnValue(pathBasedUrl);

						const url = mediaStoreSync.getFileImageURLSync(fileId, { collection });

						expect(resolveInitialAuth).toHaveBeenCalledWith(auth);

						// Verify mapToPathBasedUrl was called with the original URL
						expect(mapToPathBasedUrlMock).toHaveBeenCalledWith(originalUrl);
						expect(mapToPathBasedUrlMock).toHaveBeenCalledTimes(1);

						// Should return the path-based URL
						expect(url).toEqual(pathBasedUrl);
					},
					() => {
						const url = mediaStoreSync.getFileImageURLSync(fileId, { collection });

						expect(resolveInitialAuth).toHaveBeenCalledWith(auth);

						// mapToPathBasedUrl should NOT be called when feature flag is off
						expect(mapToPathBasedUrlMock).not.toHaveBeenCalled();

						// Should return the original CDN URL (existing behavior)
						expect(url).toEqual(originalUrl);
					},
				);
			});

			describe('edge cases with path-based URLs', () => {
				ffTest(
					'platform_media_path_based_route',
					async () => {
						// Test with custom parameters
						const customParams = {
							collection,
							width: 500,
							height: 300,
							mode: 'full-fit' as const,
							upscale: true,
						};

						const expectedOriginalUrl = `${baseUrl}/file/${fileId}/image?allowAnimated=true&client=some-client-id&collection=${collection}&height=300&max-age=${FILE_CACHE_MAX_AGE}&mode=full-fit&token=${token}&upscale=true&width=500`;
						const expectedPathBasedUrl =
							'https://current.atlassian.net/media-api/file/1234/image?allowAnimated=true&client=some-client-id&collection=some-collection&height=300&max-age=2592000&mode=full-fit&token=some-token&upscale=true&width=500';

						mapToPathBasedUrlMock.mockReturnValue(expectedPathBasedUrl);

						const url = await mediaStore.getFileImageURL(fileId, customParams);

						expect(mapToPathBasedUrlMock).toHaveBeenCalledWith(expectedOriginalUrl);
						expect(url).toEqual(expectedPathBasedUrl);

						// Test without collection parameter
						const expectedOriginalUrlNoCollection = `${baseUrl}/file/${fileId}/image?allowAnimated=true&client=some-client-id&max-age=${FILE_CACHE_MAX_AGE}&mode=crop&token=${token}`;
						const expectedPathBasedUrlNoCollection =
							'https://current.atlassian.net/media-api/file/1234/image?allowAnimated=true&client=some-client-id&max-age=2592000&mode=crop&token=some-token';

						mapToPathBasedUrlMock.mockReturnValue(expectedPathBasedUrlNoCollection);

						const urlNoCollection = await mediaStore.getFileImageURL(fileId);

						expect(mapToPathBasedUrlMock).toHaveBeenCalledWith(expectedOriginalUrlNoCollection);
						expect(urlNoCollection).toEqual(expectedPathBasedUrlNoCollection);
					},
					async () => {
						// Test that edge cases work normally when feature flag is disabled
						const customParams = {
							collection,
							width: 500,
							height: 300,
							mode: 'full-fit' as const,
							upscale: true,
						};

						const expectedOriginalUrl = `${baseUrl}/file/${fileId}/image?allowAnimated=true&client=some-client-id&collection=${collection}&height=300&max-age=${FILE_CACHE_MAX_AGE}&mode=full-fit&token=${token}&upscale=true&width=500`;

						const url = await mediaStore.getFileImageURL(fileId, customParams);

						// mapToPathBasedUrl should NOT be called when feature flag is off
						expect(mapToPathBasedUrlMock).not.toHaveBeenCalled();

						// Should return the original CDN URL
						expect(url).toEqual(expectedOriginalUrl);
					},
				);
			});
		});

		describe('getImage', () => {
			describe('should return file image preview only in commercial environment', () => {
				const nonCdnURL = `${baseUrl}/file/123/image?allowAnimated=true&clientId=some-client-id&max-age=${FILE_CACHE_MAX_AGE}&mode=crop`;
				const cdnURL = `${baseUrl}/file/123/image/cdn?allowAnimated=true&clientId=some-client-id&max-age=${FILE_CACHE_MAX_AGE}&mode=crop`;
				ffTest(
					'platform_media_cdn_delivery',
					async () => {
						fetchMock.once(JSON.stringify({ data }), {
							status: 201,
							statusText: 'Created',
						});

						// Test against fedramp micros perimeter, should return non-cdn url
						global.MICROS_PERIMETER = 'fedramp-moderate';
						let image = await mediaStore.getImage('123');

						expect(image).toBeInstanceOf(Blob);
						expect(fetchMock).toHaveBeenCalledWith(nonCdnURL, {
							method: 'GET',
							headers: {
								'X-Client-Id': clientId,
								Authorization: `Bearer ${token}`,
							},
						});

						// Test against fedramp hostname, should return non-cdn url
						window.location.hostname = 'atlassian-us-gov-mod.com';
						image = await mediaStore.getImage('123');

						expect(image).toBeInstanceOf(Blob);
						expect(fetchMock).toHaveBeenCalledWith(nonCdnURL, {
							method: 'GET',
							headers: {
								'X-Client-Id': clientId,
								Authorization: `Bearer ${token}`,
							},
						});

						// Test against commercial micros perimeter and hostname, should return cdn url
						global.MICROS_PERIMETER = 'commercial';
						window.location.hostname = 'hello.atlassian.net';

						image = await mediaStore.getImage('123');

						expect(image).toBeInstanceOf(Blob);
						expect(fetchMock).toHaveBeenCalledWith(cdnURL, {
							method: 'GET',
							headers: {
								'X-Client-Id': clientId,
								Authorization: `Bearer ${token}`,
							},
						});
					},
					async () => {
						fetchMock.once(JSON.stringify({ data }), {
							status: 201,
							statusText: 'Created',
						});

						const image = await mediaStore.getImage('123');

						expect(image).toBeInstanceOf(Blob);
						expect(fetchMock).toHaveBeenCalledWith(nonCdnURL, {
							method: 'GET',
							headers: {
								'X-Client-Id': clientId,
								Authorization: `Bearer ${token}`,
							},
						});
					},
				);
			});

			it('should merge default params with given ones', async () => {
				fetchMock.once(JSON.stringify({ data }), {
					status: 201,
					statusText: 'Created',
				});

				await mediaStore.getImage('123', {
					mode: 'full-fit',
					version: 2,
					upscale: true,
				});

				expect(fetchMock).toHaveBeenCalledWith(
					`${baseUrl}/file/123/image?allowAnimated=true&clientId=some-client-id&max-age=${FILE_CACHE_MAX_AGE}&mode=full-fit&upscale=true&version=2`,
					{
						method: 'GET',
						headers: {
							'X-Client-Id': clientId,
							Authorization: `Bearer ${token}`,
						},
					},
				);
			});

			it('calls request with traceContext', async () => {
				fetchMock.once(JSON.stringify({ data }), {
					status: 201,
					statusText: 'Created',
				});

				await mediaStore.getImage(
					'123',
					{
						mode: 'full-fit',
						version: 2,
						upscale: true,
					},
					undefined,
					true,
					{ traceId: 'test-trace-id' },
				);

				expect(requestModuleMock).toBeCalledWith(
					`${baseUrl}/file/123/image`,
					expect.objectContaining({
						auth: {
							baseUrl: 'http://some-host',
							clientId: 'some-client-id',
							token: 'some-token',
						},
						endpoint: '/file/{fileId}/image',
						headers: {},
						method: 'GET',
						params: {
							allowAnimated: true,
							height: 4096,
							'max-age': FILE_CACHE_MAX_AGE,
							mode: 'full-fit',
							upscale: true,
							version: 2,
							width: 4096,
							clientId: 'some-client-id',
						},
						traceContext: {
							traceId: 'test-trace-id',
							spanId: expect.any(String),
						},
					}),
					undefined,
				);
			});

			it('should append width and height params if fetchMaxRes', async () => {
				fetchMock.once(JSON.stringify({ data }), {
					status: 201,
					statusText: 'Created',
				});

				await mediaStore.getImage(
					'123',
					{
						mode: 'full-fit',
						version: 2,
						upscale: true,
					},
					undefined,
					true,
				);

				expect(fetchMock).toHaveBeenCalledWith(
					`${baseUrl}/file/123/image?allowAnimated=true&clientId=some-client-id&height=4096&max-age=${FILE_CACHE_MAX_AGE}&mode=full-fit&upscale=true&version=2&width=4096`,
					{
						method: 'GET',
						headers: {
							'X-Client-Id': clientId,
							Authorization: `Bearer ${token}`,
						},
					},
				);
			});

			it('should override width and height params if fetchMaxRes', async () => {
				fetchMock.once(JSON.stringify({ data }), {
					status: 201,
					statusText: 'Created',
				});

				await mediaStore.getImage(
					'123',
					{
						mode: 'crop',
						version: 2,
						upscale: true,
						width: 1000,
						height: 1000,
					},
					undefined,
					true,
				);

				expect(fetchMock).toHaveBeenCalledWith(
					`${baseUrl}/file/123/image?allowAnimated=true&clientId=some-client-id&height=4096&max-age=${FILE_CACHE_MAX_AGE}&mode=crop&upscale=true&version=2&width=4096`,
					{
						method: 'GET',
						headers: {
							'X-Client-Id': clientId,
							Authorization: `Bearer ${token}`,
						},
					},
				);
			});

			it('should not request webp content when not supported', async () => {
				fetchMock.once(JSON.stringify({ data }), {
					status: 201,
					statusText: 'Created',
				});

				checkWebpSupportMock.mockResolvedValueOnce(false);

				await mediaStore.getImage('123');

				expect(fetchMock).toHaveBeenCalledWith(
					`${baseUrl}/file/123/image?allowAnimated=true&clientId=some-client-id&max-age=${FILE_CACHE_MAX_AGE}&mode=crop`,
					{
						method: 'GET',
						headers: {
							'X-Client-Id': clientId,
							Authorization: `Bearer ${token}`,
						},
					},
				);
			});
		});

		describe('getItems', () => {
			it('should POST to /items endpoint with correct options', async () => {
				const items = ['1', '2'];
				const data: ItemsPayload[] = [
					{
						items: [
							{
								id: '1',
								collection: 'collection-1',
								type: 'file',
								details: {
									artifacts: {} as any,
									mediaType: 'image',
									mimeType: 'png',
									name: 'file-1',
									processingStatus: 'succeeded',
									size: 1,
									representations: {},
								},
							},
						],
					},
				];

				fetchMock.once(JSON.stringify({ data }), {
					status: 200,
					statusText: 'Ok',
				});

				const response = await mediaStore.getItems(items, 'collection-1');

				expect(response).toEqual({ data });
				expect(fetchMock).toHaveBeenCalledWith(`${baseUrl}/items`, {
					method: 'POST',
					headers: {
						'X-Client-Id': clientId,
						Authorization: `Bearer ${token}`,
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						descriptors: [
							{
								type: 'file',
								id: '1',
								collection: 'collection-1',
							},
							{
								type: 'file',
								id: '2',
								collection: 'collection-1',
							},
						],
					}),
				});
			});

			it('calls request with traceContext', async () => {
				const items = ['1', '2'];
				const data: ItemsPayload[] = [
					{
						items: [
							{
								id: '1',
								collection: 'collection-1',
								type: 'file',
								details: {
									artifacts: {} as any,
									mediaType: 'image',
									mimeType: 'png',
									name: 'file-1',
									processingStatus: 'succeeded',
									size: 1,
									representations: {},
								},
							},
						],
					},
				];
				fetchMock.once(JSON.stringify({ data }), {
					status: 200,
					statusText: 'Ok',
				});

				await mediaStore.getItems(items, 'collection-1', {
					traceId: 'test-trace-id',
				});

				expect(requestModuleMock).toBeCalledWith(
					`${baseUrl}/items`,
					expect.objectContaining({
						auth: {
							baseUrl: 'http://some-host',
							clientId: 'some-client-id',
							token: 'some-token',
						},
						body: '{"descriptors":[{"type":"file","id":"1","collection":"collection-1"},{"type":"file","id":"2","collection":"collection-1"}]}',
						clientOptions: undefined,
						endpoint: '/items',
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json',
						},
						method: 'POST',
						params: undefined,
						traceContext: {
							traceId: 'test-trace-id',
							spanId: expect.any(String),
						},
					}),
					undefined,
				);
			});

			it('should fail if response is malformed JSON', async () => {
				const items = ['1', '2'];

				fetchMock.once('Invalid Body', {
					status: 200,
					statusText: 'Ok',
				});

				try {
					await mediaStore.getItems(items, 'collection-1');
				} catch (err) {
					// @ts-expect-error
					if (!isRequestError(err)) {
						// @ts-expect-error
						return expect(isRequestError(err)).toBeTruthy();
					}

					expect(err.attributes).toMatchObject({
						reason: 'serverInvalidBody',
						method: 'POST',
						endpoint: '/items',
						statusCode: 200,
						innerError: expect.any(Error),
					});
					expect(err.reason).toBe('serverInvalidBody');
					expect(err.metadata).toMatchObject({
						method: 'POST',
						endpoint: '/items',
						statusCode: 200,
					});
					expect(err.innerError).toMatchObject(expect.any(Error));
				}

				expect.assertions(4);
			});
		});

		describe('getImageMetadata()', () => {
			it('should return image metadata for the given id', async () => {
				const data: ImageMetadata = {
					pending: false,
					original: {
						height: 10,
						width: 10,
						url: 'some-preview',
					},
				};

				fetchMock.once(JSON.stringify({ data }), {
					status: 200,
					statusText: 'Ok',
				});

				const image = await mediaStore.getImageMetadata('123');

				expect(image).toEqual({ data });
				expect(fetchMock).toHaveBeenCalledWith(`${baseUrl}/file/123/image/metadata`, {
					method: 'GET',
					headers: {
						'X-Client-Id': clientId,
						Authorization: `Bearer ${token}`,
					},
				});
			});

			it('calls request with traceContext', async () => {
				const data: ImageMetadata = {
					pending: false,
					original: {
						height: 10,
						width: 10,
						url: 'some-preview',
					},
				};

				fetchMock.once(JSON.stringify({ data }), {
					status: 200,
					statusText: 'Ok',
				});

				await mediaStore.getImageMetadata('123', {}, { traceId: 'some-trace-id' });

				expect(requestModuleMock).toBeCalledWith(
					`${baseUrl}/file/123/image/metadata`,
					expect.objectContaining({
						auth: {
							baseUrl: 'http://some-host',
							clientId: 'some-client-id',
							token: 'some-token',
						},
						body: undefined,
						clientOptions: undefined,
						endpoint: '/file/{fileId}/image/metadata',
						headers: undefined,
						method: 'GET',
						params: {},
						traceContext: {
							traceId: 'some-trace-id',
							spanId: expect.any(String),
						},
					}),
					undefined,
				);
			});

			it('should generate right url based on params', async () => {
				const data: ImageMetadata = {
					pending: false,
				};

				fetchMock.once(JSON.stringify({ data }), {
					status: 200,
					statusText: 'Ok',
				});

				await mediaStore.getImageMetadata('123', {
					collection: 'my-collection',
				});

				expect(fetchMock).toHaveBeenCalledWith(
					`${baseUrl}/file/123/image/metadata?collection=my-collection`,
					{
						method: 'GET',
						headers: {
							'X-Client-Id': clientId,
							Authorization: `Bearer ${token}`,
						},
					},
				);
			});

			it('should fail if response is malformed JSON', async () => {
				fetchMock.once('Invalid Body', {
					status: 200,
					statusText: 'Ok',
				});

				try {
					await mediaStore.getImageMetadata('123');
				} catch (err) {
					// @ts-expect-error
					if (!isRequestError(err)) {
						// @ts-expect-error
						return expect(isRequestError(err)).toBeTruthy();
					}

					expect(err.attributes).toMatchObject({
						reason: 'serverInvalidBody',
						method: 'GET',
						endpoint: '/file/{fileId}/image/metadata',
						statusCode: 200,
						innerError: expect.any(Error),
					});
					expect(err.reason).toBe('serverInvalidBody');
					expect(err.metadata).toMatchObject({
						method: 'GET',
						endpoint: '/file/{fileId}/image/metadata',
						statusCode: 200,
					});
					expect(err.innerError).toMatchObject(expect.any(Error));
				}

				expect.assertions(4);
			});
		});

		describe('getFileBinary', () => {
			describe('should return file binary only in commercial environment', () => {
				const baseObject = {
					auth: {
						baseUrl: 'http://some-host',
						clientId: 'some-client-id',
						token: 'some-token',
					},
					body: undefined,
					clientOptions: undefined,
					headers: {},
					method: 'GET',
					params: { 'max-age': '2592000', collection: 'some-collection-name' },
					traceContext: undefined,
				};

				const nonCdnObject = {
					...baseObject,
					endpoint: '/file/{fileId}/binary',
				};

				const cdnObject = {
					...baseObject,
					endpoint: '/file/{fileId}/binary/cdn',
				};

				ffTest(
					'platform_media_cdn_delivery',
					async () => {
						// Test against fedramp micros perimeter, should return non-cdn url
						let response = await mediaStore.getFileBinary('1234', 'some-collection-name');
						// Test against fedramp hostname, should return non-cdn url
						global.MICROS_PERIMETER = 'fedramp-moderate';
						response = await mediaStore.getFileBinary('1234', 'some-collection-name');
						expect(requestModuleMock).toBeCalledWith(
							`${baseUrl}/file/1234/binary`,
							expect.objectContaining(nonCdnObject),
							undefined,
						);

						expect(response).toEqual(expect.any(Blob));
						// Test against commercial micros perimeter and hostname, should return cdn url
						window.location.hostname = 'atlassian-us-gov-mod.com';
						response = await mediaStore.getFileBinary('1234', 'some-collection-name');
						expect(requestModuleMock).toBeCalledWith(
							`${baseUrl}/file/1234/binary`,
							expect.objectContaining(nonCdnObject),
							undefined,
						);

						expect(response).toEqual(expect.any(Blob));

						// When the feature flag is enabled, the URL should contain the /binary/cdn path
						global.MICROS_PERIMETER = 'commercial';
						window.location.hostname = 'hello.atlassian.net';
						response = await mediaStore.getFileBinary('1234', 'some-collection-name');
						expect(requestModuleMock).toBeCalledWith(
							`${baseUrl}/file/1234/binary/cdn`,
							expect.objectContaining(cdnObject),
							undefined,
						);

						expect(response).toEqual(expect.any(Blob));
					},
					async () => {
						const response = await mediaStore.getFileBinary('1234', 'some-collection-name');
						// When the feature flag is disabled, the URL should contain the /binary path

						expect(requestModuleMock).toBeCalledWith(
							`${baseUrl}/file/1234/binary`,
							expect.objectContaining(nonCdnObject),
							undefined,
						);

						expect(response).toEqual(expect.any(Blob));
					},
				);
			});
		});

		describe('getFileBinaryURL', () => {
			describe('should return file url only in commercial environment', () => {
				const nonCdnURL = `${baseUrl}/file/1234/binary?client=some-client-id&collection=some-collection-name&dl=true&max-age=${FILE_CACHE_MAX_AGE}&token=${token}`;

				const cdnURL = `${baseUrl}/file/1234/binary/cdn?client=some-client-id&collection=some-collection-name&dl=true&max-age=${FILE_CACHE_MAX_AGE}&token=${token}`;
				ffTest(
					'platform_media_cdn_delivery',
					async () => {
						// When the feature flag is enabled, the URL should contain the new path

						// Test against fedramp micros perimeter, should return non-cdn url
						global.MICROS_PERIMETER = 'fedramp-moderate';
						let url = await mediaStore.getFileBinaryURL('1234', 'some-collection-name');
						expect(url).toEqual(nonCdnURL);

						// Test against fedramp hostname, should return non-cdn url
						window.location.hostname = 'atlassian-us-gov-mod.com';
						url = await mediaStore.getFileBinaryURL('1234', 'some-collection-name');
						expect(url).toEqual(nonCdnURL);

						// Test against commercial micros perimeter and hostname, should return cdn url
						global.MICROS_PERIMETER = 'commercial';
						window.location.hostname = 'hello.atlassian.net';
						url = await mediaStore.getFileBinaryURL('1234', 'some-collection-name');
						expect(url).toEqual(cdnURL);
					},
					async () => {
						const url = await mediaStore.getFileBinaryURL('1234', 'some-collection-name');
						// When the feature flag is disabled, the URL should contain the old path
						expect(url).toEqual(nonCdnURL);
					},
				);
			});

			describe('path-based URL transformation', () => {
				const collection = 'some-collection-name';
				const fileId = '1234';
				const pathBasedUrl =
					'https://current.atlassian.net/media-api/file/1234/binary?client=some-client-id&collection=some-collection-name&dl=true&max-age=2592000&token=some-token';
				const originalUrl = `${baseUrl}/file/1234/binary?client=some-client-id&collection=${collection}&dl=true&max-age=${FILE_CACHE_MAX_AGE}&token=${token}`;

				ffTest(
					'platform_media_path_based_route',
					async () => {
						// Mock mapToPathBasedUrl to return a transformed URL
						mapToPathBasedUrlMock.mockReturnValue(pathBasedUrl);

						const url = await mediaStore.getFileBinaryURL(fileId, collection);

						expect(resolveAuth).toHaveBeenCalledWith(
							authProvider,
							{
								collectionName: collection,
							},
							undefined,
						);

						// Verify mapToPathBasedUrl was called with the original URL
						expect(mapToPathBasedUrlMock).toHaveBeenCalledWith(originalUrl);
						expect(mapToPathBasedUrlMock).toHaveBeenCalledTimes(1);

						// Should return the path-based URL
						expect(url).toEqual(pathBasedUrl);
					},
					async () => {
						const url = await mediaStore.getFileBinaryURL(fileId, collection);

						expect(resolveAuth).toHaveBeenCalledWith(
							authProvider,
							{
								collectionName: collection,
							},
							undefined,
						);

						// mapToPathBasedUrl should NOT be called when feature flag is off
						expect(mapToPathBasedUrlMock).not.toHaveBeenCalled();

						// Should return the original URL (existing behavior)
						expect(url).toEqual(originalUrl);
					},
				);
			});

			it('should call resolveAuth with authProvider and given collection name', async () => {
				await mediaStore.getFileBinaryURL('1234', 'some-collection-name');
				expect(resolveAuth).toHaveBeenCalledWith(
					authProvider,
					{
						collectionName: 'some-collection-name',
					},
					undefined,
				);
			});

			it('should return file url with custom max-age', async () => {
				const url = await mediaStore.getFileBinaryURL('1234', 'some-collection-name', 123);
				expect(url).toEqual(
					`${baseUrl}/file/1234/binary?client=some-client-id&collection=some-collection-name&dl=true&max-age=123&token=${token}`,
				);
			});
		});

		describe('getArtifactURL()', () => {
			it('should return the right artifact url', async () => {
				const url = await mediaStore.getArtifactURL(
					{
						'video_640.mp4': {
							processingStatus: 'succeeded',
							url: '/sd-video',
						},
					},
					'video_640.mp4',
					'some-collection',
				);

				expect(url).toEqual(
					`${baseUrl}/sd-video?client=some-client-id&collection=some-collection&max-age=${FILE_CACHE_MAX_AGE}&token=${token}`,
				);
				expect(resolveAuth).toHaveBeenCalledWith(
					authProvider,
					{
						collectionName: 'some-collection',
					},
					undefined,
				);
			});

			describe('handling CDN url', () => {
				describe("should use artifact's cdnUrl over the regular artifact's url only in commercial environment", () => {
					const nonCdnURL =
						'http://some-host/sd-video?client=some-client-id&collection=some-collection&max-age=2592000&token=some-token';

					const cdnURL =
						'http://some-host/sd-video/cdn?client=some-client-id&collection=some-collection&max-age=2592000&token=some-token';

					ffTest(
						'platform_media_cdn_delivery',
						async () => {
							// Test against fedramp micros perimeter, should return non-cdn url
							global.MICROS_PERIMETER = 'fedramp-moderate';
							let url = await mediaStore.getArtifactURL(
								{
									'video_640.mp4': {
										processingStatus: 'succeeded',
										url: '/sd-video',
										cdnUrl: 'backend-provided-cdn-url',
									},
								},
								'video_640.mp4',
								'some-collection',
							);
							expect(url).toEqual(nonCdnURL);

							// Test against fedramp hostname, should return non-cdn url
							window.location.hostname = 'atlassian-us-gov-mod.com';
							url = await mediaStore.getArtifactURL(
								{
									'video_640.mp4': {
										processingStatus: 'succeeded',
										url: '/sd-video',
									},
								},
								'video_640.mp4',
								'some-collection',
							);
							expect(url).toEqual(nonCdnURL);

							// Test against commercial micros perimeter and hostname, without provided backend cdn url, should return cdn url
							global.MICROS_PERIMETER = 'commercial';
							window.location.hostname = 'hello.atlassian.net';

							url = await mediaStore.getArtifactURL(
								{
									'video_640.mp4': {
										processingStatus: 'succeeded',
										url: '/sd-video',
									},
								},
								'video_640.mp4',
								'some-collection',
							);

							expect(url).toEqual(cdnURL);

							// ----- WARNING -----
							// Uncomment when artifact.cdnUrl works in Jira
							// -----------------
							// Test against commercial micros perimeter and hostname, with provided backend cdn url, should return provided backend cdn url
							/* url = await mediaStore.getArtifactURL(
								{
									'video_640.mp4': {
										processingStatus: 'succeeded',
										url: '/sd-video',
										cdnUrl: 'backend-provided-cdn-url',
									},
								},
								'video_640.mp4',
								'some-collection',
							);

							expect(url).toEqual('backend-provided-cdn-url');
							*/
						},
						async () => {
							const url = await mediaStore.getArtifactURL(
								{
									'video_640.mp4': {
										processingStatus: 'succeeded',
										url: '/sd-video',
										cdnUrl:
											'https://media-cdn.dev.atlassian.com/adev/v1/cdn/file/1234/image?token=cdn-token',
									},
								},
								'video_640.mp4',
								'some-collection',
							);

							expect(url).toEqual(nonCdnURL);
						},
					);
				});
			});

			it('should throw if artifact cant be found', async () => {
				const artifacts = {
					'audio.mp3': {},
				} as unknown as MediaFileArtifacts;

				await expect(mediaStore.getArtifactURL(artifacts, 'video_640.mp4')).rejects.toThrow(
					'artifact video_640.mp4 not found',
				);
				await expect(mediaStore.getArtifactURL(artifacts, 'audio.mp3')).rejects.toThrow(
					'artifact audio.mp3 not found',
				);
			});
		});

		describe('getArtifactBinary', () => {
			it('should return artifact binary from getArtifactURL', async () => {
				const getArtifactURLSpy = jest.spyOn(mediaStore, 'getArtifactURL');
				getArtifactURLSpy.mockResolvedValue('http://some-artifact-url');

				let response = await mediaStore.getArtifactBinary(
					{
						'video_640.mp4': {
							processingStatus: 'succeeded',
							url: '/sd-video',
							cdnUrl: 'backend-provided-cdn-url',
						},
					},
					'video_640.mp4',
					{ collectionName: 'some-collection-name' },
				);

				expect(fetchMock).toHaveBeenCalledWith(`http://some-artifact-url/`, {
					method: 'GET',
				});

				expect(response).toEqual(expect.any(Blob));
			});
		});

		describe('uploadArtifact', () => {
			it('should upload artifact', async () => {
				const dataResponse = { data: { id: 'some-file-id' } };
				fetchMock.once(JSON.stringify(dataResponse), {
					status: 200,
					statusText: 'OK',
				});

				const response = await mediaStore.uploadArtifact(
					'some-file-id',
					new File(['some-file-content'], 'some-file-name', { type: 'text/vtt' }),
					{ type: 'caption', language: 'en-AU' },
					'some-collection-name',
					{ traceId: 'some-trace-id' },
				);

				expect(response).toEqual(dataResponse);
				expect(resolveAuth).toHaveBeenCalledWith(
					authProvider,
					{
						collectionName: 'some-collection-name',
						access: [{ type: 'file', id: 'some-file-id', actions: ['update'] }],
					},
					undefined,
				);
				expect(requestModuleMock).toHaveBeenCalledWith(
					`${baseUrl}/file/some-file-id/artifact/binary`,
					expect.objectContaining({
						method: 'POST',
						headers: expect.objectContaining({
							'Content-Type': 'text/vtt',
							Accept: 'application/json',
						}),
						auth: {
							baseUrl: 'http://some-host',
							clientId: 'some-client-id',
							token: 'some-token',
						},
						params: {
							type: 'caption',
							language: 'en-AU',
							name: 'some-file-name',
							collection: 'some-collection-name',
						},
						traceContext: {
							traceId: 'some-trace-id',
							spanId: expect.any(String),
						},
						endpoint: '/file/{fileId}/artifact/binary',
						body: expect.any(File),
						clientOptions: undefined,
					}),
					undefined,
				);
			});
		});

		describe('deleteArtifact', () => {
			it('should delete artifact', async () => {
				fetchMock.once('', {
					status: 204,
					statusText: 'No Content',
				});

				await mediaStore.deleteArtifact('some-file-id', 'ugc_caption_en', 'some-collection-name', {
					traceId: 'some-trace-id',
				});

				expect(resolveAuth).toHaveBeenCalledWith(
					authProvider,
					{
						collectionName: 'some-collection-name',
						access: [{ type: 'file', id: 'some-file-id', actions: ['update'] }],
					},
					undefined,
				);
				expect(requestModuleMock).toHaveBeenCalledWith(
					`${baseUrl}/file/some-file-id/artifact/ugc_caption_en`,
					expect.objectContaining({
						method: 'DELETE',
						auth: {
							baseUrl: 'http://some-host',
							clientId: 'some-client-id',
							token: 'some-token',
						},
						traceContext: {
							traceId: 'some-trace-id',
							spanId: expect.any(String),
						},
						endpoint: '/file/{fileId}/artifact/{artifactName}',
					}),
					undefined,
				);
			});
		});
		describe('copyFileWithToken', () => {
			const body = {
				sourceFile: {
					id: 'some-id',
					owner: {
						id: 'owner-id',
						token,
						baseUrl,
					},
					collection: 'some-collection',
				},
			};
			const params = {
				collection: 'some-collection',
				replaceFileId: 'some-replace-file-id',
				occurrenceKey: 'some-occurrence-key',
			};

			it('should POST to /file/copy/withToken endpoint with correct options', async () => {
				fetchMock.once(JSON.stringify({ data }), {
					status: 201,
					statusText: 'Created',
				});

				const response = await mediaStore.copyFileWithToken(body, params);

				expect(response).toEqual({ data });
				expect(fetchMock).toHaveBeenCalledWith(
					`${baseUrl}/file/copy/withToken?collection=some-collection&occurrenceKey=some-occurrence-key&replaceFileId=some-replace-file-id`,
					{
						method: 'POST',
						headers: {
							'X-Client-Id': clientId,
							Authorization: `Bearer ${token}`,
							Accept: 'application/json',
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(body),
					},
				);
			});

			it('calls request with traceContext', async () => {
				fetchMock.once(JSON.stringify({ data }), {
					status: 201,
					statusText: 'Created',
				});

				await mediaStore.copyFileWithToken(body, params, {
					traceId: 'some-trace-id',
				});

				expect(requestModuleMock).toBeCalledWith(
					`${baseUrl}/file/copy/withToken`,
					expect.objectContaining({
						auth: {
							baseUrl: 'http://some-host',
							clientId: 'some-client-id',
							token: 'some-token',
						},
						body: '{"sourceFile":{"id":"some-id","owner":{"id":"owner-id","token":"some-token","baseUrl":"http://some-host"},"collection":"some-collection"}}',
						clientOptions: undefined,
						endpoint: '/file/copy/withToken',
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json',
						},
						method: 'POST',
						params: {
							collection: 'some-collection',
							occurrenceKey: 'some-occurrence-key',
							replaceFileId: 'some-replace-file-id',
						},
						traceContext: {
							traceId: 'some-trace-id',
							spanId: expect.any(String),
						},
					}),
					undefined,
				);
			});

			it('should fail if response is malformed JSON', async () => {
				fetchMock.once('Invalid Body', {
					status: 201,
					statusText: 'Created',
				});

				try {
					await mediaStore.copyFileWithToken(body, params);
				} catch (err) {
					// @ts-expect-error
					if (!isRequestError(err)) {
						// @ts-expect-error
						return expect(isRequestError(err)).toBeTruthy();
					}

					expect(err.attributes).toMatchObject({
						reason: 'serverInvalidBody',
						method: 'POST',
						endpoint: '/file/copy/withToken',
						statusCode: 201,
						innerError: expect.any(Error),
					});
					expect(err.reason).toBe('serverInvalidBody');
					expect(err.metadata).toMatchObject({
						method: 'POST',
						endpoint: '/file/copy/withToken',
						statusCode: 201,
					});
					expect(err.innerError).toMatchObject(expect.any(Error));
				}

				expect.assertions(4);
			});
		});

		describe('copyFile', () => {
			const params = {
				sourceCollection: 'some-source-collection',
				collection: 'some-collection',
				replaceFileId: 'some-other-id',
			};

			it('should POST to /file/copy/withToken endpoint with correct options', async () => {
				fetchMock.once(JSON.stringify({ data }), {
					status: 201,
					statusText: 'Created',
				});

				const response = await mediaStore.copyFile('some-id', params);

				expect(response).toEqual({ data });
				expect(fetchMock).toHaveBeenCalledWith(
					`${baseUrl}/v2/file/copy?collection=some-collection&replaceFileId=some-other-id&sourceCollection=some-source-collection`,
					{
						method: 'POST',
						headers: {
							'X-Client-Id': clientId,
							Authorization: `Bearer ${token}`,
							Accept: 'application/json',
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({ id: 'some-id' }),
					},
				);
			});

			it('calls request with traceContext', async () => {
				fetchMock.once(JSON.stringify({ data }), {
					status: 201,
					statusText: 'Created',
				});

				await mediaStore.copyFile('some-id', params, {
					traceId: 'some-trace-id',
				});

				expect(requestModuleMock).toHaveBeenCalledWith(
					`${baseUrl}/v2/file/copy`,
					expect.objectContaining({
						auth: {
							baseUrl: 'http://some-host',
							clientId: 'some-client-id',
							token: 'some-token',
						},
						body: '{"id":"some-id"}',
						clientOptions: {
							retryOptions: {
								shouldRetryError: expect.any(Function),
							},
						},
						endpoint: '/v2/file/copy',
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json',
						},
						method: 'POST',
						params: {
							collection: 'some-collection',
							replaceFileId: 'some-other-id',
							sourceCollection: 'some-source-collection',
						},
						traceContext: {
							traceId: 'some-trace-id',
							spanId: expect.any(String),
						},
					}),
					undefined,
				);
			});

			it('retries 401 responses', async () => {
				fetchMock
					.once(JSON.stringify({}), {
						status: 401,
						statusText: 'Unauthorized',
					})
					.once(JSON.stringify({ data }), {
						status: 201,
						statusText: 'Created',
					});

				const resPromise = mediaStore.copyFile('some-id', params, {
					traceId: 'some-trace-id',
				});

				await nextTick();
				await nextTick();
				await nextTick();

				jest.advanceTimersByTime(1001);

				const res = await resPromise;

				expect(res).toEqual({ data });
				expect(fetchMock).toHaveBeenCalledTimes(2);
			});
		});

		describe('registerCopyIntents', () => {
			it('should POST to /file/copy/intents endpoint with correct options', async () => {
				fetchMock.once(JSON.stringify({ data }), {
					status: 201,
					statusText: 'Created',
				});

				const response = await mediaStore.registerCopyIntents([
					{ id: 'some-id', collection: 'some-collection' },
					{ id: 'some-other-id', collection: 'some-collection' },
				]);

				expect(response).toEqual(undefined);
				expect(fetchMock).toHaveBeenCalledWith(`${baseUrl}/file/copy/intents`, {
					method: 'POST',
					headers: {
						'X-Client-Id': clientId,
						Authorization: `Bearer ${token}`,
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						files: [
							{ id: 'some-id', collection: 'some-collection' },
							{ id: 'some-other-id', collection: 'some-collection' },
						],
					}),
				});
			});

			it('calls request with traceContext', async () => {
				fetchMock.once(JSON.stringify({ data }), {
					status: 201,
					statusText: 'Created',
				});

				await mediaStore.registerCopyIntents(
					[
						{ id: 'some-id', collection: 'some-collection' },
						{ id: 'some-other-id', collection: 'some-collection' },
					],
					{ traceId: 'some-trace-id' },
				);

				expect(requestModuleMock).toBeCalledWith(
					`${baseUrl}/file/copy/intents`,
					expect.objectContaining({
						auth: {
							baseUrl: 'http://some-host',
							clientId: 'some-client-id',
							token: 'some-token',
						},
						body: '{"files":[{"id":"some-id","collection":"some-collection"},{"id":"some-other-id","collection":"some-collection"}]}',
						clientOptions: undefined,
						endpoint: '/file/copy/intents',
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json',
						},
						method: 'POST',
						traceContext: {
							traceId: 'some-trace-id',
							spanId: expect.any(String),
						},
					}),
					undefined,
				);
			});
		});

		describe('Sync Operations', () => {
			let mediaStoreSync: MediaStore;

			beforeEach(() => {
				mediaStoreSync = new MediaStore({
					authProvider,
					initialAuth: auth,
				});
			});

			describe('getFileImageURLSync', () => {
				describe('should return the file image preview url based on the file id only in commercial environment', () => {
					// createFileImageURL is a private function that is called within this function, its output has been altered based on the feature flag 'platform_media_cdn_delivery'
					const collection = 'some-collection';

					const cdnURL = `${baseUrl}/file/1234/image/cdn?allowAnimated=true&client=some-client-id&collection=${collection}&max-age=${FILE_CACHE_MAX_AGE}&mode=crop&token=${token}`;

					const nonCdnURL = `${baseUrl}/file/1234/image?allowAnimated=true&client=some-client-id&collection=${collection}&max-age=${FILE_CACHE_MAX_AGE}&mode=crop&token=${token}`;

					ffTest(
						'platform_media_cdn_delivery',
						async () => {
							// Test against fedramp micros perimeter, should return non-cdn url
							global.MICROS_PERIMETER = 'fedramp-moderate';
							let url = mediaStoreSync.getFileImageURLSync('1234', {
								collection,
							});
							expect(resolveInitialAuth).toHaveBeenCalledWith(auth);
							expect(url).toEqual(nonCdnURL);

							// Test against fedramp hostname, should return non-cdn url
							window.location.hostname = 'atlassian-us-gov-mod.com';
							url = mediaStoreSync.getFileImageURLSync('1234', {
								collection,
							});
							expect(resolveInitialAuth).toHaveBeenCalledWith(auth);
							expect(url).toEqual(nonCdnURL);

							// Test against commercial micros perimeter and hostname, should return cdn url
							global.MICROS_PERIMETER = 'commercial';
							window.location.hostname = 'hello.atlassian.net';
							url = mediaStoreSync.getFileImageURLSync('1234', {
								collection,
							});
							expect(resolveInitialAuth).toHaveBeenCalledWith(auth);
							expect(url).toEqual(cdnURL);
						},
						async () => {
							const collection = 'some-collection';
							const url = mediaStoreSync.getFileImageURLSync('1234', {
								collection,
							});
							expect(resolveInitialAuth).toHaveBeenCalledWith(auth);
							expect(url).toEqual(nonCdnURL);
						},
					);
				});
			});
		});
	});

	describe('MediaStoreError', () => {
		it('should be identifiable', () => {
			const unknownError = new Error('unknown error');
			expect(isMediaStoreError(unknownError)).toBeFalsy();
			const mediaStoreError = new MediaStoreError('failedAuthProvider');
			expect(isMediaStoreError(mediaStoreError)).toBeTruthy();
		});

		it('should return the right arguments', () => {
			const error = new Error('error');
			const mediaStoreError = new MediaStoreError('failedAuthProvider', error);
			expect(mediaStoreError.reason).toBe('failedAuthProvider');
			expect(mediaStoreError.innerError).toBe(error);
		});
	});
});

import React from 'react';

import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import {
	addFileAttrsToUrl,
	type FileIdentifier,
	type MediaStoreGetFileImageParams,
	type ResponseFileItem,
} from '@atlaskit/media-client';
import { generateSampleFileItem, sampleBinaries } from '@atlaskit/media-test-data';

import { createMockedMediaClientProvider } from './__tests__/helpers/_MockedMediaClientProvider';
import { mediaFilePreviewCache } from './getPreview';
import { type MediaFilePreview } from './types';
import { useFilePreview, type UseFilePreviewParams } from './useFilePreview';

const GLOBAL_MEDIA_CARD_SSR = 'mediaCardSsr';
const GLOBAL_MEDIA_NAMESPACE = '__MEDIA_INTERNAL';

const setGlobalSSRData = (id: string, data: any) => {
	// @ts-ignore
	window[GLOBAL_MEDIA_NAMESPACE] = { [GLOBAL_MEDIA_CARD_SSR]: { [id]: data } };
};

const createMediaBlobUrlAttrsObject = ({
	identifier,
	fileItem,
}: {
	fileItem: ResponseFileItem;
	identifier: FileIdentifier;
}) => ({
	id: identifier.id,
	contextId: 'some-context',
	collection: identifier.collectionName,
	size: 123456,
	name: fileItem.details.name,
	mimeType: fileItem.details.mimeType,
	width: 100,
	height: 100,
	alt: 'some-alt',
});

// TODO: TEST Race conditions, dimension update, status and error handling, retina display
// Make sure the props work ok:
/* 
  - identifier
  - resizeMode
  - dimensions
  - ssr
  - mediaBlobUrlAttrs
  - traceContext
  - previewDidRender
  - skipRemote 
*/

describe('useFilePreview', () => {
	beforeEach(() => {
		mediaFilePreviewCache.clear();
	});

	describe('Files with no preview and other errors', () => {
		it('should set complete status if the file has been fully processed without a preview', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithoutRemotePreview();
			const { MockedMediaClientProvider } = createMockedMediaClientProvider({
				initialItems: fileItem,
			});

			const { result } = renderHook(useFilePreview, {
				wrapper: ({ children }) => (
					<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
				),
				initialProps: {
					identifier,
				},
			});

			await waitFor(() => expect(result?.current.status).toBe('complete'));
			expect(result?.current.error).toBeUndefined();
		});

		it('should set error status if there is no preview and the file has failed processing', async () => {
			const [fileItem, identifier] = generateSampleFileItem.failedVideo();
			const { MockedMediaClientProvider } = createMockedMediaClientProvider({
				initialItems: fileItem,
			});

			const { result } = renderHook(useFilePreview, {
				wrapper: ({ children }) => (
					<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
				),
				initialProps: { identifier },
			});

			await waitFor(() => expect(result?.current.status).toBe('error'));
			expect(result?.current.error).toBeDefined();
		});

		it('should set error status if there is no preview and the file is not found', async () => {
			const [, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
			// We do not pass the file Item to the provider, so we generate a NOT FOUND error
			const { MockedMediaClientProvider } = createMockedMediaClientProvider({});

			const { result } = renderHook(useFilePreview, {
				wrapper: ({ children }) => (
					<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
				),
				initialProps: { identifier },
			});

			await waitFor(() => expect(result?.current.status).toBe('error'));
			expect(result?.current.error).toEqual(expect.any(Error));
			expect(result?.current.error?.message).toBe('metadata-fetch');
		});

		it('should set loading status if the file is processing without preview', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithoutRemotePreview();
			const { MockedMediaClientProvider, processItem } = createMockedMediaClientProvider({
				initialItems: fileItem,
			});

			processItem(fileItem, 0.5);

			const { result } = renderHook(useFilePreview, {
				wrapper: ({ children }) => (
					<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
				),
				initialProps: {
					identifier,
				},
			});

			await waitFor(() => expect(result?.current.status).toBe('loading'));
			expect(result?.current.error).toBeUndefined();
		});

		it('should set loading status if the file is uploading without preview', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingPdfWithRemotePreview();
			const { MockedMediaClientProvider, uploadItem } = createMockedMediaClientProvider({
				initialItems: fileItem,
			});

			uploadItem(fileItem, 0.5);

			const { result } = renderHook(useFilePreview, {
				wrapper: ({ children }) => (
					<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
				),
				initialProps: {
					identifier,
				},
			});

			await waitFor(() => expect(result?.current.status).toBe('loading'));
			expect(result?.current.error).toBeUndefined();
		});
	});

	describe('When file state is error', () => {
		it('should set error status if the file state is error, after upfront preview was resolved and there is no preview', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
			const { MockedMediaClientProvider, mediaApi } = createMockedMediaClientProvider({
				initialItems: fileItem,
			});

			let rejectImagePromise: (...params: any) => void = async () => {};
			const getImageSpy = jest.spyOn(mediaApi, 'getImage').mockImplementation(
				() =>
					new Promise((_, reject) => {
						rejectImagePromise = reject;
					}),
			);

			const getItemsSpy = jest
				.spyOn(mediaApi, 'getItems')
				.mockRejectedValue(new Error('some-getItems-error'));

			const { result } = renderHook(useFilePreview, {
				wrapper: ({ children }) => (
					<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
				),
				initialProps: { identifier },
			});

			await waitFor(() => expect(result?.current.status).toBe('loading'));
			expect(getImageSpy).toBeCalledTimes(1);
			// This call throws an error, but it should not change the status till getImage resolves
			expect(getItemsSpy).toBeCalledTimes(1);
			expect(result?.current.error).toBeUndefined();

			rejectImagePromise(new Error('some-getItems-error'));

			// Error should be set after the getImage is rejected
			await waitFor(() => expect(result?.current.status).toBe('error'));
			expect(getItemsSpy).toBeCalledTimes(1);
			expect(getImageSpy).toBeCalledTimes(1);
			expect(result?.current.error?.message).toBe('metadata-fetch');
		});

		it('should set complete status if the file state is error but there is a valid preview', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
			const { MockedMediaClientProvider, mediaApi } = createMockedMediaClientProvider({
				initialItems: fileItem,
			});

			let resolveGetImage: (...params: any) => any = async () => {};
			const getImageSpy = jest.spyOn(mediaApi, 'getImage').mockImplementation(
				() =>
					new Promise((resolve) => {
						resolveGetImage = resolve;
					}),
			);

			const getItemsSpy = jest
				.spyOn(mediaApi, 'getItems')
				.mockRejectedValue(new Error('some-getItems-error'));

			const { result } = renderHook(useFilePreview, {
				wrapper: ({ children }) => (
					<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
				),
				initialProps: { identifier },
			});

			await waitFor(() => expect(result?.current.status).toBe('loading'));
			expect(getImageSpy).toBeCalledTimes(1);
			// This call throws an error, but it should not change the status till getImage resolves
			expect(getItemsSpy).toBeCalledTimes(1);
			expect(result?.current.error).toBeUndefined();

			resolveGetImage(new Blob([], { type: 'image/png' }));

			// Complete should be set after the getImage is resolved
			await waitFor(() => expect(result?.current.status).toBe('complete'));
			expect(getItemsSpy).toBeCalledTimes(1);
			expect(getImageSpy).toBeCalledTimes(1);
			expect(result?.current.error).toBeUndefined();
		});
	});

	describe('Memory Cache Preview', () => {
		it.each`
			ssr          | resizeMode
			${undefined} | ${undefined}
			${'server'}  | ${undefined}
			${'client'}  | ${undefined}
			${undefined} | ${'fit'}
			${'server'}  | ${'fit'}
			${'client'}  | ${'fit'}
		`(
			'should use preview from cache when ssr is $ssr and resize mode is $resizeMode',
			async ({ ssr, resizeMode }) => {
				const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
				const { MockedMediaClientProvider } = createMockedMediaClientProvider({
					initialItems: fileItem,
				});

				const cachedPreview = {
					dataURI: 'some-datauri',
					source: 'cache-remote',
				} as const;

				mediaFilePreviewCache.set(identifier.id, resizeMode, cachedPreview);

				const { result } = renderHook(useFilePreview, {
					wrapper: ({ children }) => (
						<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
					),
					initialProps: {
						identifier,
						resizeMode,
						ssr,
						// Should use cached preview even if remote is skipped
						skipRemote: true,
					},
				});

				expect(result?.current.status).toBe('complete');
				expect(result?.current.preview).toBe(cachedPreview);
			},
		);
	});

	describe('SSR Preview', () => {
		describe('when in Server', () => {
			it('should use ssr preview when ssr is server', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
				const { MockedMediaClientProvider } = createMockedMediaClientProvider({
					initialItems: fileItem,
				});

				const mediaBlobUrlAttrs = createMediaBlobUrlAttrsObject({
					fileItem,
					identifier,
				});

				const { result } = renderHook(useFilePreview, {
					wrapper: ({ children }) => (
						<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
					),
					initialProps: {
						identifier,
						ssr: 'server',
						mediaBlobUrlAttrs,
					},
				});

				expect(result?.current.status).toBe('complete');
				expect(result?.current.preview).toMatchObject({
					dataURI: expect.stringContaining(`image-url-sync-${identifier.id}`),
					source: 'ssr-server',
				});

				// mediaBlobUrlAttrs must be attached to the url
				expect(result?.current.preview?.dataURI).toContain(
					addFileAttrsToUrl('', mediaBlobUrlAttrs),
				);
			});

			it('should return a method that returns properties for an HTML script to support Hidration', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
				const { MockedMediaClientProvider } = createMockedMediaClientProvider({
					initialItems: fileItem,
				});

				const { result } = renderHook(useFilePreview, {
					wrapper: ({ children }) => (
						<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
					),
					initialProps: {
						identifier,
						ssr: 'server',
					},
				});

				expect(result?.current.status).toBe('complete');
				expect(result?.current.getSsrScriptProps).toEqual(expect.any(Function));
				const ssrScriptProps = result?.current.getSsrScriptProps?.();
				expect(ssrScriptProps).toMatchObject({
					dangerouslySetInnerHTML: { __html: expect.any(String) },
				});
			});

			it('should catch the error when creating an SSR server preview', () => {
				const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
				const { MockedMediaClientProvider, mediaApi } = createMockedMediaClientProvider({
					initialItems: fileItem,
				});

				const getFileImageURLSync = jest
					.spyOn(mediaApi, 'getFileImageURLSync')
					.mockImplementation(() => {
						throw new Error('some-error');
					});

				const { result } = renderHook(useFilePreview, {
					wrapper: ({ children }) => (
						<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
					),
					initialProps: {
						identifier,
						ssr: 'server',
						traceContext: { traceId: 'some-trace' },
					},
				});

				expect(getFileImageURLSync).toBeCalledTimes(1);
				// Should not be error status
				expect(result?.current.status).toBe('loading');
				expect(result?.current.preview).toBeUndefined();
				expect(result?.current.ssrReliability).toMatchObject({
					server: {
						status: 'fail',
						error: 'nativeError',
						errorDetail: 'some-error',
						failReason: 'ssr-server-uri',
						metadataTraceContext: { traceId: 'some-trace' },
					},
				});
			});
		});

		describe('during Hidration', () => {
			it.each([
				['no dimensions are set', undefined, undefined],
				[
					'global scope dimensions are bigger than input dimensions',
					{ width: 100, height: 100 },
					{ width: 50, height: 50 },
				],
			])(
				'should use preview from global scope when ssr is client and %s',
				async (_title, globalScopeDimensions, inputDimensions) => {
					const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
					const { MockedMediaClientProvider } = createMockedMediaClientProvider({
						initialItems: fileItem,
					});

					const globalScopePreview = {
						dataURI: 'global-scope-datauri',
						source: 'ssr-data',
						dimensions: globalScopeDimensions,
					};
					const { id, collectionName } = identifier;
					setGlobalSSRData(`${id}-${collectionName}`, globalScopePreview);

					const { result } = renderHook(useFilePreview, {
						wrapper: ({ children }) => (
							<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
						),
						initialProps: {
							identifier,
							ssr: 'client',
							dimensions: inputDimensions,
						},
					});

					expect(result?.current.status).toBe('complete');
					expect(result?.current.preview).toMatchObject(globalScopePreview);
				},
			);

			it('should set ssrReliability using the error from global scope', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
				const { MockedMediaClientProvider } = createMockedMediaClientProvider({
					initialItems: fileItem,
				});

				const globalScopeData = {
					error: {
						error: 'nativeError',
						errorDetail: 'some-error',
						failReason: 'ssr-server-uri',
						metadataTraceContext: { traceId: 'some-trace' },
					},
				};

				const { id, collectionName } = identifier;
				setGlobalSSRData(`${id}-${collectionName}`, globalScopeData);

				const { result } = renderHook(useFilePreview, {
					wrapper: ({ children }) => (
						<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
					),
					initialProps: {
						identifier,
						ssr: 'client',
					},
				});

				expect(result?.current.ssrReliability).toMatchObject({
					server: {
						status: 'fail',
						...globalScopeData.error,
					},
				});
			});

			it('should use ssr preview when ssr is client and there is no preview in global scope', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
				const { MockedMediaClientProvider } = createMockedMediaClientProvider({
					initialItems: fileItem,
				});

				const mediaBlobUrlAttrs = createMediaBlobUrlAttrsObject({
					fileItem,
					identifier,
				});

				const { result } = renderHook(useFilePreview, {
					wrapper: ({ children }) => (
						<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
					),
					initialProps: {
						identifier,
						ssr: 'client',
						mediaBlobUrlAttrs,
					},
				});

				expect(result?.current.status).toBe('complete');
				expect(result?.current.preview).toMatchObject({
					dataURI: expect.stringContaining(`image-url-sync-${identifier.id}`),
					source: 'ssr-client',
				});

				// mediaBlobUrlAttrs must be attached to the url
				expect(result?.current.preview?.dataURI).toContain(
					addFileAttrsToUrl('', mediaBlobUrlAttrs),
				);
			});

			it('should catch the error when creating an SSR client preview', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
				const { MockedMediaClientProvider, mediaApi } = createMockedMediaClientProvider({
					initialItems: fileItem,
				});

				const getFileImageURLSync = jest
					.spyOn(mediaApi, 'getFileImageURLSync')
					.mockImplementation(() => {
						throw new Error('some-error');
					});

				const { result } = renderHook(useFilePreview, {
					wrapper: ({ children }) => (
						<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
					),
					initialProps: {
						identifier,
						ssr: 'client',
						traceContext: { traceId: 'some-trace' },
					},
				});

				expect(getFileImageURLSync).toBeCalledTimes(1);
				// Should not be error status
				expect(result?.current.status).toBe('loading');
				expect(result?.current.preview).toBeUndefined();
				expect(result?.current.ssrReliability).toMatchObject({
					client: {
						status: 'fail',
						error: 'nativeError',
						errorDetail: 'some-error',
						failReason: 'ssr-client-uri',
						metadataTraceContext: { traceId: 'some-trace' },
					},
				});

				// A backend preview should be fetched
				await waitFor(() =>
					expect(result?.current.preview).toMatchObject({
						dataURI: expect.stringContaining('mock result of URL.createObjectURL()'),
						source: 'remote',
					}),
				);
			});
		});
	});

	describe('Upfront Remote Preview', () => {
		it('should use upfront remote preview if there is no preview and no file state after unskipping remote', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
			const { MockedMediaClientProvider, mediaApi } = createMockedMediaClientProvider({
				initialItems: fileItem,
			});
			const getImageSpy = jest.spyOn(mediaApi, 'getImage');

			let resolveItemsPromise: (...params: any) => void = () => {};
			const getItemsSpy = jest.spyOn(mediaApi, 'getItems').mockImplementation(
				() =>
					new Promise((resolve) => {
						resolveItemsPromise = resolve;
					}),
			);

			const mediaBlobUrlAttrs = createMediaBlobUrlAttrsObject({
				fileItem,
				identifier,
			});

			const initialProps: UseFilePreviewParams = {
				identifier,
				skipRemote: true,
				dimensions: { width: 500, height: 500 },
				mediaBlobUrlAttrs,
			};

			const { result, rerender } = renderHook(useFilePreview, {
				wrapper: ({ children }) => (
					<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
				),
				initialProps,
			});

			expect(getItemsSpy).not.toBeCalled();
			expect(getImageSpy).not.toBeCalled();
			expect(result?.current.status).toBe('loading');
			expect(result?.current.preview).toBeUndefined();

			// unskip remote
			rerender({ ...initialProps, skipRemote: false });

			// Items call should be performed, but we are delaying the response artificialy withing getItemsSpy
			await waitFor(() => expect(getItemsSpy).toBeCalledTimes(1));

			// A preview fetch should happened while waiting for a file state
			await waitFor(() =>
				expect(result?.current.preview).toMatchObject({
					dataURI: expect.stringContaining('mock result of URL.createObjectURL()'),
					source: 'remote',
				}),
			);

			// mediaBlobUrlAttrs must be attached to the url
			expect(result?.current.preview?.dataURI).toContain(addFileAttrsToUrl('', mediaBlobUrlAttrs));

			expect(result?.current.status).toBe('complete');

			expect(getImageSpy).toBeCalledTimes(1);
			resolveItemsPromise();
		});

		describe('should not use upfront remote preview if there is a', () => {
			it.each([undefined, 'crop'] as MediaStoreGetFileImageParams['mode'][])(
				'cached preview (resize mode %s)',
				async (resizeMode) => {
					const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
					const { MockedMediaClientProvider, mediaApi } = createMockedMediaClientProvider({
						initialItems: fileItem,
					});
					const getImageSpy = jest.spyOn(mediaApi, 'getImage');

					const cachedPreview = {
						dataURI: 'some-datauri',
						source: 'cache-remote',
					} as const;

					mediaFilePreviewCache.set(identifier.id, resizeMode, cachedPreview);

					const initialProps: UseFilePreviewParams = {
						identifier,
						skipRemote: true,
						dimensions: { width: 500, height: 500 },
						resizeMode,
					};

					const { result, rerender } = renderHook(useFilePreview, {
						wrapper: ({ children }) => (
							<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
						),
						initialProps,
					});

					expect(getImageSpy).not.toBeCalled();
					expect(result?.current.status).toBe('complete');
					expect(result?.current.preview).toBe(cachedPreview);

					// unskip remote
					rerender({ ...initialProps, skipRemote: false });

					expect(getImageSpy).toBeCalledTimes(0);
				},
			);

			it('global scope preview', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
				const { MockedMediaClientProvider, mediaApi } = createMockedMediaClientProvider({
					initialItems: fileItem,
				});
				const getImageSpy = jest.spyOn(mediaApi, 'getImage');

				const globalScopePreview = {
					dataURI: 'global-scope-datauri',
					source: 'ssr-data',
				};
				const { id, collectionName } = identifier;
				setGlobalSSRData(`${id}-${collectionName}`, globalScopePreview);

				const initialProps: UseFilePreviewParams = {
					identifier,
					ssr: 'client',
					skipRemote: true,
				};

				const { result, rerender } = renderHook(useFilePreview, {
					wrapper: ({ children }) => (
						<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
					),
					initialProps: initialProps,
				});

				expect(result?.current.status).toBe('complete');
				expect(result?.current.preview).toMatchObject(globalScopePreview);

				// unskip remote
				rerender({ ...initialProps, skipRemote: false });

				expect(getImageSpy).toBeCalledTimes(0);
			});

			it.each(['server', 'client'] as const)('ssr %s preview', async (ssr) => {
				const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
				const { MockedMediaClientProvider, mediaApi } = createMockedMediaClientProvider({
					initialItems: fileItem,
				});

				const getImageSpy = jest.spyOn(mediaApi, 'getImage');

				const initialProps: UseFilePreviewParams = {
					identifier,
					skipRemote: true,
					ssr,
				};

				const { result, rerender } = renderHook(useFilePreview, {
					wrapper: ({ children }) => (
						<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
					),
					initialProps,
				});

				expect(getImageSpy).not.toBeCalled();
				expect(result?.current.status).toBe('complete');
				expect(result?.current.preview).toMatchObject({
					dataURI: `image-url-sync-${identifier.id}`,
					source: `ssr-${ssr}`,
				});

				// unskip remote
				rerender({ ...initialProps, skipRemote: false });

				expect(getImageSpy).toBeCalledTimes(0);
			});
		});
	});

	describe('Local Preview', () => {
		it('should use local preview and cache it if available', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
			const { MockedMediaClientProvider, uploadItem, mediaApi } = createMockedMediaClientProvider({
				initialItems: fileItem,
			});

			const getImageSpy = jest.spyOn(mediaApi, 'getImage');

			// Adds a local preview to the state
			uploadItem(fileItem, 0.8);

			const mediaBlobUrlAttrs = createMediaBlobUrlAttrsObject({
				fileItem,
				identifier,
			});

			const { result } = renderHook(useFilePreview, {
				wrapper: ({ children }) => (
					<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
				),
				initialProps: {
					identifier,
					mediaBlobUrlAttrs,
				},
			});

			await waitFor(() =>
				expect(result?.current.preview).toMatchObject({
					dataURI: expect.stringContaining('mock result of URL.createObjectURL()'),
					source: 'local',
				}),
			);
			// mediaBlobUrlAttrs must be attached to the url
			expect(result?.current.preview?.dataURI).toContain(addFileAttrsToUrl('', mediaBlobUrlAttrs));

			expect(result?.current.status).toBe('complete');

			// local preview should be in cache
			expect(mediaFilePreviewCache.get(identifier.id, undefined)).toMatchObject({
				dataURI: expect.stringContaining('mock result of URL.createObjectURL()'),
				source: 'cache-local',
			});
			// remote preview is called by upfront preview.
			expect(getImageSpy).toBeCalledTimes(1);
		});

		const rotated = sampleBinaries.jpgRotated();
		type BinaryKey = keyof Awaited<typeof rotated>;
		type TestArgs = { binaryKey: BinaryKey; expected: number };

		it.each`
			binaryKey       | expected
			${'landscape1'} | ${1}
			${'landscape2'} | ${2}
			${'landscape3'} | ${3}
			${'landscape4'} | ${4}
			${'landscape5'} | ${5}
			${'landscape6'} | ${6}
			${'landscape7'} | ${7}
			${'landscape8'} | ${8}
		`(
			'should set the correct preview orientation (orientation: $expected)',
			async ({ binaryKey, expected }: TestArgs) => {
				const binary = (await rotated)[binaryKey];

				const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
				const { MockedMediaClientProvider, uploadItem } = createMockedMediaClientProvider({
					initialItems: fileItem,
				});

				// We only rotate local preview
				uploadItem(fileItem, 0.5, binary);

				const { result } = renderHook(useFilePreview, {
					wrapper: ({ children }) => (
						<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
					),
					initialProps: {
						identifier,
					},
				});

				await waitFor(() => expect(result?.current.preview).toBeDefined());

				expect(result?.current.preview?.orientation).toBe(expected);
			},
		);
	});

	describe('Remote Preview', () => {
		describe.each`
			resizeMode
			${undefined}
			${'crop'}
		`('refetch global scope & SSR preview', ({ resizeMode }) => {
			it(`should use and cache remote preview when using global scope preview and remote is unskipped (resize mode: ${resizeMode})`, async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
				const { MockedMediaClientProvider, mediaApi } = createMockedMediaClientProvider({
					initialItems: fileItem,
				});

				const getImageSpy = jest.spyOn(mediaApi, 'getImage');

				const globalScopePreview = {
					dataURI: 'global-scope-datauri',
					source: 'ssr-data',
					dimensions: { width: 100, height: 100 },
				};

				const mediaBlobUrlAttrs = createMediaBlobUrlAttrsObject({
					fileItem,
					identifier,
				});

				const { id, collectionName } = identifier;
				setGlobalSSRData(`${id}-${collectionName}`, globalScopePreview);

				const initialProps = {
					identifier,
					ssr: 'client',
					resizeMode,
					skipRemote: true,
					mediaBlobUrlAttrs,
				} as const;

				const { result, rerender } = renderHook(useFilePreview, {
					wrapper: ({ children }) => (
						<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
					),
					initialProps,
				});

				expect(result?.current.status).toBe('complete');
				// should use global scope preview
				expect(result?.current.preview).toMatchObject(globalScopePreview);

				// remote preview should not be fetched before unskipping remote
				expect(getImageSpy).not.toHaveBeenCalled();

				// unskip remote
				rerender({ ...initialProps, skipRemote: false });

				await waitFor(() =>
					expect(result?.current.preview).toMatchObject({
						dataURI: expect.stringContaining('mock result of URL.createObjectURL()'),
						source: 'remote',
					}),
				);
				// mediaBlobUrlAttrs must be attached to the url
				expect(result?.current.preview?.dataURI).toContain(
					addFileAttrsToUrl('', mediaBlobUrlAttrs),
				);

				// remote preview should be in cache
				expect(mediaFilePreviewCache.get(identifier.id, resizeMode)).toMatchObject({
					dataURI: expect.stringContaining('mock result of URL.createObjectURL()'),
					source: 'cache-remote',
				});

				expect(getImageSpy).toBeCalledTimes(1);
			});

			it(`should use and cache remote preview when using ssr preview and remote is unskipped (resize mode: ${resizeMode})`, async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
				const { MockedMediaClientProvider, mediaApi } = createMockedMediaClientProvider({
					initialItems: fileItem,
				});

				const getImageSpy = jest.spyOn(mediaApi, 'getImage');

				const mediaBlobUrlAttrs = createMediaBlobUrlAttrsObject({
					fileItem,
					identifier,
				});

				const initialProps = {
					identifier,
					ssr: 'client',
					resizeMode,
					skipRemote: true,
					mediaBlobUrlAttrs,
				} as const;

				const { result, rerender } = renderHook(useFilePreview, {
					wrapper: ({ children }) => (
						<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
					),
					initialProps,
				});

				expect(result?.current.status).toBe('complete');
				// should use ssr preview
				expect(result?.current.preview).toMatchObject({
					dataURI: expect.stringContaining(`image-url-sync-${identifier.id}`),
					source: 'ssr-client',
				});

				// remote preview should not be fetched before unskipping remote
				expect(getImageSpy).not.toHaveBeenCalled();

				// unskip remote
				rerender({ ...initialProps, skipRemote: false });

				await waitFor(() =>
					expect(result?.current.preview).toMatchObject({
						dataURI: expect.stringContaining('mock result of URL.createObjectURL()'),
						source: 'remote',
					}),
				);
				// mediaBlobUrlAttrs must be attached to the url
				expect(result?.current.preview?.dataURI).toContain(
					addFileAttrsToUrl('', mediaBlobUrlAttrs),
				);

				// remote preview should be in cache
				expect(mediaFilePreviewCache.get(identifier.id, resizeMode)).toMatchObject({
					dataURI: expect.stringContaining('mock result of URL.createObjectURL()'),
					source: 'cache-remote',
				});

				expect(getImageSpy).toBeCalledTimes(1);
			});
		});

		describe('On preview error', () => {
			describe('should update ssrReliability object from global scope preview error', () => {
				it(`before unskipping remote`, async () => {
					const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
					const { MockedMediaClientProvider, mediaApi } = createMockedMediaClientProvider({
						initialItems: fileItem,
					});

					const getImageSpy = jest.spyOn(mediaApi, 'getImage');

					const globalScopePreview: MediaFilePreview = {
						dataURI: 'global-scope-datauri',
						source: 'ssr-data',
						dimensions: { width: 100, height: 100 },
					};

					const { id, collectionName } = identifier;
					setGlobalSSRData(`${id}-${collectionName}`, globalScopePreview);

					const initialProps = {
						identifier,
						ssr: 'client',
						skipRemote: true,
						traceContext: { traceId: 'some-trace' },
					} as const;

					const { result, rerender } = renderHook(useFilePreview, {
						wrapper: ({ children }) => (
							<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
						),
						initialProps,
					});

					expect(result?.current.status).toBe('complete');
					// should use global scope preview
					expect(result?.current.preview).toMatchObject(globalScopePreview);
					// remote preview should not be fetched before unskipping remote
					expect(getImageSpy).not.toHaveBeenCalled();

					// Trigger error
					result?.current.onImageError(globalScopePreview);

					// unskip remote
					rerender({ ...initialProps, skipRemote: false });

					await waitFor(() =>
						expect(result?.current.preview).toMatchObject({
							dataURI: expect.stringContaining('mock result of URL.createObjectURL()'),
							source: 'remote',
						}),
					);
					expect(result?.current.status).toBe('complete');
					expect(result?.current.ssrReliability).toMatchObject({
						client: {
							error: 'nativeError',
							errorDetail: 'ssr-server-uri',
							failReason: 'ssr-server-uri',
							metadataTraceContext: {
								traceId: 'some-trace',
							},
							status: 'fail',
						},
						server: {
							error: 'nativeError',
							errorDetail: 'ssr-server-uri',
							failReason: 'ssr-server-uri',
							metadataTraceContext: {
								traceId: 'some-trace',
							},
							status: 'fail',
						},
					});

					expect(getImageSpy).toBeCalledTimes(1);
				});

				it(`after unskipping remote`, async () => {
					const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
					const { MockedMediaClientProvider, mediaApi } = createMockedMediaClientProvider({
						initialItems: fileItem,
					});

					const getImageSpy = jest.spyOn(mediaApi, 'getImage');

					const globalScopePreview: MediaFilePreview = {
						dataURI: 'global-scope-datauri',
						source: 'ssr-data',
						dimensions: { width: 100, height: 100 },
					};

					const { id, collectionName } = identifier;
					setGlobalSSRData(`${id}-${collectionName}`, globalScopePreview);

					const initialProps = {
						identifier,
						ssr: 'client',
						traceContext: { traceId: 'some-trace' },
					} as const;

					const { result } = renderHook(useFilePreview, {
						wrapper: ({ children }) => (
							<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
						),
						initialProps,
					});

					expect(result?.current.status).toBe('complete');
					// should use global scope preview
					expect(result?.current.preview).toMatchObject(globalScopePreview);
					// remote preview should not be fetched before unskipping remote
					expect(getImageSpy).not.toHaveBeenCalled();

					// Trigger error
					result?.current.onImageError(globalScopePreview);

					await waitFor(() =>
						expect(result?.current.preview).toMatchObject({
							dataURI: expect.stringContaining('mock result of URL.createObjectURL()'),
							source: 'remote',
						}),
					);
					expect(result?.current.status).toBe('complete');
					expect(result?.current.ssrReliability).toMatchObject({
						client: {
							error: 'nativeError',
							errorDetail: 'ssr-server-uri',
							failReason: 'ssr-server-uri',
							metadataTraceContext: {
								traceId: 'some-trace',
							},
							status: 'fail',
						},
						server: {
							error: 'nativeError',
							errorDetail: 'ssr-server-uri',
							failReason: 'ssr-server-uri',
							metadataTraceContext: {
								traceId: 'some-trace',
							},
							status: 'fail',
						},
					});
					expect(getImageSpy).toBeCalledTimes(1);
				});
			});

			describe('should update ssrReliability object from ssr-client preview error', () => {
				it(`before unskipping remote`, async () => {
					const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
					const { MockedMediaClientProvider, mediaApi } = createMockedMediaClientProvider({
						initialItems: fileItem,
					});

					const getImageSpy = jest.spyOn(mediaApi, 'getImage');

					const initialProps = {
						identifier,
						ssr: 'client',
						skipRemote: true,
						traceContext: { traceId: 'some-trace' },
					} as const;

					const { result, rerender } = renderHook(useFilePreview, {
						wrapper: ({ children }) => (
							<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
						),
						initialProps,
					});

					expect(result?.current.status).toBe('complete');
					// should use ssr preview
					expect(result?.current.preview).toMatchObject({
						dataURI: expect.stringContaining(`image-url-sync-${identifier.id}`),
						source: 'ssr-client',
					});
					// remote preview should not be fetched before unskipping remote
					expect(getImageSpy).not.toHaveBeenCalled();

					// Trigger error
					result?.current.onImageError(result?.current.preview);

					// unskip remote
					rerender({ ...initialProps, skipRemote: false });

					await waitFor(() =>
						expect(result?.current.preview).toMatchObject({
							dataURI: expect.stringContaining('mock result of URL.createObjectURL()'),
							source: 'remote',
						}),
					);
					expect(result?.current.status).toBe('complete');
					expect(result?.current.ssrReliability).toMatchObject({
						client: {
							error: 'nativeError',
							errorDetail: 'ssr-client-uri',
							failReason: 'ssr-client-uri',
							metadataTraceContext: {
								traceId: 'some-trace',
							},
							status: 'fail',
						},
						server: {
							status: 'unknown',
						},
					});

					expect(getImageSpy).toBeCalledTimes(1);
				});

				it(`after unskipping remote`, async () => {
					const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
					const { MockedMediaClientProvider, mediaApi } = createMockedMediaClientProvider({
						initialItems: fileItem,
					});

					const getImageSpy = jest.spyOn(mediaApi, 'getImage');

					const initialProps = {
						identifier,
						ssr: 'client',
						traceContext: { traceId: 'some-trace' },
					} as const;

					const { result } = renderHook(useFilePreview, {
						wrapper: ({ children }) => (
							<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
						),
						initialProps,
					});

					expect(result?.current.status).toBe('complete');
					// should use ssr preview
					expect(result?.current.preview).toMatchObject({
						dataURI: expect.stringContaining(`image-url-sync-${identifier.id}`),
						source: 'ssr-client',
					});
					// remote preview should not be fetched before unskipping remote
					expect(getImageSpy).not.toHaveBeenCalled();

					// Trigger error
					result?.current.onImageError(result?.current.preview);

					await waitFor(() =>
						expect(result?.current.preview).toMatchObject({
							dataURI: expect.stringContaining('mock result of URL.createObjectURL()'),
							source: 'remote',
						}),
					);
					expect(result?.current.status).toBe('complete');
					expect(result?.current.ssrReliability).toMatchObject({
						client: {
							error: 'nativeError',
							errorDetail: 'ssr-client-uri',
							failReason: 'ssr-client-uri',
							metadataTraceContext: {
								traceId: 'some-trace',
							},
							status: 'fail',
						},
						server: {
							status: 'unknown',
						},
					});

					expect(getImageSpy).toBeCalledTimes(1);
				});
			});

			describe('should use and cache remote preview when local preview failed to render', () => {
				it(`before unskipping remote`, async () => {
					const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
					const { MockedMediaClientProvider, mediaApi, uploadItem, processItem } =
						createMockedMediaClientProvider({
							initialItems: fileItem,
						});

					const getImageSpy = jest.spyOn(mediaApi, 'getImage');

					// Adds a local preview to the state
					uploadItem(fileItem, 0.8);

					const mediaBlobUrlAttrs = createMediaBlobUrlAttrsObject({
						fileItem,
						identifier,
					});

					const initialProps = {
						identifier,
						skipRemote: true,
						mediaBlobUrlAttrs,
					} as const;

					const { result, rerender } = renderHook(useFilePreview, {
						wrapper: ({ children }) => (
							<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
						),
						initialProps,
					});

					// should use local preview
					await waitFor(() =>
						expect(result?.current.preview).toMatchObject({
							dataURI: expect.stringContaining('mock result of URL.createObjectURL()'),
							source: 'local',
						}),
					);
					expect(result?.current.status).toBe('complete');

					// remote preview should not be fetched before unskipping remote
					expect(getImageSpy).not.toHaveBeenCalled();

					// Trigger error
					result?.current.onImageError(result?.current.preview);

					// Enables remote preview
					uploadItem(fileItem, 1);
					processItem(fileItem, 1);

					// unskip remote
					rerender({ ...initialProps, skipRemote: false });

					await waitFor(() =>
						expect(result?.current.preview).toMatchObject({
							dataURI: expect.stringContaining('mock result of URL.createObjectURL()'),
							source: 'remote',
						}),
					);
					expect(result?.current.status).toBe('complete');
					// mediaBlobUrlAttrs must be attached to the url
					expect(result?.current.preview?.dataURI).toContain(
						addFileAttrsToUrl('', mediaBlobUrlAttrs),
					);

					// remote preview should be in cache
					expect(mediaFilePreviewCache.get(identifier.id, undefined)).toMatchObject({
						dataURI: expect.stringContaining('mock result of URL.createObjectURL()'),
						source: 'cache-remote',
					});

					expect(getImageSpy).toBeCalledTimes(1);
				});

				it(`after unskipping remote`, async () => {
					const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
					const { MockedMediaClientProvider, mediaApi, uploadItem, processItem } =
						createMockedMediaClientProvider({
							initialItems: fileItem,
						});

					const getImageSpy = jest.spyOn(mediaApi, 'getImage');

					// Adds a local preview to the state
					uploadItem(fileItem, 0.8);

					const mediaBlobUrlAttrs = createMediaBlobUrlAttrsObject({
						fileItem,
						identifier,
					});

					const initialProps = {
						identifier,
						mediaBlobUrlAttrs,
					} as const;

					const { result } = renderHook(useFilePreview, {
						wrapper: ({ children }) => (
							<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
						),
						initialProps,
					});

					// should use local preview
					await waitFor(() =>
						expect(result?.current.preview).toMatchObject({
							dataURI: expect.stringContaining('mock result of URL.createObjectURL()'),
							source: 'local',
						}),
					);
					expect(result?.current.status).toBe('complete');

					// remote preview is called by upfront preview. This will fail as remote is not ready
					expect(getImageSpy).toBeCalledTimes(1);

					// Trigger error
					result?.current.onImageError(result?.current.preview);

					// Enables remote preview
					uploadItem(fileItem, 1);
					processItem(fileItem, 1);

					await waitFor(() =>
						expect(result?.current.preview).toMatchObject({
							dataURI: expect.stringContaining('mock result of URL.createObjectURL()'),
							source: 'remote',
						}),
					);
					expect(result?.current.status).toBe('complete');
					// mediaBlobUrlAttrs must be attached to the url
					expect(result?.current.preview?.dataURI).toContain(
						addFileAttrsToUrl('', mediaBlobUrlAttrs),
					);

					// remote preview should be in cache
					expect(mediaFilePreviewCache.get(identifier.id, undefined)).toMatchObject({
						dataURI: expect.stringContaining('mock result of URL.createObjectURL()'),
						source: 'cache-remote',
					});

					expect(getImageSpy).toBeCalledTimes(2);
				});
			});

			it('should return error if remote preview fails to render', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
				const { MockedMediaClientProvider, mediaApi } = createMockedMediaClientProvider({
					initialItems: fileItem,
				});

				const getImageSpy = jest.spyOn(mediaApi, 'getImage');

				const initialProps: UseFilePreviewParams = {
					identifier,
					dimensions: { width: 500, height: 500 },
				};

				const { result } = renderHook(useFilePreview, {
					wrapper: ({ children }) => (
						<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
					),
					initialProps,
				});

				await waitFor(() =>
					expect(result?.current.preview).toMatchObject({
						dataURI: expect.stringContaining('mock result of URL.createObjectURL()'),
						source: 'remote',
					}),
				);
				expect(result?.current.status).toBe('complete');

				// Trigger error
				result?.current.onImageError(result?.current.preview);

				await waitFor(() => expect(result?.current.status).toBe('error'));
				expect(result?.current.preview).toBeUndefined();
				expect(getImageSpy).toBeCalledTimes(1);
			});
		});

		describe('refetch on resize', () => {
			it.each`
				width  | height
				${200} | ${200}
				${50}  | ${200}
				${200} | ${50}
			`(
				'should refetch remote preview if there there are bigger dimensions',
				async ({ width, height }) => {
					const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
					const { MockedMediaClientProvider, mediaApi } = createMockedMediaClientProvider({
						initialItems: fileItem,
					});
					const getImageSpy = jest.spyOn(mediaApi, 'getImage');

					const mediaBlobUrlAttrs = createMediaBlobUrlAttrsObject({
						fileItem,
						identifier,
					});

					const initialProps: UseFilePreviewParams = {
						identifier,
						dimensions: { width: 100, height: 100 },
						mediaBlobUrlAttrs,
					};

					const { result, rerender } = renderHook(useFilePreview, {
						wrapper: ({ children }) => (
							<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
						),
						initialProps,
					});

					await waitFor(() =>
						expect(result?.current.preview).toMatchObject({
							dataURI: expect.stringContaining('mock result of URL.createObjectURL()'),
							source: 'remote',
							dimensions: { width: 100, height: 100 },
						}),
					);

					expect(result?.current.status).toBe('complete');
					expect(getImageSpy).toBeCalledTimes(1);

					// resize
					rerender({ ...initialProps, dimensions: { width, height } });

					expect(getImageSpy).toBeCalledTimes(2);
					await waitFor(() =>
						expect(result?.current.preview).toMatchObject({
							dataURI: expect.stringContaining('mock result of URL.createObjectURL()'),
							source: 'remote',
							dimensions: { width, height },
						}),
					);
					// mediaBlobUrlAttrs must be attached to the url
					expect(result?.current.preview?.dataURI).toContain(
						addFileAttrsToUrl('', mediaBlobUrlAttrs),
					);
				},
			);

			it('should not refetch a second time if the first refetch failed', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
				const { MockedMediaClientProvider, mediaApi } = createMockedMediaClientProvider({
					initialItems: fileItem,
				});
				const getImageSpy = jest.spyOn(mediaApi, 'getImage');

				const initialProps: UseFilePreviewParams = {
					identifier,
					dimensions: { width: 100, height: 100 },
				};

				const { result, rerender } = renderHook(useFilePreview, {
					wrapper: ({ children }) => (
						<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
					),
					initialProps,
				});

				await waitFor(() =>
					expect(result?.current.preview).toMatchObject({
						dataURI: 'mock result of URL.createObjectURL()',
						source: 'remote',
						dimensions: { width: 100, height: 100 },
					}),
				);

				expect(result?.current.status).toBe('complete');
				expect(getImageSpy).toBeCalledTimes(1);

				// Backend will fail
				getImageSpy.mockRejectedValueOnce(new Error('some error'));

				// resize
				rerender({ ...initialProps, dimensions: { width: 200, height: 200 } });

				expect(getImageSpy).toBeCalledTimes(2);

				await waitFor(() =>
					expect(result?.current.preview).toMatchObject({
						dataURI: 'mock result of URL.createObjectURL()',
						source: 'remote',
						dimensions: { width: 100, height: 100 },
					}),
				);

				// There should not be subsequent calls
				expect(getImageSpy).toBeCalledTimes(2);
			});

			it.each`
				width  | height
				${100} | ${100}
				${50}  | ${100}
				${100} | ${50}
			`(
				'should not refetch remote preview if there are equal or smaller dimensions',
				async ({ width, height }) => {
					const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
					const { MockedMediaClientProvider, mediaApi } = createMockedMediaClientProvider({
						initialItems: fileItem,
					});
					const getImageSpy = jest.spyOn(mediaApi, 'getImage');

					const initialProps: UseFilePreviewParams = {
						identifier,
						dimensions: { width: 100, height: 100 },
					};

					const { result, rerender } = renderHook(useFilePreview, {
						wrapper: ({ children }) => (
							<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
						),
						initialProps,
					});

					await waitFor(() =>
						expect(result?.current.preview).toMatchObject({
							dataURI: 'mock result of URL.createObjectURL()',
							source: 'remote',
							dimensions: { width: 100, height: 100 },
						}),
					);

					expect(result?.current.status).toBe('complete');
					expect(getImageSpy).toBeCalledTimes(1);

					// resize
					rerender({ ...initialProps, dimensions: { width, height } });

					// Should not refetch
					expect(getImageSpy).toBeCalledTimes(1);

					// Preview should remain the same
					expect(result?.current.preview).toMatchObject({
						dataURI: 'mock result of URL.createObjectURL()',
						source: 'remote',
						dimensions: { width: 100, height: 100 },
					});
				},
			);
		});
	});
});

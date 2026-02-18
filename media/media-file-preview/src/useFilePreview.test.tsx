import React, { act } from 'react';

import { renderHook, waitFor } from '@testing-library/react';

import {
	addFileAttrsToUrl,
	type FileIdentifier,
	type MediaStoreGetFileImageParams,
	type ResponseFileItem,
} from '@atlaskit/media-client';
import { createMediaStoreError } from '@atlaskit/media-client/test-helpers';
import { generateSampleFileItem, sampleBinaries } from '@atlaskit/media-test-data';
import { ffTest } from '@atlassian/feature-flags-test-utils';

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
	clientId: 'some-client-id',
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

	describe('Cross-client copy with auth', () => {
		ffTest.on(
			'platform_media_cross_client_copy_with_auth',
			'when feature flag is enabled',
			() => {
				it('should fetch clientId and include it in preview blob URL', async () => {
					const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
					const { MockedMediaClientProvider, mediaApi } = createMockedMediaClientProvider({
						initialItems: fileItem,
					});

					// Add getClientId to mediaApi mock
					const mockGetClientId = jest.fn().mockResolvedValue('test-client-id');
					(mediaApi as any).getClientId = mockGetClientId;

					const { result } = renderHook(useFilePreview, {
						wrapper: ({ children }) => (
							<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
						),
						initialProps: {
							identifier,
						},
					});

					// Wait for clientId to be fetched
					await waitFor(() => expect(mockGetClientId).toHaveBeenCalledWith(identifier.collectionName));

					// Wait for preview to be complete
					await waitFor(() => expect(result?.current.status).toBe('complete'));

					// Verify clientId is in the blob URL
					expect(result?.current.preview?.dataURI).toContain('clientId=test-client-id');
				});

				it('should update preview with clientId when clientId becomes available after preview', async () => {
					const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
					const { MockedMediaClientProvider, mediaApi } = createMockedMediaClientProvider({
						initialItems: fileItem,
					});

					let resolveClientId: (value: string) => void = () => {};
					const clientIdPromise = new Promise<string>((resolve) => {
						resolveClientId = resolve;
					});

					// Add getClientId to mediaApi mock
					const mockGetClientId = jest.fn().mockReturnValue(clientIdPromise);
					(mediaApi as any).getClientId = mockGetClientId;

					const { result } = renderHook(useFilePreview, {
						wrapper: ({ children }) => (
							<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
						),
						initialProps: {
							identifier,
						},
					});

					// Wait for preview to be complete (before clientId is available)
					await waitFor(() => expect(result?.current.status).toBe('complete'));

					// Verify preview exists but doesn't have clientId yet
					expect(result?.current.preview?.dataURI).not.toContain('clientId=');

					// Now resolve the clientId
					resolveClientId('delayed-client-id');

					// Wait for preview to be updated with clientId
					await waitFor(() =>
						expect(result?.current.preview?.dataURI).toContain('clientId=delayed-client-id'),
					);
				});

				it('should handle clientId unavailable gracefully', async () => {
					const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
					const { MockedMediaClientProvider, mediaApi } = createMockedMediaClientProvider({
						initialItems: fileItem,
					});

					// Return undefined instead of rejecting to simulate clientId not being available
					const mockGetClientId = jest.fn().mockResolvedValue(undefined);
					(mediaApi as any).getClientId = mockGetClientId;

					const { result } = renderHook(useFilePreview, {
						wrapper: ({ children }) => (
							<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
						),
						initialProps: {
							identifier,
						},
					});

					// Wait for clientId fetch to complete
					await waitFor(() => expect(mockGetClientId).toHaveBeenCalled());

					// Wait for preview to be complete
					await waitFor(() => expect(result?.current.status).toBe('complete'));

					// Preview should still work without clientId
					expect(result?.current.preview?.dataURI).toBeDefined();
					expect(result?.current.preview?.dataURI).not.toContain('clientId=');
				});
			},
		);

		ffTest.off(
			'platform_media_cross_client_copy_with_auth',
			'when feature flag is disabled',
			() => {
				it('should not fetch clientId', async () => {
					const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
					const { MockedMediaClientProvider, mediaApi } = createMockedMediaClientProvider({
						initialItems: fileItem,
					});

					// Add getClientId to mediaApi mock
					const mockGetClientId = jest.fn().mockResolvedValue('test-client-id');
					(mediaApi as any).getClientId = mockGetClientId;

					const { result } = renderHook(useFilePreview, {
						wrapper: ({ children }) => (
							<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
						),
						initialProps: {
							identifier,
						},
					});

					// Wait for preview to be complete
					await waitFor(() => expect(result?.current.status).toBe('complete'));

					// clientId should not be fetched when flag is off
					expect(mockGetClientId).not.toHaveBeenCalled();

					// Preview should not contain clientId
					expect(result?.current.preview?.dataURI).not.toContain('clientId=');
				});
			},
		);
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
			expect(getImageSpy).toHaveBeenCalledTimes(1);
			// This call throws an error, but it should not change the status till getImage resolves
			await waitFor(() => expect(getItemsSpy).toHaveBeenCalledTimes(1));
			expect(result?.current.error).toBeUndefined();

			rejectImagePromise(new Error('some-getItems-error'));

			// Error should be set after the getImage is rejected
			await waitFor(() => expect(result?.current.status).toBe('error'));
			expect(getItemsSpy).toHaveBeenCalledTimes(1);
			expect(getImageSpy).toHaveBeenCalledTimes(1);
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
			expect(getImageSpy).toHaveBeenCalledTimes(1);
			// This call throws an error, but it should not change the status till getImage resolves
			await waitFor(() => expect(getItemsSpy).toHaveBeenCalledTimes(1));
			expect(result?.current.error).toBeUndefined();

			resolveGetImage(new Blob([], { type: 'image/png' }));

			// Complete should be set after the getImage is resolved
			await waitFor(() => expect(result?.current.status).toBe('complete'));
			expect(getItemsSpy).toHaveBeenCalledTimes(1);
			expect(getImageSpy).toHaveBeenCalledTimes(1);
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
						throw createMediaStoreError();
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
						error: 'missingInitialAuth',
						errorDetail: 'missingInitialAuth',
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
					setGlobalSSRData(`${id}-${collectionName}-crop`, globalScopePreview);

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

			ffTest.on('media-perf-uplift-mutation-fix', 'SSR loadPromise handling', () => {
				it('should set status to complete when loadPromise resolves', async () => {
					const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
					const { MockedMediaClientProvider } = createMockedMediaClientProvider({
						initialItems: fileItem,
					});

					let resolveLoadPromise: () => void = () => {};
					const loadPromise = new Promise<void>((resolve) => {
						resolveLoadPromise = resolve;
					});

					const globalScopePreview = {
						dataURI: 'global-scope-datauri',
						source: 'ssr-data',
						dimensions: { width: 100, height: 100 },
						loadPromise,
					};

					const { id, collectionName } = identifier;
					setGlobalSSRData(`${id}-${collectionName}-crop`, globalScopePreview);

					const { result } = renderHook(useFilePreview, {
						wrapper: ({ children }) => (
							<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
						),
						initialProps: {
							identifier,
							ssr: 'client',
						},
					});

					expect(result?.current.status).toBe('complete');
					expect(result?.current.preview).toMatchObject({
						dataURI: 'global-scope-datauri',
						source: 'ssr-data',
						dimensions: { width: 100, height: 100 },
					});

					// Resolve the load promise
					resolveLoadPromise();

					// Status should remain complete after promise resolves
					await waitFor(() => expect(result?.current.status).toBe('complete'));
				});

				it('should reset preview when loadPromise rejects', async () => {
					const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
					const { MockedMediaClientProvider } = createMockedMediaClientProvider({
						initialItems: fileItem,
					});

					let rejectLoadPromise: (reason?: any) => void = () => {};
					const loadPromise = new Promise<void>((_, reject) => {
						rejectLoadPromise = reject;
					});

					const globalScopePreview = {
						dataURI: 'global-scope-datauri',
						source: 'ssr-data',
						dimensions: { width: 100, height: 100 },
						loadPromise,
					};

					const { id, collectionName } = identifier;
					setGlobalSSRData(`${id}-${collectionName}-crop`, globalScopePreview);

					const { result } = renderHook(useFilePreview, {
						wrapper: ({ children }) => (
							<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
						),
						initialProps: {
							identifier,
							ssr: 'client',
							skipRemote: true,
						},
					});

					expect(result?.current.status).toBe('complete');
					expect(result?.current.preview).toMatchObject({
						dataURI: 'global-scope-datauri',
						source: 'ssr-data',
						dimensions: { width: 100, height: 100 },
					});

					// Reject the load promise
					rejectLoadPromise(new Error('Load failed'));

					// Preview should be reset to undefined
					await waitFor(() => expect(result?.current.preview).toBeUndefined());
				});

				it('should not fetch remote preview when SSR preview with loadPromise is still resolving', async () => {
					const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
					const { MockedMediaClientProvider, mediaApi } = createMockedMediaClientProvider({
						initialItems: fileItem,
					});

					const getImageSpy = jest.spyOn(mediaApi, 'getImage');

					let resolveLoadPromise: () => void = () => {};
					const loadPromise = new Promise<void>((resolve) => {
						resolveLoadPromise = resolve;
					});

					const globalScopePreview = {
						dataURI: 'global-scope-datauri',
						source: 'ssr-data',
						dimensions: { width: 100, height: 100 },
						loadPromise,
					};

					const { id, collectionName } = identifier;
					setGlobalSSRData(`${id}-${collectionName}-crop`, globalScopePreview);

					const { result } = renderHook(useFilePreview, {
						wrapper: ({ children }) => (
							<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
						),
						initialProps: {
							identifier,
							ssr: 'client',
						},
					});

					expect(result?.current.status).toBe('complete');
					expect(result?.current.preview).toMatchObject({
						dataURI: 'global-scope-datauri',
						source: 'ssr-data',
						dimensions: { width: 100, height: 100 },
					});

					// Remote preview should not be fetched while SSR preview is active
					expect(getImageSpy).not.toHaveBeenCalled();

					// Resolve the load promise
					resolveLoadPromise();

					await waitFor(() => expect(result?.current.status).toBe('complete'));

					// Remote preview should still not be fetched after load promise resolves
					// because the SSR preview refetch is skipped by the feature flag
					expect(getImageSpy).not.toHaveBeenCalled();
				});
			});

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
				setGlobalSSRData(`${id}-${collectionName}-crop`, globalScopeData);

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

			// Note: The old test "should use ssr preview when ssr is client and there is no preview in global scope"
			// has been replaced by the test below. With the SSR data check fix, when there's no global SSR data
			// and ssr='client', we skip SSR preview generation entirely to avoid missingInitialAuth errors
			// during client-side navigation.

			it('should skip SSR preview generation when ssr=client but no SSR data exists (client-side navigation)', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
				const { MockedMediaClientProvider, mediaApi } = createMockedMediaClientProvider({
					initialItems: fileItem,
				});

				const getFileImageURLSync = jest.spyOn(mediaApi, 'getFileImageURLSync');

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

				// Should NOT attempt to create SSR client preview when no SSR data exists
				// This is the expected behavior for client-side navigation where no SSR occurred
				expect(getFileImageURLSync).not.toHaveBeenCalled();

				// Should not be error status
				expect(result?.current.status).toBe('loading');
				expect(result?.current.preview).toBeUndefined();

				// ssrReliability should remain in unknown state (not failed)
				// because SSR was never actually attempted
				expect(result?.current.ssrReliability).toMatchObject({
					server: { status: 'unknown' },
					client: { status: 'unknown' },
				});

				// A backend preview should be fetched as fallback
				await waitFor(() =>
					expect(result?.current.preview).toMatchObject({
						dataURI: expect.stringContaining('mock result of URL.createObjectURL()'),
						source: 'cache-remote',
					}),
				);
			});

			it('should catch the error when creating an SSR client preview with SSR data present', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
				const { MockedMediaClientProvider, mediaApi } = createMockedMediaClientProvider({
					initialItems: fileItem,
				});

				// Setup SSR data in global scope (but without dataURI to trigger getSSRPreview)
				const { id, collectionName } = identifier;
				setGlobalSSRData(`${id}-${collectionName}-crop`, {
					dimensions: { width: 100, height: 100 },
					// No dataURI - this will trigger getSSRPreview to be called
				});

				const getFileImageURLSync = jest
					.spyOn(mediaApi, 'getFileImageURLSync')
					.mockImplementation(() => {
						throw createMediaStoreError();
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
						error: 'missingInitialAuth',
						errorDetail: 'missingInitialAuth',
						failReason: 'ssr-client-uri',
						metadataTraceContext: { traceId: 'some-trace' },
					},
				});

				// A backend preview should be fetched
				await waitFor(() =>
					expect(result?.current.preview).toMatchObject({
						dataURI: expect.stringContaining('mock result of URL.createObjectURL()'),
						source: 'cache-remote',
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

		it('should not call image endpoint twice if the items response is received before upfront image response', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
			const { MockedMediaClientProvider, mediaApi } = createMockedMediaClientProvider({
				initialItems: fileItem,
			});
			let resolveImagePromise: (...params: any) => void = () => {};
			const getImageSpy = jest.spyOn(mediaApi, 'getImage').mockImplementation(
				() =>
					new Promise((resolve) => {
						resolveImagePromise = resolve;
					}),
			);

			let resolveItemsPromise: (...params: any) => void = () => {};
			const getItemsSpy = jest.spyOn(mediaApi, 'getItems').mockImplementation(
				() =>
					new Promise((resolve) => {
						resolveItemsPromise = () => {
							resolve({ data: { items: [fileItem] } });
						};
					}),
			);

			const mediaBlobUrlAttrs = createMediaBlobUrlAttrsObject({
				fileItem,
				identifier,
			});

			const initialProps: UseFilePreviewParams = {
				identifier,
				skipRemote: false,
				dimensions: { width: 500, height: 500 },
				mediaBlobUrlAttrs,
			};

			const { result, rerender } = renderHook(useFilePreview, {
				wrapper: ({ children }) => (
					<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
				),
				initialProps,
			});

			expect(result?.current.status).toBe('loading');
			expect(result?.current.preview).toBeUndefined();

			// unskip remote
			rerender({ ...initialProps, skipRemote: false });

			// Items call should be performed, but we are delaying the response artificialy withing getItemsSpy
			await waitFor(() => expect(getItemsSpy).toHaveBeenCalledTimes(1));

			resolveItemsPromise();

			resolveImagePromise();
			await waitFor(() => expect(result?.current.status).toBe('complete'));

			expect(getImageSpy).toHaveBeenCalledTimes(1);
		});

		it('should not call image endpoint three times if the dimensions increase and blobAttributes are added', async () => {
			const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
			const { MockedMediaClientProvider, mediaApi } = createMockedMediaClientProvider({
				initialItems: fileItem,
			});
			let resolveImagePromise: (...params: any) => void = () => {};
			const getImageSpy = jest.spyOn(mediaApi, 'getImage').mockImplementation(
				() =>
					new Promise((resolve) => {
						resolveImagePromise = resolve;
					}),
			);

			const getItemsSpy = jest.spyOn(mediaApi, 'getItems').mockImplementation(
				() =>
					new Promise((resolve) => {
						resolve({ data: { items: [fileItem] } });
					}),
			);

			const initialProps: UseFilePreviewParams = {
				identifier,
				skipRemote: false,
				dimensions: { width: 500, height: 500 },
			};

			const { result, rerender } = renderHook(useFilePreview, {
				wrapper: ({ children }) => (
					<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
				),
				initialProps,
			});

			expect(result?.current.status).toBe('loading');
			expect(result?.current.preview).toBeUndefined();

			// resolve upfront preview
			rerender({ ...initialProps, skipRemote: false });
			resolveImagePromise();
			const initialState = result?.current;
			await waitFor(() => expect(result?.current).not.toBe(initialState));
			await waitFor(() => expect(getItemsSpy).toHaveBeenCalledTimes(1));

			// update the dimensions (simulating confluence hydration)
			const newDimensions = { width: 600, height: 600 };
			rerender({ ...initialProps, dimensions: newDimensions });

			// update the mediaBlobUrlAttributes simulating what media card does on Items call resolving
			const mediaBlobUrlAttrs = createMediaBlobUrlAttrsObject({
				fileItem,
				identifier,
			});

			rerender({ ...initialProps, dimensions: newDimensions, mediaBlobUrlAttrs });

			expect(result?.current.status).toBe('complete');

			// image should not be called again for media blob url change
			expect(getImageSpy).toHaveBeenCalledTimes(2);
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
				setGlobalSSRData(`${id}-${collectionName}-crop`, globalScopePreview);

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

			// Note: Testing ssr='server' only since ssr='client' without global SSR data now skips
			// SSR preview generation (this is the expected behavior to avoid missingInitialAuth errors)
			it('ssr server preview', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
				const { MockedMediaClientProvider, mediaApi } = createMockedMediaClientProvider({
					initialItems: fileItem,
				});

				const getImageSpy = jest.spyOn(mediaApi, 'getImage');

				const initialProps: UseFilePreviewParams = {
					identifier,
					skipRemote: true,
					ssr: 'server',
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
					source: 'ssr-server',
				});

				// unskip remote
				rerender({ ...initialProps, skipRemote: false });

				expect(getImageSpy).toBeCalledTimes(0);
			});

			it('ssr client preview with global SSR data', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
				const { MockedMediaClientProvider, mediaApi } = createMockedMediaClientProvider({
					initialItems: fileItem,
				});

				const getImageSpy = jest.spyOn(mediaApi, 'getImage');

				// Setup global SSR data for ssr='client' to work
				const { id, collectionName } = identifier;
				setGlobalSSRData(`${id}-${collectionName}-crop`, {
					dataURI: `global-scope-datauri-${identifier.id}`,
					source: 'ssr-data',
				});

				const initialProps: UseFilePreviewParams = {
					identifier,
					skipRemote: true,
					ssr: 'client',
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
					dataURI: `global-scope-datauri-${identifier.id}`,
					source: 'ssr-data',
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
				setGlobalSSRData(`${id}-${collectionName}-crop`, globalScopePreview);

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
				// @ts-ignore - TS2322 TypeScript 5.9.2 upgrade
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

				// Setup global SSR data to enable SSR preview generation
				// Use 'crop' as the key suffix when resizeMode is undefined (since that's the default in useFilePreview)
				const { id, collectionName } = identifier;
				const keyResizeMode = resizeMode ?? 'crop';
				setGlobalSSRData(`${id}-${collectionName}-${keyResizeMode}`, {
					dataURI: `global-scope-datauri-${identifier.id}`,
					source: 'ssr-data',
					dimensions: { width: 100, height: 100 },
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

				// should use ssr preview from global scope (status may be 'loading' without feature flag)
				expect(result?.current.preview).toMatchObject({
					dataURI: expect.stringContaining(`global-scope-datauri-${identifier.id}`),
					source: 'ssr-data',
				});

				// remote preview should not be fetched before unskipping remote
				expect(getImageSpy).not.toHaveBeenCalled();

				// unskip remote
				// @ts-ignore - TS2322 TypeScript 5.9.2 upgrade
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
					setGlobalSSRData(`${id}-${collectionName}-crop`, globalScopePreview);

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
					// @ts-ignore - TS2322 TypeScript 5.9.2 upgrade
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
					setGlobalSSRData(`${id}-${collectionName}-crop`, globalScopePreview);

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

					// Setup global SSR data to test SSR preview error handling
					// Note: When reading from global scope, the hook always returns source: 'ssr-data'
					const { id, collectionName } = identifier;
					const ssrPreview = {
						dataURI: `ssr-datauri-${identifier.id}`,
						dimensions: { width: 100, height: 100 },
					};
					setGlobalSSRData(`${id}-${collectionName}-crop`, ssrPreview);

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
					// should use ssr preview from global scope (always returns 'ssr-data' source)
					expect(result?.current.preview).toMatchObject({
						dataURI: expect.stringContaining(`ssr-datauri-${identifier.id}`),
						source: 'ssr-data',
					});
					// remote preview should not be fetched before unskipping remote
					expect(getImageSpy).not.toHaveBeenCalled();

					// Trigger error
					result?.current.onImageError(result?.current.preview);

					// unskip remote
					// @ts-ignore - TS2322 TypeScript 5.9.2 upgrade
					rerender({ ...initialProps, skipRemote: false });

					await waitFor(() =>
						expect(result?.current.preview).toMatchObject({
							dataURI: expect.stringContaining('mock result of URL.createObjectURL()'),
							source: 'remote',
						}),
					);
					expect(result?.current.status).toBe('complete');
					// For ssr-data previews, both server and client are marked as failed
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

					// Setup global SSR data to test SSR preview error handling
					// Note: When reading from global scope, the hook always returns source: 'ssr-data'
					const { id, collectionName } = identifier;
					const ssrPreview = {
						dataURI: `ssr-datauri-${identifier.id}`,
						dimensions: { width: 100, height: 100 },
					};
					setGlobalSSRData(`${id}-${collectionName}-crop`, ssrPreview);

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
					// should use ssr preview from global scope (always returns 'ssr-data' source)
					expect(result?.current.preview).toMatchObject({
						dataURI: expect.stringContaining(`ssr-datauri-${identifier.id}`),
						source: 'ssr-data',
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
					// For ssr-data previews, both server and client are marked as failed
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
							status: 'fail',
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
					// @ts-ignore - TS2322 TypeScript 5.9.2 upgrade
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
						source: 'cache-remote',
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
							source: 'cache-remote',
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
						source: 'cache-remote',
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
						source: 'cache-remote',
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
							source: 'cache-remote',
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
						source: 'cache-remote',
						dimensions: { width: 100, height: 100 },
					});
				},
			);
		});

		describe('SSR preview refetch on resize', () => {
			ffTest.on('media-perf-uplift-mutation-fix', 'SSR preview resize optimization', () => {
				it.each`
					width  | height | previewType
					${100} | ${100} | ${'ssr-client'}
					${50}  | ${100} | ${'ssr-client'}
					${100} | ${50}  | ${'ssr-client'}
					${100} | ${100} | ${'ssr-data'}
					${50}  | ${100} | ${'ssr-data'}
					${100} | ${50}  | ${'ssr-data'}
				`(
					'should not refetch SSR preview ($previewType) if dimensions are equal or smaller (width: $width, height: $height)',
					async ({ width, height, previewType }) => {
						const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
						const { MockedMediaClientProvider, mediaApi } = createMockedMediaClientProvider({
							initialItems: fileItem,
						});

						const getImageSpy = jest.spyOn(mediaApi, 'getImage');

						let initialProps: UseFilePreviewParams;

						// Setup global scope preview for SSR tests
						// For ssr-client without global data, the hook now skips SSR preview generation
						// So we need to set up global scope data for both ssr-data and ssr-client tests
						const globalScopePreview = {
							dataURI: 'global-scope-datauri',
							source: previewType,
							dimensions: { width: 100, height: 100 },
						};

						const { id, collectionName } = identifier;
						setGlobalSSRData(`${id}-${collectionName}-crop`, globalScopePreview);

						initialProps = {
							identifier,
							ssr: 'client',
							dimensions: { width: 100, height: 100 },
						};

						const { result, rerender } = renderHook(useFilePreview, {
							wrapper: ({ children }) => (
								<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
							),
							initialProps,
						});

						await waitFor(() => expect(result?.current.status).toBe('complete'));
						expect(result?.current.preview?.source).toMatch(/^ssr-/);
						expect(getImageSpy).not.toHaveBeenCalled();

						// Resize to equal or smaller dimensions
						rerender({ ...initialProps, dimensions: { width, height } });

						// Should not refetch when dimensions are equal or smaller
						expect(getImageSpy).not.toHaveBeenCalled();
						expect(result?.current.status).toBe('complete');
					},
				);

				it.each`
					width  | height | previewType
					${200} | ${200} | ${'ssr-client'}
					${150} | ${200} | ${'ssr-client'}
					${200} | ${150} | ${'ssr-client'}
					${200} | ${200} | ${'ssr-data'}
					${150} | ${200} | ${'ssr-data'}
					${200} | ${150} | ${'ssr-data'}
				`(
					'should refetch SSR preview ($previewType) if dimensions are bigger (width: $width, height: $height)',
					async ({ width, height, previewType }) => {
						const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
						const { MockedMediaClientProvider, mediaApi } = createMockedMediaClientProvider({
							initialItems: fileItem,
						});

						const getImageSpy = jest.spyOn(mediaApi, 'getImage');

						let initialProps: UseFilePreviewParams;

						// Setup global scope preview for SSR tests
						// For ssr-client without global data, the hook now skips SSR preview generation
						// So we need to set up global scope data for both ssr-data and ssr-client tests
						const globalScopePreview = {
							dataURI: 'global-scope-datauri',
							source: previewType,
							dimensions: { width: 100, height: 100 },
						};

						const { id, collectionName } = identifier;
						setGlobalSSRData(`${id}-${collectionName}-crop`, globalScopePreview);

						initialProps = {
							identifier,
							ssr: 'client',
							dimensions: { width: 100, height: 100 },
						};

						const { result, rerender } = renderHook(useFilePreview, {
							wrapper: ({ children }) => (
								<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
							),
							initialProps,
						});

						await waitFor(() => expect(result?.current.status).toBe('complete'));
						expect(result?.current.preview?.source).toMatch(/^ssr-/);
						expect(getImageSpy).not.toHaveBeenCalled();

						// Resize to bigger dimensions
						rerender({ ...initialProps, dimensions: { width, height } });

						// Should refetch when dimensions are bigger
						await waitFor(() => expect(getImageSpy).toHaveBeenCalledTimes(1));
						await waitFor(() =>
							expect(result?.current.preview).toMatchObject({
								dataURI: expect.stringContaining('mock result of URL.createObjectURL()'),
								source: 'remote',
							}),
						);
					},
				);

				it('should refetch SSR preview when current preview has no dimensions but new dimensions are provided', async () => {
					const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
					const { MockedMediaClientProvider, mediaApi } = createMockedMediaClientProvider({
						initialItems: fileItem,
					});

					const getImageSpy = jest.spyOn(mediaApi, 'getImage');

					// Setup global scope preview without dimensions
					const globalScopePreview = {
						dataURI: 'global-scope-datauri',
						source: 'ssr-data',
						// No dimensions - to test the resize behavior
					};

					const { id, collectionName } = identifier;
					setGlobalSSRData(`${id}-${collectionName}-crop`, globalScopePreview);

					const initialProps: UseFilePreviewParams = {
						identifier,
						ssr: 'client',
						// No dimensions provided initially
					};

					const { result, rerender } = renderHook(useFilePreview, {
						wrapper: ({ children }) => (
							<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
						),
						initialProps,
					});

					await waitFor(() => expect(result?.current.status).toBe('complete'));
					expect(result?.current.preview?.source).toBe('ssr-data');
					expect(result?.current.preview?.dimensions).toBeUndefined();
					expect(getImageSpy).not.toHaveBeenCalled();

					// Add dimensions - should refetch because isWider(undefined, { width: 100, height: 100 }) returns true
					rerender({ ...initialProps, dimensions: { width: 100, height: 100 } });

					// Should refetch when current preview has no dimensions but new dimensions are provided
					await waitFor(() => expect(getImageSpy).toHaveBeenCalledTimes(1));
					await waitFor(() =>
						expect(result?.current.preview).toMatchObject({
							dataURI: expect.stringContaining('mock result of URL.createObjectURL()'),
							source: 'remote',
						}),
					);
				});

				it('should refetch SSR data preview when preview dimensions are undefined but new dimensions are provided', async () => {
					const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
					const { MockedMediaClientProvider, mediaApi } = createMockedMediaClientProvider({
						initialItems: fileItem,
					});

					const getImageSpy = jest.spyOn(mediaApi, 'getImage');

					// Setup global scope preview with no dimensions
					const globalScopePreview = {
						dataURI: 'global-scope-datauri',
						source: 'ssr-data',
						// dimensions is undefined
					};

					const { id, collectionName } = identifier;
					setGlobalSSRData(`${id}-${collectionName}-crop`, globalScopePreview);

					const initialProps: UseFilePreviewParams = {
						identifier,
						ssr: 'client',
					};

					const { result, rerender } = renderHook(useFilePreview, {
						wrapper: ({ children }) => (
							<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
						),
						initialProps,
					});

					await waitFor(() => expect(result?.current.status).toBe('complete'));
					expect(result?.current.preview).toMatchObject({
						dataURI: 'global-scope-datauri',
						source: 'ssr-data',
					});
					expect(result?.current.preview?.dimensions).toBeUndefined();
					expect(getImageSpy).not.toHaveBeenCalled();

					// Add dimensions - should refetch because isWider(undefined, { width: 100, height: 100 }) returns true
					rerender({ ...initialProps, dimensions: { width: 100, height: 100 } });

					// Should refetch when preview dimensions are undefined but new dimensions are provided
					await waitFor(() => expect(getImageSpy).toHaveBeenCalledTimes(1));
					await waitFor(() =>
						expect(result?.current.preview).toMatchObject({
							dataURI: expect.stringContaining('mock result of URL.createObjectURL()'),
							source: 'remote',
							dimensions: { width: 100, height: 100 },
						}),
					);
				});
			});

			ffTest.off('media-perf-uplift-mutation-fix', 'without feature flag', () => {
				it('should refetch SSR preview immediately on mount', async () => {
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

					const { id, collectionName } = identifier;
					setGlobalSSRData(`${id}-${collectionName}-crop`, globalScopePreview);

					const initialProps: UseFilePreviewParams = {
						identifier,
						ssr: 'client',
						dimensions: { width: 100, height: 100 },
					};

					const { result, rerender } = renderHook(useFilePreview, {
						wrapper: ({ children }) => (
							<MockedMediaClientProvider>{children}</MockedMediaClientProvider>
						),
						initialProps,
					});

					// Should initially use SSR preview
					await waitFor(() => expect(result?.current.status).toBe('complete'));
					expect(result?.current.preview).toMatchObject(globalScopePreview);

					// Without feature flag, SSR preview triggers immediate refetch on mount
					await waitFor(() => expect(getImageSpy).toHaveBeenCalledTimes(1));

					// Preview should be replaced with remote preview
					await waitFor(() =>
						expect(result?.current.preview).toMatchObject({
							dataURI: expect.stringContaining('mock result of URL.createObjectURL()'),
							source: 'remote',
						}),
					);

					// Clear for next check
					getImageSpy.mockClear();

					// Resize to smaller dimensions
					rerender({ ...initialProps, dimensions: { width: 50, height: 50 } });

					// Should NOT refetch because preview is now 'remote' (not SSR) with adequate dimensions
					expect(getImageSpy).not.toHaveBeenCalled();

					// Preview should remain the same
					expect(result?.current.preview?.source).toBe('remote');
				});
			});
		});

		describe('SSR preview error handling', () => {
			it('should reset preview and not remain in loading state when SSR data preview fails', async () => {
				const [fileItem, identifier] = generateSampleFileItem.workingImgWithRemotePreview();
				const { MockedMediaClientProvider, mediaApi } = createMockedMediaClientProvider({
					initialItems: fileItem,
				});

				jest.spyOn(mediaApi, 'getImage').mockRejectedValue(new Error('notfound'));

				const globalScopePreview: MediaFilePreview = {
					dataURI: 'global-scope-datauri',
					source: 'ssr-data',
					dimensions: { width: 100, height: 100 },
				};

				const { id, collectionName } = identifier;
				setGlobalSSRData(`${id}-${collectionName}-crop`, globalScopePreview);

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

				// Should initially have global scope preview and complete status
				expect(result?.current.status).toBe('complete');
				expect(result?.current.preview).toMatchObject(globalScopePreview);

				// Trigger error on the SSR data preview (simulating image load failure due to notfound)
				await act(async () => {
					result?.current.onImageError(globalScopePreview);
				});

				// After error, preview should be reset and should not be in loading state
				await waitFor(() => {
					expect(result?.current.preview).toBeUndefined();
				});

				await waitFor(() => {
					expect(result?.current.status).not.toBe('loading');
				});

				// Should be complete state, and no longer loading
				expect('error').toEqual(result?.current.status);
			});
		});
	});
});

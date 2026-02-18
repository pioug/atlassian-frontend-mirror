import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import {
	addFileAttrsToUrl,
	type FileIdentifier,
	isImageRepresentationReady,
	type MediaBlobUrlAttrs,
	type MediaStoreGetFileImageParams,
	toCommonMediaClientError,
} from '@atlaskit/media-client';
import { useCopyIntent, useFileState, useMediaClient } from '@atlaskit/media-client-react';
import {
	isMimeTypeSupportedByBrowser,
	type MediaTraceContext,
	type SSR,
} from '@atlaskit/media-common';
import { fg } from '@atlaskit/platform-feature-flags';
import { useInteractionContext } from '@atlaskit/react-ufo/interaction-context';

import { createFailedSSRObject, extractErrorInfo, type SSRStatus } from './analytics';
import { ensureMediaFilePreviewError, ImageLoadError, MediaFilePreviewError } from './errors';
import {
	getAndCacheLocalPreview,
	getAndCacheRemotePreview,
	getSSRPreview,
	isLocalPreview,
	isRemotePreview,
	isSSRClientPreview,
	isSSRDataPreview,
	isSSRPreview,
	isSupportedLocalPreview,
	mediaFilePreviewCache,
} from './getPreview';
import { generateScriptProps, getSSRData } from './globalScope';
import { createRequestDimensions, isBigger, isWider, useCurrentValueRef } from './helpers';
import {
	type MediaFilePreview,
	type MediaFilePreviewDimensions,
	type MediaFilePreviewStatus,
} from './types';

// invisible gif for SSR preview to show the underlying spinner until the src is replaced by
// the actual image src in the inline script
const DEFAULT_SSR_PREVIEW: MediaFilePreview = {
	dataURI: 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
	dimensions: { width: 100, height: 100 },
	source: 'ssr-server',
};

export interface UseFilePreviewParams {
	/** Instance of file identifier. */
	readonly identifier: FileIdentifier;
	/** Resize the media to 'crop' | 'fit' | 'full-fit' */
	readonly resizeMode?: MediaStoreGetFileImageParams['mode'];
	/** Dimensions to be requested to the server. Will be scaled x2 in Retina Displays */
	readonly dimensions?: MediaFilePreviewDimensions;
	/** Server-Side-Rendering modes are "server" and "client" */
	readonly ssr?: SSR;
	/** Whether to use the srcSet for the preview. */
	readonly useSrcSet?: boolean; // Defaults to false
	/** Attributes to attach to the created Blob Url */
	readonly mediaBlobUrlAttrs?: MediaBlobUrlAttrs; // FOR COPY & PASTE
	/** Trace context to be passed to the backend requests */
	readonly traceContext?: MediaTraceContext;
	/** Do not fetch a remote preview. Helpful for lazy loading */
	readonly skipRemote?: boolean;
	/** Define whether an animated image is acceptable to return */
	readonly allowAnimated?: boolean;
	/** Define the upscale strategy for this image. */
	readonly upscale?: boolean;
	/** Make the client receive the response with the given max-age cache control header. Minimum: 0, maximum: 9223372036854776000.
	 */
	readonly maxAge?: number;
	/** Defines the source component */
	readonly source?: string;
}

export const useFilePreview = ({
	resizeMode = 'crop',
	identifier,
	ssr,
	dimensions,
	useSrcSet = false,
	traceContext,
	skipRemote,
	mediaBlobUrlAttrs, // TODO: mediaBlobUrlAttrs can be missing several values contained in the file details. The preview hook is not updating the params in the preview after the file details are available.
	allowAnimated = true,
	upscale,
	maxAge,
	source,
}: UseFilePreviewParams) => {
	const mediaClient = useMediaClient();
	const [status, setStatus] = useState<MediaFilePreviewStatus>('loading');
	const [clientId, setClientId] = useState<string | undefined>();

	// Fetch clientId on mount for cross-client copy
	useEffect(() => {
		if (fg('platform_media_cross_client_copy_with_auth')) {
			mediaClient
				.getClientId(identifier.collectionName)
				.then(setClientId)
				.catch(() => {
					// ClientId is optional, silently fail
				});
		}
	}, [mediaClient, identifier.collectionName]);

	// Merge clientId into mediaBlobUrlAttrs for embedding in blob URLs
	// If mediaBlobUrlAttrs is not provided, construct minimal attrs from identifier
	const mediaBlobUrlAttrsWithClientId = useMemo(() => {
		if (!fg('platform_media_cross_client_copy_with_auth') || !clientId) {
			return mediaBlobUrlAttrs;
		}

		if (mediaBlobUrlAttrs) {
			return { ...mediaBlobUrlAttrs, clientId };
		}

		// Construct minimal attrs when none provided (e.g., MediaImage)
		return {
			id: identifier.id,
			clientId,
			contextId: identifier.collectionName || '',
			collection: identifier.collectionName,
		};
	}, [mediaBlobUrlAttrs, clientId, identifier.id, identifier.collectionName]);

	const [error, setError] = useState<MediaFilePreviewError | undefined>();
	const [nonCriticalError, setNonCriticalError] = useState<MediaFilePreviewError | undefined>();
	const [isBannedLocalPreview, setIsBannedLocalPreview] = useState(false);
	const [upfrontPreviewStatus, setUpfrontPreviewStatus] = useState<
		'not-resolved' | 'resolving' | 'resolved'
	>('not-resolved');
	const ssrReliabilityRef = useRef<SSRStatus>({
		server: { status: 'unknown' },
		client: { status: 'unknown' },
	});
	const ufoContext = useInteractionContext();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useLayoutEffect(() => {
		if (isLoading && fg('platform_close_image_blindspot_2')) {
			return ufoContext?.hold('img-loading');
		}
	}, [ufoContext, isLoading]);

	const requestDimensions = useMemo(
		() => (dimensions ? createRequestDimensions(dimensions) : undefined),
		[dimensions],
	);
	const requestDimensionsRef = useCurrentValueRef(requestDimensions);

	let imageURLParams: MediaStoreGetFileImageParams = {
		collection: identifier.collectionName,
		mode: resizeMode,
		...requestDimensions,
		allowAnimated,
		upscale,
		'max-age': maxAge,
	};

	imageURLParams = { ...imageURLParams, source };

	const previewInitializer = (): MediaFilePreview | undefined => {
		const preview = mediaFilePreviewCache.get(identifier.id, resizeMode);
		if (preview) {
			return preview;
		}

		if (ssr) {
			const ssrData = getSSRData(identifier, resizeMode);
			if (ssrData?.error) {
				ssrReliabilityRef.current = {
					...ssrReliabilityRef.current,
					server: {
						status: 'fail',
						...ssrData.error,
					},
				};
			}

			if (!ssrData?.dataURI) {
				// Only attempt SSR preview generation if:
				// 1. We're on the server (ssr='server'), OR
				// 2. We're on the client AND there is SSR data (meaning SSR actually happened)
				// If ssr='client' but there's no SSR data, it means this is a client-side navigation
				// where no SSR occurred, so we should skip SSR preview generation entirely.
				if (ssr === 'server' || ssrData) {
					try {
						return getSSRPreview(ssr, mediaClient, identifier.id, imageURLParams, mediaBlobUrlAttrsWithClientId);
					} catch (e: any) {
						ssrReliabilityRef.current = {
							...ssrReliabilityRef.current,
							[ssr]: {
								status: 'fail',
								...extractErrorInfo(e, traceContext),
							},
						};
					}
				}
			} else {
				const { dimensions, dataURI, srcSet, loading } = ssrData;
				return { dataURI, dimensions, source: 'ssr-data', srcSet, lazy: loading === 'lazy' };
			}
		}
	};

	const [preview, setPreview] = useState(previewInitializer);

	//----------------------------------------------------------------
	// FILE STATE
	//----------------------------------------------------------------

	const { fileState } = useFileState(identifier.id, {
		skipRemote,
		collectionName: identifier.collectionName,
		occurrenceKey: identifier.occurrenceKey,
	});

	// Derived from File State
	const isBackendPreviewReady = !!fileState && isImageRepresentationReady(fileState);
	const fileStateErrorMessage = fileState?.status === 'error' ? fileState.message : undefined;

	const {
		preview: localBinary = undefined,
		mediaType = undefined,
		mimeType = undefined,
	} = fileState && fileState?.status !== 'error' ? fileState : {};

	//----------------------------------------------------------------
	// Update status
	//----------------------------------------------------------------

	// TOOD: make a full hook reset (remount) on New identifier or client
	useEffect(() => {
		setStatus('loading');
	}, [identifier]);

	useEffect(() => {
		if (status !== 'error') {
			if (preview || (fileState?.status === 'processed' && !isBackendPreviewReady)) {
				setStatus('complete');
			} else if (!preview && fileState?.status === 'failed-processing' && !isBackendPreviewReady) {
				setStatus('error');
				setError(new MediaFilePreviewError('failed-processing'));
			} else if (!preview && fileState?.status === 'error' && upfrontPreviewStatus === 'resolved') {
				setStatus('error');
				setError(new MediaFilePreviewError('metadata-fetch', toCommonMediaClientError(fileState)));
			} else {
				setStatus('loading');
			}
		}
	}, [
		preview,
		status,
		fileState,
		isBackendPreviewReady,
		fileStateErrorMessage,
		upfrontPreviewStatus,
	]);

	//----------------------------------------------------------------
	// SSR Loading
	//----------------------------------------------------------------

	useEffect(() => {
		if (!fg('media-perf-uplift-mutation-fix')) {
			return;
		}

		const loadPromise = getSSRData(identifier, resizeMode)?.loadPromise;
		if (preview && isSSRDataPreview(preview) && loadPromise) {
			loadPromise
				.then(() => {
					setStatus('complete');
				})
				.catch(() => {
					setPreview(undefined);
				});
		}
	}, [preview, identifier, resizeMode]);

	//----------------------------------------------------------------
	// Update preview with clientId when it becomes available
	//----------------------------------------------------------------
	const previewUpdatedWithClientIdRef = useRef<string | null>(null);

	useEffect(() => {
		// Only update if we have a preview, clientId is available, URL doesn't already have clientId, and feature flag is enabled.
		// Also skip if we've already updated this preview (prevents re-render loops)
		if (
			preview &&
			clientId &&
			mediaBlobUrlAttrsWithClientId &&
			!preview.dataURI.includes('clientId=') &&
			previewUpdatedWithClientIdRef.current !== identifier.id &&
			fg('platform_media_cross_client_copy_with_auth')
		) {
			// Mark this preview as updated
			previewUpdatedWithClientIdRef.current = identifier.id;
			const baseUrl = preview.dataURI.split('#')[0]; // Remove any existing hash
			const updatedDataURI = addFileAttrsToUrl(baseUrl, mediaBlobUrlAttrsWithClientId);
			setPreview({ ...preview, dataURI: updatedDataURI });
		}
	}, [clientId, mediaBlobUrlAttrsWithClientId, preview, identifier.id]);

	//----------------------------------------------------------------
	// Preview Fetch Helper
	//----------------------------------------------------------------
	const getAndCacheRemotePreviewRef = useCurrentValueRef(() => {
		return getAndCacheRemotePreview(
			mediaClient,
			identifier.id,
			requestDimensions || {},
			imageURLParams,
			mediaBlobUrlAttrsWithClientId,
			traceContext,
		);
	});

	//----------------------------------------------------------------
	// Upfront Preview
	//----------------------------------------------------------------
	useEffect(() => {
		// Only fetch upfront (no file state) if there is no preview in the state already
		if (preview) {
			setUpfrontPreviewStatus('resolved');
		} else if (!preview && upfrontPreviewStatus === 'not-resolved' && !skipRemote) {
			// We block any possible future call to this method regardless of the outcome (success or fail)
			// If it fails, the normal preview fetch should occur after the file state is fetched anyways
			setUpfrontPreviewStatus('resolving');
			setIsLoading(true);
			const fetchedDimensions = { ...requestDimensions };
			getAndCacheRemotePreviewRef
				.current()
				.then((newPreview) => {
					// If there are new and bigger dimensions in the props, and the upfront preview is still resolving,
					// the fetched preview is no longer valid, and thus, we dismiss it
					if (!isBigger(fetchedDimensions, requestDimensionsRef.current)) {
						setPreview(newPreview);
					}
				})
				.catch(() => {
					// NO need to log error. If this call fails, a refetch will happen after
				})
				.finally(() => {
					setIsLoading(false);
					setUpfrontPreviewStatus('resolved');
				});
		}
	}, [
		getAndCacheRemotePreviewRef,
		preview,
		requestDimensions,
		requestDimensionsRef,
		skipRemote,
		upfrontPreviewStatus,
	]);

	//----------------------------------------------------------------
	// Cache, Local & Remote Preview
	//----------------------------------------------------------------

	const mediaBlobUrlAttrsRef = useCurrentValueRef(mediaBlobUrlAttrsWithClientId);
	useEffect(() => {
		const cachedPreview = mediaFilePreviewCache.get(identifier.id, resizeMode);

		// Cached Preview ----------------------------------------------------------------
		if (!preview && cachedPreview && !isBigger(cachedPreview?.dimensions, requestDimensions)) {
			setPreview(cachedPreview);
		}
		// Local Preview ----------------------------------------------------------------
		else if (
			!preview &&
			!isBannedLocalPreview &&
			localBinary &&
			isSupportedLocalPreview(mediaType) &&
			isMimeTypeSupportedByBrowser(mimeType || '')
		) {
			// Local preview is available only if it's supported by browser and supported by Media Card (isSupportedLocalPreview)
			// For example, SVGs are mime type NOT supported by browser but media type supported by Media Card (image)
			// Then, local Preview NOT available
			setIsLoading(true);
			getAndCacheLocalPreview(
				identifier.id,
				localBinary,
				requestDimensions || {},
				resizeMode,
				mediaBlobUrlAttrsRef.current,
			)
				.then(setPreview)
				.catch((e) => {
					setIsBannedLocalPreview(true);
					// CXP-2723 TODO: We might have to wrap this error in MediaCardError
					setNonCriticalError(e);
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
		// Remote Preview ----------------------------------------------------------------
		else if (
			!error &&
			!nonCriticalError &&
			(!preview ||
				isBigger(preview.dimensions, requestDimensions) ||
				// We always refetch SSR preview to be able to browser-cache a version without the token in the query parameters
				isSSRPreview(preview)) &&
			!skipRemote &&
			upfrontPreviewStatus === 'resolved' &&
			isBackendPreviewReady
		) {
			// If the preview is SSR, we can skip the refetch as it will be handled by the global scope promise
			// If the preview is not wider than the requested dimensions, we can skip the refetch
			if (
				preview &&
				isSSRPreview(preview) &&
				!isWider(preview.dimensions, dimensions) &&
				fg('media-perf-uplift-mutation-fix')
			) {
				return;
			}
			setIsLoading(true);
			getAndCacheRemotePreviewRef
				.current()
				.then(setPreview)
				.catch((e) => {
					const wrappedError = ensureMediaFilePreviewError('preview-fetch', e as Error);
					if (!preview) {
						setStatus('error');
						setError(wrappedError);
					} else {
						// If there is already a preview, we consider it a non-critical error
						setNonCriticalError(wrappedError);
					}
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	}, [
		error,
		nonCriticalError,
		getAndCacheRemotePreviewRef,
		identifier.id,
		resizeMode,
		isBannedLocalPreview,
		mediaBlobUrlAttrsRef,
		preview,
		requestDimensions,
		skipRemote,
		isBackendPreviewReady,
		localBinary,
		mediaType,
		mimeType,
		upfrontPreviewStatus,
		dimensions,
	]);

	//----------------------------------------------------------------
	// RETURN
	//----------------------------------------------------------------

	const onImageError = useCallback(
		(failedPreview?: MediaFilePreview): void => {
			if (!failedPreview) {
				return;
			}
			if (isSSRClientPreview(failedPreview)) {
				ssrReliabilityRef.current = {
					...ssrReliabilityRef.current,
					client: createFailedSSRObject(failedPreview, traceContext),
				};
			}

			const isSSR = isSSRDataPreview(failedPreview) || isSSRClientPreview(failedPreview);

			// If the preview failed and it comes from server (global scope / ssrData), it means that we have reused it in client and the error counts for both: server & client.
			if (isSSR) {
				ssrReliabilityRef.current = {
					server: createFailedSSRObject(failedPreview, traceContext),
					client: createFailedSSRObject(failedPreview, traceContext),
				};
			}

			// If the dataURI has been replaced, we can dismiss this error
			if (failedPreview.dataURI !== preview?.dataURI) {
				return;
			}
			const isLocal = isLocalPreview(failedPreview);
			const isRemote = isRemotePreview(failedPreview);
			if (isLocal || isRemote || isSSR) {
				const error = new ImageLoadError(failedPreview?.source);
				mediaFilePreviewCache.remove(identifier.id, resizeMode);

				if (isLocal) {
					setIsBannedLocalPreview(true);
				}
				if (isRemote) {
					setStatus('error');
					setError(error);
				}

				setPreview(undefined);
			}
		},
		[identifier.id, preview?.dataURI, resizeMode, traceContext],
	);

	const onImageLoad = useCallback(
		(newPreview?: MediaFilePreview): void => {
			if (newPreview) {
				if (
					isSSRClientPreview(newPreview) &&
					ssrReliabilityRef.current.client.status === 'unknown'
				) {
					ssrReliabilityRef.current = {
						...ssrReliabilityRef.current,
						client: { status: 'success' },
					};
				}

				/*
        If the image loads successfully and it comes from server (global scope / ssrData), it means that we have reused it in client and the success counts for both: server & client.
      */

				if (isSSRDataPreview(newPreview) && ssrReliabilityRef.current.server.status === 'unknown') {
					ssrReliabilityRef.current = {
						server: { status: 'success' },
						client: { status: 'success' },
					};
				}

				/*
				Handle 'ssr-server' source which is used when:
				1. ssr='server' is passed to getSSRPreview (server-side rendering)
				2. DEFAULT_SSR_PREVIEW is used (placeholder during SSR)
				This ensures ssrReliability is updated to 'success' when the server-rendered image loads.
			*/
				if (
					newPreview.source === 'ssr-server' &&
					ssrReliabilityRef.current.server.status === 'unknown'
				) {
					ssrReliabilityRef.current = {
						server: { status: 'success' },
						client: { status: 'success' },
					};
				}
			}

			// If the dataURI has been replaced, we can dismiss this callback
			if (newPreview?.dataURI !== preview?.dataURI) {
				return;
			}
		},
		[preview?.dataURI],
	);

	// FOR SSR
	const getSsrScriptProps =
		ssr === 'server'
			? () =>
					generateScriptProps(
						identifier,
						preview?.dataURI,
						resizeMode,
						preview?.srcSet,
						requestDimensions,
						ssrReliabilityRef.current.server?.status === 'fail'
							? ssrReliabilityRef.current.server
							: undefined,
						{
							'media-perf-uplift-mutation-fix': fg('media-perf-uplift-mutation-fix'),
							'media-perf-lazy-loading-optimisation': fg('media-perf-lazy-loading-optimisation'),
						},
					)
			: undefined;

	const { copyNodeRef } = useCopyIntent(identifier.id, {
		collectionName: identifier.collectionName,
	});

	// CXP-2723 TODO: should consider simplifying our analytics, and how
	// we might get rid of ssrReliabiltyRef from our hook
	return {
		preview:
			ssr === 'server' && useSrcSet && fg('media-perf-uplift-mutation-fix')
				? DEFAULT_SSR_PREVIEW
				: preview,
		status,
		error,
		nonCriticalError,
		ssrReliability: ssrReliabilityRef.current,
		onImageError,
		onImageLoad,
		getSsrScriptProps,
		copyNodeRef,
		clientId,
	};
};

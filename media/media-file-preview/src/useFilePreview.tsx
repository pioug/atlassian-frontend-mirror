import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
	type FileIdentifier,
	isImageRepresentationReady,
	type MediaBlobUrlAttrs,
	type MediaStoreGetFileImageParams,
} from '@atlaskit/media-client';
import { useFileState, useMediaClient } from '@atlaskit/media-client-react';
import {
	isMimeTypeSupportedByBrowser,
	type MediaTraceContext,
	type SSR,
} from '@atlaskit/media-common';
import { fg } from '@atlaskit/platform-feature-flags';

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
import { createRequestDimensions, isBigger, useCurrentValueRef } from './helpers';
import {
	type MediaFilePreview,
	type MediaFilePreviewDimensions,
	type MediaFilePreviewStatus,
} from './types';

export interface UseFilePreviewParams {
	/** Instance of file identifier. */
	readonly identifier: FileIdentifier;
	/** Resize the media to 'crop' | 'fit' | 'full-fit' */
	readonly resizeMode?: MediaStoreGetFileImageParams['mode'];
	/** Dimensions to be requested to the server. Will be scaled x2 in Retina Displays */
	readonly dimensions?: MediaFilePreviewDimensions;
	/** Server-Side-Rendering modes are "server" and "client" */
	readonly ssr?: SSR;
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

	if (fg('platform.media-card-performance-observer_lgc7b')) {
		imageURLParams = { ...imageURLParams, source, ssr };
	}

	const previewInitializer = (): MediaFilePreview | undefined => {
		const preview = mediaFilePreviewCache.get(identifier.id, resizeMode);
		if (preview) {
			return preview;
		}

		if (ssr) {
			const ssrData = getSSRData(identifier);
			if (ssrData?.error) {
				ssrReliabilityRef.current.server = {
					status: 'fail',
					...ssrData.error,
				};
			}

			if (!ssrData?.dataURI) {
				try {
					return getSSRPreview(ssr, mediaClient, identifier.id, imageURLParams, mediaBlobUrlAttrs);
				} catch (e: any) {
					ssrReliabilityRef.current[ssr] = {
						status: 'fail',
						...extractErrorInfo(e, traceContext),
					};
				}
			} else {
				const { dimensions, dataURI } = ssrData;
				return { dataURI, dimensions, source: 'ssr-data' };
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
	const fileStatus = fileState?.status;
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
			if (preview || (fileStatus === 'processed' && !isBackendPreviewReady)) {
				setStatus('complete');
			} else if (!preview && fileStatus === 'failed-processing' && !isBackendPreviewReady) {
				setStatus('error');
				setError(new MediaFilePreviewError('failed-processing'));
			} else if (!preview && fileStatus === 'error' && upfrontPreviewStatus === 'resolved') {
				setStatus('error');
				setError(new MediaFilePreviewError('metadata-fetch', new Error(fileStateErrorMessage)));
			} else {
				setStatus('loading');
			}
		}
	}, [
		preview,
		status,
		fileStatus,
		isBackendPreviewReady,
		fileStateErrorMessage,
		upfrontPreviewStatus,
	]);

	//----------------------------------------------------------------
	// Preview Fetch Helper
	//----------------------------------------------------------------
	const getAndCacheRemotePreviewRef = useCurrentValueRef(() => {
		return getAndCacheRemotePreview(
			mediaClient,
			identifier.id,
			requestDimensions || {},
			imageURLParams,
			mediaBlobUrlAttrs,
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

	const mediaBlobUrlAttrsRef = useCurrentValueRef(mediaBlobUrlAttrs);
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
	]);

	//----------------------------------------------------------------
	// RETURN
	//----------------------------------------------------------------

	const onImageError = useCallback(
		(failedPreview?: MediaFilePreview) => {
			if (!failedPreview) {
				return;
			}
			if (isSSRClientPreview(failedPreview)) {
				ssrReliabilityRef.current.client = createFailedSSRObject(failedPreview, traceContext);
			}

			// If the preview failed and it comes from server (global scope / ssrData), it means that we have reused it in client and the error counts for both: server & client.
			if (isSSRDataPreview(failedPreview)) {
				ssrReliabilityRef.current.server = createFailedSSRObject(failedPreview, traceContext);
				ssrReliabilityRef.current.client = createFailedSSRObject(failedPreview, traceContext);
			}

			// If the dataURI has been replaced, we can dismiss this error
			if (failedPreview.dataURI !== preview?.dataURI) {
				return;
			}
			const isLocal = isLocalPreview(failedPreview);
			const isRemote = isRemotePreview(failedPreview);
			if (isLocal || isRemote) {
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
		(newPreview?: MediaFilePreview) => {
			if (newPreview) {
				if (
					isSSRClientPreview(newPreview) &&
					ssrReliabilityRef.current.client.status === 'unknown'
				) {
					ssrReliabilityRef.current.client = { status: 'success' };
				}

				/*
        If the image loads successfully and it comes from server (global scope / ssrData), it means that we have reused it in client and the success counts for both: server & client.
      */

				if (isSSRDataPreview(newPreview) && ssrReliabilityRef.current.server.status === 'unknown') {
					ssrReliabilityRef.current.server = { status: 'success' };
					ssrReliabilityRef.current.client = { status: 'success' };
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
						requestDimensions,
						ssrReliabilityRef.current.server?.status === 'fail'
							? ssrReliabilityRef.current.server
							: undefined,
					)
			: undefined;

	// CXP-2723 TODO: should consider simplifying our analytics, and how
	// we might get rid of ssrReliabiltyRef from our hook
	return {
		preview,
		status,
		error,
		nonCriticalError,
		ssrReliability: ssrReliabilityRef.current,
		onImageError,
		onImageLoad,
		getSsrScriptProps,
	};
};

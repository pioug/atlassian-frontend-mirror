import { type ErrorInfo } from 'react';
import {
	type FileDetails,
	type FileStatus,
	type MediaClientErrorReason,
	type RequestErrorMetadata,
	type RequestMetadata,
	isCommonMediaClientError,
} from '@atlaskit/media-client';
import {
	ANALYTICS_MEDIA_CHANNEL,
	type FileAttributes,
	type PerformanceAttributes,
	type OperationalEventPayload,
	type UIEventPayload,
	type WithFileAttributes,
	type WithPerformanceAttributes,
	type SuccessAttributes,
	type FailureAttributes,
	type MediaTraceContext,
	type WithTraceContext,
	sanitiseAnalyticsPayload,
} from '@atlaskit/media-common/analytics';

import { type CreateUIAnalyticsEvent, createAndFireEvent } from '@atlaskit/analytics-next';
import { type MediaCardError, type MediaCardErrorPrimaryReason } from '../../errors';
import { type CardPreviewSource, type CardDimensions, type CardStatus } from '../../types';
import { type SSR } from '@atlaskit/media-common';

export type CardPreviewAttributes = {
	fileId: string;
	prevDimensions: CardDimensions | undefined;
	currentDimensions: CardDimensions | undefined;
	dimensionsPercentageDiff?: CardDimensions | undefined;
	source: CardPreviewSource;
};

type WithCardPreviewCacheAttributes = {
	cardPreviewAttributes: CardPreviewAttributes;
};

type WithCardPerfAttributes = {
	ssr?: SSR;
	fileId: string;
	mediaClientId?: string;
	transferSize: number;
	decodedBodySize: number;
	totalDuration: number;
	tcpHandshakeTime: number;
	dnsLookupTime: number;
	redirectTimeTaken: number;
	tlsConnectNegotiationTime: number;
	timeTakenToFetchWithoutRedirect: number;
	browserCacheHit: boolean;
	nextHopProtocol: string;
	interimRequestTime: number;
	requestInvocationTime?: number;
	contentDownloadTime: number;
	userAgent: string;
	cdnCacheHit: boolean;
	cdnDownstreamFBL?: number;
	cdnUpstreamFBL?: number;
};

export type FileUriFailReason = 'local-uri' | 'remote-uri' | `unknown-uri`;
export type FailedErrorFailReason = MediaCardErrorPrimaryReason | 'nativeError';

export type MediaCardErrorInfo = {
	failReason: FailedErrorFailReason;
	error: MediaClientErrorReason | 'nativeError';
	errorDetail: string;
	metadataTraceContext?: MediaTraceContext;
};

export type SSRStatusFail = MediaCardErrorInfo & {
	status: 'fail';
};

type SSRStatusSuccess = SuccessAttributes;

type SSRStatusUnknown = { status: 'unknown' };

type SSRStatusAttributes = SSRStatusSuccess | SSRStatusFail | SSRStatusUnknown;

export type SSRStatus = {
	server: SSRStatusAttributes;
	client: SSRStatusAttributes;
};

export type WithSSRReliability = {
	ssrReliability?: SSRStatus;
};

export type RenderFailedEventPayload = OperationalEventPayload<
	WithFileAttributes &
		WithPerformanceAttributes &
		WithSSRReliability &
		WithTraceContext &
		FailureAttributes & {
			failReason: FailedErrorFailReason | 'failed-processing';
			error?: MediaClientErrorReason | 'nativeError';
			statusCode?: number;
			request?: RequestMetadata;
		},
	'failed',
	'mediaCardRender'
>;

export type DownloadFailedEventPayload = OperationalEventPayload<
	WithFileAttributes &
		WithTraceContext &
		FailureAttributes & {
			failReason: FailedErrorFailReason;
			error?: MediaClientErrorReason | 'nativeError';
			statusCode?: number;
			request?: RequestMetadata;
		},
	'failed',
	'mediaCardDownload'
>;

export type ErrorEventPayload = OperationalEventPayload<
	WithFileAttributes &
		WithPerformanceAttributes &
		WithSSRReliability &
		WithTraceContext &
		FailureAttributes & {
			cardStatus: CardStatus;
			failReason: FailedErrorFailReason | 'failed-processing';
			error?: MediaClientErrorReason | 'nativeError';
			statusCode?: number;
			request?: RequestMetadata;
		},
	'nonCriticalFail',
	'mediaCardRender'
>;

export type ErrorBoundaryErrorInfo = {
	componentStack: string;
};

export type AnalyticsErrorBoundaryAttributes = {
	error?: Error | string;
	info?: ErrorInfo;
	browserInfo: string;
	failReason: string;
};

export type AnalyticsErrorBoundaryCardPayload = OperationalEventPayload<
	AnalyticsErrorBoundaryAttributes,
	'failed',
	'mediaCardRender'
>;

export type AnalyticsErrorBoundaryInlinePayload = OperationalEventPayload<
	AnalyticsErrorBoundaryAttributes,
	'failed',
	'mediaInlineRender'
>;

export type RenderInlineCardSucceededEventPayload = OperationalEventPayload<
	WithFileAttributes & WithPerformanceAttributes & SuccessAttributes,
	'succeeded',
	'mediaInlineRender'
>;

export type RenderInlineCardFailedEventPayload = OperationalEventPayload<
	WithFileAttributes &
		WithPerformanceAttributes &
		FailureAttributes & {
			failReason: FailedErrorFailReason | 'failed-processing';
			error?: MediaClientErrorReason | 'nativeError';
			request?: RequestMetadata;
		},
	'failed',
	'mediaInlineRender'
>;

export type DownloadSucceededEventPayload = OperationalEventPayload<
	WithFileAttributes & SuccessAttributes & WithTraceContext,
	'succeeded',
	'mediaCardDownload'
>;

export type RenderSucceededEventPayload = OperationalEventPayload<
	WithFileAttributes &
		WithPerformanceAttributes &
		WithSSRReliability &
		SuccessAttributes &
		WithTraceContext,
	'succeeded',
	'mediaCardRender'
>;

export type CacheHitEventPayload = OperationalEventPayload<
	WithCardPreviewCacheAttributes,
	'cache-hit',
	'mediaCardCache'
>;

export type RemoteSuccessEventPayload = OperationalEventPayload<
	WithCardPreviewCacheAttributes,
	'Remote-success',
	'mediaCardCache'
>;

export type MediaCardPerfObserverPayload = OperationalEventPayload<
	WithCardPerfAttributes,
	'succeeded',
	'mediaCardPerfObserver'
>;

export type CopiedFileEventPayload = UIEventPayload<{}, 'copied', string>;

export type ClickedEventPayload = UIEventPayload<{ label?: string }, 'clicked', string>;

export type AuthProviderSucceededAnalyticsPayload = OperationalEventPayload<
	{
		status: 'succeeded';
		durationMs: number;
		timeoutMs: number;
		collectionName?: string;
	},
	'succeeded',
	'mediaAuthProvider'
>;

export type AuthProviderFailedAnalyticsPayload = OperationalEventPayload<
	{
		status: 'failed';
		durationMs: number;
		timeoutMs: number;
		collectionName?: string;
		failReason: string;
		error?: string;
		errorDetail?: string;
	},
	'failed',
	'mediaAuthProvider'
>;

export type MediaCardAnalyticsEventPayload =
	| RenderSucceededEventPayload
	| RenderFailedEventPayload
	| CopiedFileEventPayload
	| ClickedEventPayload
	| CacheHitEventPayload
	| RemoteSuccessEventPayload
	| ErrorEventPayload
	| AnalyticsErrorBoundaryCardPayload
	| AnalyticsErrorBoundaryInlinePayload
	| RenderInlineCardFailedEventPayload
	| RenderInlineCardSucceededEventPayload
	| DownloadSucceededEventPayload
	| DownloadFailedEventPayload
	| AuthProviderSucceededAnalyticsPayload
	| AuthProviderFailedAnalyticsPayload;

export const getFileAttributes = (
	metadata: FileDetails,
	fileStatus?: FileStatus,
): FileAttributes => ({
	fileMediatype: metadata.mediaType,
	fileMimetype: metadata.mimeType,
	fileId: metadata.id,
	fileSize: metadata.size,
	fileStatus,
});

export const getRenderSucceededEventPayload = (
	fileAttributes: FileAttributes,
	performanceAttributes: PerformanceAttributes,
	ssrReliability: SSRStatus,
	traceContext: MediaTraceContext,
	metadataTraceContext?: MediaTraceContext,
	samplingRate?: number,
): RenderSucceededEventPayload => ({
	eventType: 'operational',
	action: 'succeeded',
	actionSubject: 'mediaCardRender',
	attributes: {
		fileMimetype: fileAttributes.fileMimetype,
		fileAttributes,
		performanceAttributes,
		status: 'success',
		ssrReliability,
		traceContext,
		metadataTraceContext,
		...(samplingRate !== undefined && { samplingRate }),
	},
});

export const getDownloadSucceededEventPayload = (
	fileAttributes: FileAttributes,
	traceContext: MediaTraceContext,
	metadataTraceContext?: MediaTraceContext,
): DownloadSucceededEventPayload => ({
	eventType: 'operational',
	action: 'succeeded',
	actionSubject: 'mediaCardDownload',
	attributes: {
		fileMimetype: fileAttributes.fileMimetype,
		fileAttributes,
		status: 'success',
		traceContext,
		metadataTraceContext,
	},
});

export const getCacheHitEventPayload = (
	cardPreviewAttributes: CardPreviewAttributes,
): CacheHitEventPayload => ({
	eventType: 'operational',
	action: 'cache-hit',
	actionSubject: 'mediaCardCache',
	attributes: {
		cardPreviewAttributes,
	},
});

export const getRemoteSuccessEventPayload = (
	cardPreviewAttributes: CardPreviewAttributes,
): RemoteSuccessEventPayload => ({
	eventType: 'operational',
	action: 'Remote-success',
	actionSubject: 'mediaCardCache',
	attributes: {
		cardPreviewAttributes,
	},
});

export const getRenderFailedExternalUriPayload = (
	fileAttributes: FileAttributes,
	performanceAttributes: PerformanceAttributes,
): RenderFailedEventPayload => ({
	eventType: 'operational',
	action: 'failed',
	actionSubject: 'mediaCardRender',
	attributes: {
		fileAttributes,
		performanceAttributes,
		status: 'fail',
		failReason: 'external-uri',
	},
});

export const getRenderErrorFailReason = (error: MediaCardError): FailedErrorFailReason => {
	return error.primaryReason || 'nativeError';
};

export const getRenderErrorErrorReason = (
	error: MediaCardError,
): MediaClientErrorReason | 'nativeError' => {
	const { secondaryError } = error;
	if (isCommonMediaClientError(secondaryError)) {
		return secondaryError.reason;
	}
	return 'nativeError';
};

export const getRenderErrorErrorDetail = (error: MediaCardError): string => {
	const { secondaryError } = error;
	if (isCommonMediaClientError(secondaryError) && secondaryError.innerError?.message) {
		return secondaryError.innerError?.message;
	}
	if (secondaryError instanceof Error) {
		return secondaryError.message;
	}
	return error.message;
};

export const getErrorTraceContext = (error: MediaCardError): MediaTraceContext | undefined => {
	const { secondaryError } = error;
	if (isCommonMediaClientError(secondaryError)) {
		return secondaryError.metadata?.traceContext;
	}
};

export const getRenderErrorRequestMetadata = (
	error: MediaCardError,
): RequestErrorMetadata | undefined => {
	const { secondaryError } = error;
	if (isCommonMediaClientError(secondaryError)) {
		return secondaryError.metadata;
	}
};

export const extractErrorInfo = (
	error: MediaCardError,
	metadataTraceContext?: MediaTraceContext,
): MediaCardErrorInfo => {
	return {
		failReason: getRenderErrorFailReason(error),
		error: getRenderErrorErrorReason(error),
		errorDetail: getRenderErrorErrorDetail(error),
		metadataTraceContext: metadataTraceContext ?? getErrorTraceContext(error),
	};
};

export const getRenderErrorEventPayload = (
	fileAttributes: FileAttributes,
	performanceAttributes: PerformanceAttributes,
	error: MediaCardError,
	ssrReliability: SSRStatus,
	traceContext: MediaTraceContext,
	metadataTraceContext?: MediaTraceContext,
): RenderFailedEventPayload => {
	const requestMetadata = getRenderErrorRequestMetadata(error);
	return {
		eventType: 'operational',
		action: 'failed',
		actionSubject: 'mediaCardRender',
		attributes: {
			fileMimetype: fileAttributes.fileMimetype,
			fileAttributes,
			performanceAttributes,
			status: 'fail',
			...extractErrorInfo(error, metadataTraceContext),
			statusCode: requestMetadata?.statusCode,
			request: requestMetadata,
			ssrReliability,
			traceContext,
		},
	};
};

export const getDownloadFailedEventPayload = (
	fileAttributes: FileAttributes,
	error: MediaCardError,
	traceContext: MediaTraceContext,
	metadataTraceContext?: MediaTraceContext,
): DownloadFailedEventPayload => {
	const requestMetadata = getRenderErrorRequestMetadata(error);
	return {
		eventType: 'operational',
		action: 'failed',
		actionSubject: 'mediaCardDownload',
		attributes: {
			fileMimetype: fileAttributes.fileMimetype,
			fileAttributes,
			status: 'fail',
			...extractErrorInfo(error, metadataTraceContext),
			statusCode: requestMetadata?.statusCode,
			request: requestMetadata,
			traceContext,
		},
	};
};

export const getErrorEventPayload = (
	cardStatus: CardStatus,
	fileAttributes: FileAttributes,
	error: MediaCardError,
	ssrReliability: SSRStatus,
	traceContext: MediaTraceContext,
	metadataTraceContext?: MediaTraceContext,
): ErrorEventPayload => {
	const requestMetadata = getRenderErrorRequestMetadata(error);
	return {
		eventType: 'operational',
		action: 'nonCriticalFail',
		actionSubject: 'mediaCardRender',
		attributes: {
			fileAttributes,
			status: 'fail',
			...extractErrorInfo(error, metadataTraceContext),
			statusCode: requestMetadata?.statusCode,
			request: requestMetadata,
			ssrReliability,
			traceContext,
			cardStatus,
		},
	};
};

export const getRenderFailedFileStatusPayload = (
	fileAttributes: FileAttributes,
	performanceAttributes: PerformanceAttributes,
	ssrReliability: SSRStatus,
	traceContext: MediaTraceContext,
	metadataTraceContext?: MediaTraceContext,
): RenderFailedEventPayload => ({
	eventType: 'operational',
	action: 'failed',
	actionSubject: 'mediaCardRender',
	attributes: {
		fileMimetype: fileAttributes.fileMimetype,
		fileAttributes,
		performanceAttributes,
		status: 'fail',
		failReason: 'failed-processing',
		ssrReliability,
		traceContext,
		metadataTraceContext,
	},
});

// Similar to extractErrorInfo but works with raw Error (not MediaCardError)
const extractAuthProviderErrorInfo = (error: Error) => {
	if (isCommonMediaClientError(error)) {
		return {
			failReason: error.reason,
			error: error.reason,
			errorDetail: error.innerError?.message ?? error.message,
		};
	}
	return {
		failReason: error.name || 'unknown',
		error: error.name || '',
		errorDetail: error.message,
	};
};

// Extract collection name from authContext - supports both new `access` array and deprecated `collectionName`
const getCollectionNameFromAuthContext = (authContext?: {
	access?: Array<{ type: string; name?: string }>;
	collectionName?: string;
}): string | undefined => {
	if (!authContext) {
		return undefined;
	}
	// Try new access array first
	const collectionAccess = authContext.access?.find((a) => a.type === 'collection');
	if (collectionAccess && 'name' in collectionAccess) {
		return collectionAccess.name;
	}
	// Fallback to deprecated collectionName
	return authContext.collectionName;
};

export const getAuthProviderSucceededPayload = (
	durationMs: number,
	timeoutMs: number,
	authContext?: { access?: Array<{ type: string; name?: string }>; collectionName?: string },
): AuthProviderSucceededAnalyticsPayload => ({
	eventType: 'operational',
	action: 'succeeded',
	actionSubject: 'mediaAuthProvider',
	attributes: {
		status: 'succeeded',
		durationMs,
		timeoutMs,
		collectionName: getCollectionNameFromAuthContext(authContext),
	},
});

export const getAuthProviderFailedPayload = (
	durationMs: number,
	timeoutMs: number,
	error: Error,
	authContext?: { access?: Array<{ type: string; name?: string }>; collectionName?: string },
): AuthProviderFailedAnalyticsPayload => {
	const errorInfo = extractAuthProviderErrorInfo(error);
	return {
		eventType: 'operational',
		action: 'failed',
		actionSubject: 'mediaAuthProvider',
		attributes: {
			status: 'failed',
			durationMs,
			timeoutMs,
			collectionName: getCollectionNameFromAuthContext(authContext),
			...errorInfo,
		},
	};
};

export function fireMediaCardEvent(
	payload: MediaCardAnalyticsEventPayload,
	createAnalyticsEvent?: CreateUIAnalyticsEvent,
): void {
	if (createAnalyticsEvent) {
		const event = createAnalyticsEvent(sanitiseAnalyticsPayload(payload));
		event.fire(ANALYTICS_MEDIA_CHANNEL);
	}
}

export const createAndFireMediaCardEvent = (payload: MediaCardAnalyticsEventPayload) => {
	return createAndFireEvent(ANALYTICS_MEDIA_CHANNEL)(sanitiseAnalyticsPayload(payload));
};

import { type ErrorInfo } from 'react';

import { type MediaClientErrorReason, type RequestMetadata } from '@atlaskit/media-client';
import { type SSR } from '@atlaskit/media-common';
import {
	type OperationalEventPayload,
	type UIEventPayload,
	type WithFileAttributes,
	type WithPerformanceAttributes,
	type SuccessAttributes,
	type FailureAttributes,
	type MediaTraceContext,
	type WithTraceContext,
} from '@atlaskit/media-common/analytics';
import type { ProcessingFailReason } from '@atlaskit/media-state/file-state';

import type { MediaCardErrorPrimaryReason } from '../../MediaCardError';
import { type CardPreviewSource, type CardDimensions, type CardStatus } from '../../types';

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
			processingFailReason?: ProcessingFailReason | 'not-available';
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
			processingFailReason?: ProcessingFailReason | 'not-available';
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

// Extract collection name from authContext - supports both new `access` array and deprecated `collectionName`
export const getCollectionNameFromAuthContext = (authContext?: {
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

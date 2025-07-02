import {
	type OperationalEventPayload,
	type OperationalAttributes,
	type WithTraceContext,
	type MediaTraceContext,
} from '@atlaskit/media-common';
import type { CustomMediaPlayerType, WithCustomMediaPlayerType } from '../../../types';
import {
	type MediaClientErrorReason,
	isCommonMediaClientError,
	type RequestMetadata,
} from '@atlaskit/media-client';

export type CaptionAttributes = {
	selectedTrackIndex: number;
	availableCaptionTracks: number;
	selectedTrackLanguage: string | null;
	artifactName?: string;
};

export type WithErrorAttributes = {
	failReason: 'upload-fail' | 'delete-fail' | 'fetch-fail' | 'render-fail' | 'unknown';
	error: string;
	errorDetail: string;
	request?: RequestMetadata;
};

export type WithCaptionAttributes = {
	captionAttributes: CaptionAttributes;
};

export function generateBaseAttributes(
	type: CustomMediaPlayerType,
	captionAttributes: CaptionAttributes,
	fileId?: string,
	traceContext?: MediaTraceContext,
) {
	return {
		type,
		captionAttributes,
		...(fileId && {
			fileAttributes: {
				fileId,
			},
		}),
		traceContext,
	};
}

export type CaptionFailedEventAction = 'uploadFailed' | 'deleteFailed' | 'displayFailed';

export type CaptionFailedEventPayload = OperationalEventPayload<
	OperationalAttributes &
		WithCaptionAttributes &
		WithCustomMediaPlayerType &
		WithTraceContext &
		WithErrorAttributes,
	CaptionFailedEventAction,
	'mediaPlayerCaption'
>;

export type CaptionSucceededEventAction =
	| 'uploadSucceeded'
	| 'deleteSucceeded'
	| 'displaySucceeded';

export type CaptionSucceededEventPayload = OperationalEventPayload<
	OperationalAttributes & WithCaptionAttributes & WithCustomMediaPlayerType & WithTraceContext,
	CaptionSucceededEventAction,
	'mediaPlayerCaption'
>;

const getErrorReason = (error: Error): MediaClientErrorReason | 'nativeError' => {
	if (isCommonMediaClientError(error)) {
		return error.reason;
	}
	return 'nativeError';
};

const getErrorDetail = (error: Error): string => {
	if (isCommonMediaClientError(error) && error.innerError?.message) {
		return error.innerError?.message;
	}
	return error.message || 'unknown';
};

const getErrorRequestMetaData = (error: Error): RequestMetadata | undefined => {
	if (isCommonMediaClientError(error)) {
		return error.metadata;
	}
};

function createCaptionFailedEventPayload(
	type: CustomMediaPlayerType,
	action: CaptionFailedEventAction,
	failReason: WithErrorAttributes['failReason'],
	captionAttributes: CaptionAttributes,
	fileId: string,
	error: Error,
	traceContext?: MediaTraceContext,
): CaptionFailedEventPayload {
	return {
		eventType: 'operational',
		action,
		actionSubject: 'mediaPlayerCaption',
		actionSubjectId: fileId,
		attributes: {
			...generateBaseAttributes(type, captionAttributes, fileId, traceContext),
			failReason,
			error: getErrorReason(error),
			errorDetail: getErrorDetail(error),
			request: getErrorRequestMetaData(error),
		},
	};
}

export const createCaptionUploadFailedEventPayload = (
	type: CustomMediaPlayerType,
	captionAttributes: CaptionAttributes,
	fileId: string,
	error: Error,
	traceContext: MediaTraceContext,
): CaptionFailedEventPayload =>
	createCaptionFailedEventPayload(
		type,
		'uploadFailed',
		'upload-fail',
		captionAttributes,
		fileId,
		error,
		traceContext,
	);

export const createCaptionDeleteFailedEventPayload = (
	type: CustomMediaPlayerType,
	captionAttributes: CaptionAttributes,
	fileId: string,
	error: Error,
	traceContext: MediaTraceContext,
): CaptionFailedEventPayload =>
	createCaptionFailedEventPayload(
		type,
		'deleteFailed',
		'delete-fail',
		captionAttributes,
		fileId,
		error,
		traceContext,
	);

export const createCaptionDisplayFailedEventPayload = (
	type: CustomMediaPlayerType,
	failReason: WithErrorAttributes['failReason'],
	captionAttributes: CaptionAttributes,
	fileId: string,
	error: Error,
	traceContext?: MediaTraceContext,
): CaptionFailedEventPayload =>
	createCaptionFailedEventPayload(
		type,
		'displayFailed',
		failReason,
		captionAttributes,
		fileId,
		error,
		traceContext,
	);

function createCaptionSucceededEventPayload(
	type: CustomMediaPlayerType,
	action: CaptionSucceededEventAction,
	captionAttributes: CaptionAttributes,
	fileId: string,
	traceContext?: MediaTraceContext,
): CaptionSucceededEventPayload {
	return {
		eventType: 'operational',
		action,
		actionSubject: 'mediaPlayerCaption',
		actionSubjectId: captionAttributes.artifactName,
		attributes: generateBaseAttributes(type, captionAttributes, fileId, traceContext),
	};
}

export const createCaptionUploadSucceededEventPayload = (
	type: CustomMediaPlayerType,
	captionAttributes: CaptionAttributes,
	fileId: string,
	traceContext: MediaTraceContext,
): CaptionSucceededEventPayload =>
	createCaptionSucceededEventPayload(
		type,
		'uploadSucceeded',
		captionAttributes,
		fileId,
		traceContext,
	);

export const createCaptionDeleteSucceededEventPayload = (
	type: CustomMediaPlayerType,
	captionAttributes: CaptionAttributes,
	fileId: string,
	traceContext: MediaTraceContext,
): CaptionSucceededEventPayload =>
	createCaptionSucceededEventPayload(
		type,
		'deleteSucceeded',
		captionAttributes,
		fileId,
		traceContext,
	);

export const createCaptionDisplaySucceededEventPayload = (
	type: CustomMediaPlayerType,
	captionAttributes: CaptionAttributes,
	fileId: string,
	traceContext?: MediaTraceContext,
): CaptionSucceededEventPayload =>
	createCaptionSucceededEventPayload(
		type,
		'displaySucceeded',
		captionAttributes,
		fileId,
		traceContext,
	);

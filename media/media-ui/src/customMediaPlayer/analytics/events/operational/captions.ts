import type { RequestMetadata } from '@atlaskit/media-client/request/types';
import type {
	OperationalEventPayload,
	OperationalAttributes,
	WithTraceContext,
} from '@atlaskit/media-common/analytics/types';

import type { WithCustomMediaPlayerType } from '../../../types';

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

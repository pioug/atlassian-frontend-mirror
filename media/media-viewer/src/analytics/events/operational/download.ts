import type {
	SuccessAttributes,
	WithFileAttributes,
	WithTraceContext,
} from '@atlaskit/media-common/analytics/types';

import { type MediaViewerFailureAttributes } from '../..';
import { type MediaFileEventPayload } from './_mediaFile';

export type DownloadFailedEventPayload = MediaFileEventPayload<
	MediaViewerFailureAttributes,
	'downloadFailed'
>;

export type DownloadSucceededEventPayload = MediaFileEventPayload<
	SuccessAttributes & WithFileAttributes & WithTraceContext,
	'downloadSucceeded'
>;

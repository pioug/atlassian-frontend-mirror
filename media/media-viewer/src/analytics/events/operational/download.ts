import {
	type SuccessAttributes,
	type WithFileAttributes,
	type WithTraceContext,
} from '@atlaskit/media-common';

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

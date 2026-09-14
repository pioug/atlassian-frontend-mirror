import { type MediaClientErrorReason } from '@atlaskit/media-client';

import type { ArchiveViewerErrorReason } from './ArchiveViewerError';
import type { MediaViewerErrorReason } from './MediaViewerError';

export type PrimaryErrorReason = MediaViewerErrorReason | ArchiveViewerErrorReason;

export type SecondaryErrorReason =
	| MediaClientErrorReason
	| 'unknown' // this is because when we use getMediaClientErrorReason() we could get back "unknown"
	| 'nativeError' // a javascript error
	| undefined;

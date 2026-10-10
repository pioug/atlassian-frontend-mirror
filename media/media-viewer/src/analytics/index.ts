import type { RequestMetadata } from '@atlaskit/media-client/request/types';
import type {
	WithFileAttributes,
	FailureAttributes,
	WithTraceContext,
} from '@atlaskit/media-common/analytics/types';
import type { ProcessingFailReason } from '@atlaskit/media-state/file-state';

import { type PrimaryErrorReason } from '../errors';

/** This type takes FailureAttributes and redefines `failReason` to be the strong media-viewer type */
export type MediaViewerFailureAttributes = Omit<FailureAttributes, 'failReason'> & {
	failReason: PrimaryErrorReason;
	statusCode?: number;
	request?: RequestMetadata;
	processingFailReason?: ProcessingFailReason | 'not-available';
} & WithFileAttributes &
	WithTraceContext;

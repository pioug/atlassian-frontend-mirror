import type { RequestMetadata } from '@atlaskit/media-client/request/types';
import type { WithFileAttributes } from '@atlaskit/media-common/analytics/types';

export type UFOFailedEventPayload = {
	failReason: string;
	error?: string;
	errorDetail?: string | undefined;
	uploadDurationMsec: number;
	statusCode?: number;
	request?: RequestMetadata;
} & WithFileAttributes;

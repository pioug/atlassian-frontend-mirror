import type { RequestMetadata } from '@atlaskit/media-client';
import type { WithFileAttributes } from '@atlaskit/media-common';

export type UFOFailedEventPayload = {
	failReason: string;
	error?: string;
	errorDetail?: string | undefined;
	uploadDurationMsec: number;
	statusCode?: number;
	request?: RequestMetadata;
} & WithFileAttributes;

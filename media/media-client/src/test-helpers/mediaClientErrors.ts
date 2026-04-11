import { RequestError, type RequestErrorMetadata } from '../utils/request';
import { PollingError } from '../utils/polling';
import { MediaStoreError } from '../client/media-store';
import type { RequestMetadata } from '../utils/request/types';

type MediaHeaders = {
	mediaRegion?: string;
	mediaEnv?: string;
};

const defaultMetadata: RequestErrorMetadata & MediaHeaders = {
	attempts: 5,
	clientExhaustedRetries: true,
	mediaRegion: 'test-media-region',
	mediaEnv: 'test-media-env',
	traceContext: { traceId: 'some-trace', spanId: 'some-span' },
};

export const createServerUnauthorizedError = (
	metadataAndHeaders: RequestMetadata & {
		readonly attempts?: number;
		readonly clientExhaustedRetries?: boolean;
		readonly statusCode?: number;
	} & MediaHeaders = defaultMetadata,
	innerError?: Error,
): RequestError =>
	new RequestError(
		'serverUnauthorized',
		{
			...metadataAndHeaders,
			statusCode: 403,
		},
		innerError || new Error('inner error message'),
	);

export const createRateLimitedError = (
	metadataAndHeaders: RequestMetadata & {
		readonly attempts?: number;
		readonly clientExhaustedRetries?: boolean;
		readonly statusCode?: number;
	} & MediaHeaders = defaultMetadata,
): RequestError =>
	new RequestError('serverRateLimited', {
		...metadataAndHeaders,
		statusCode: 429,
	});

export const createPollingMaxAttemptsError = (attempts = 1): PollingError =>
	new PollingError('pollingMaxAttemptsExceeded', { attempts });

export const createMediaStoreError = (): MediaStoreError =>
	new MediaStoreError('missingInitialAuth');

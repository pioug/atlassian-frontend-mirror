import { RequestError } from '../utils/request';
import type { RequestMetadata } from '../utils/request/types';
import { defaultMetadata } from './defaultMetadata';
import type { MediaHeaders } from './MediaHeaders';

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

import { RequestError } from '../utils/request';
import type { RequestMetadata } from '../utils/request/types';
import { defaultMetadata } from './defaultMetadata';
import type { MediaHeaders } from './MediaHeaders';

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

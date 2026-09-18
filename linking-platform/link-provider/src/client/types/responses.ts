/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */

import type { JsonLd } from '@atlaskit/json-ld-types/jsonld';
import type { ServerErrorType } from '@atlaskit/linking-common/api/errors';

export type BatchResponse = Array<SuccessResponse | ErrorResponse>;

export type SuccessResponse = {
	body: JsonLd.Response;
	status: number;
};

export interface ErrorResponse {
	error: ErrorResponseBody;
	status: number;
}

export interface ErrorResponseBody {
	extensionKey?: string;
	message: string;
	status: number;
	type: ServerErrorType;
}

export interface SearchProviderInfo {
	key: string;
	metadata: {
		[key: string]: unknown;
		avatarUrl: string;
		displayName?: string;
		name: string;
	};
}

export interface SearchProviderInfoResponse {
	providers: SearchProviderInfo[];
}

/**
 * @deprecated Use `import { isSuccessfulResponse } from '@atlaskit/link-provider/is-successful-response'` instead.
 */
export { isSuccessfulResponse } from './isSuccessfulResponse';
/**
 * @deprecated Use `import { isErrorResponse } from '@atlaskit/link-provider/is-error-response'` instead.
 */
export { isErrorResponse } from './isErrorResponse';

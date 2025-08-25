import { type JsonLd } from '@atlaskit/json-ld-types';
import { type ServerErrorType } from '@atlaskit/linking-common';
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

export const isSuccessfulResponse = (
	response?: SuccessResponse | ErrorResponse,
): response is SuccessResponse => {
	if (!response) {
		return false;
	}

	const hasSuccessfulStatus = response.status === 200;
	const hasSuccessBody = 'body' in response;
	return hasSuccessfulStatus && hasSuccessBody;
};

export const isErrorResponse = (
	response: SuccessResponse | ErrorResponse | JsonLd.Collection,
): response is ErrorResponse => {
	if (!response) {
		return false;
	}

	const hasStatus = 'status' in response && response.status >= 200;
	const hasErrorBody = 'error' in response;
	return hasStatus && hasErrorBody;
};

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

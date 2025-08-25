import { type JsonLd } from '@atlaskit/json-ld-types';
import { type ServerErrorType } from '@atlaskit/linking-common';

// Copied from packages/linking-platform/link-provider/src/client/api.ts
const ALLOWED_RESPONSE_STATUS_CODES = [200, 401, 404];

export class NetworkError extends Error {
	constructor(error: any) {
		super(error);
	}
}

export async function request<T = BatchResponse>(
	method: string,
	url: string,
	data?: any,
	headers?: HeadersInit,
): Promise<T> {
	const requestConfig: RequestInit = {
		method,
		credentials: 'include' as RequestCredentials,
		headers: {
			Accept: 'application/json',
			'Cache-Control': 'no-cache',
			'Content-Type': 'application/json',
			...headers,
		},
		...(data ? { body: JSON.stringify(data) } : {}),
	};
	try {
		const response = await fetch(url, requestConfig);
		if (response.ok || ALLOWED_RESPONSE_STATUS_CODES.includes(response.status)) {
			return await response.json();
		}

		throw response;
	} catch (error) {
		if (typeof error === 'string' || error instanceof TypeError) {
			throw new NetworkError(error);
		}
		throw error;
	}
}

// Copied from packages/linking-platform/link-provider/src/client/types/responses.ts
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
	message: string;
	status: number;
	type: ServerErrorType;
}

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

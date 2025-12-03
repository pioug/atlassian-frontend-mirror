import { GraphQLError, HttpError } from '../../../common/utils/error';
import {
	EXPONENTIAL_BACKOFF_RETRY_POLICY,
	is5xx,
	isFetchResponse,
	withExponentialBackoff,
} from '../../../common/utils/http';
import { handleResponse } from '../../../common/utils/status-code-handlers-provider';
import {
	type Body,
	type GraphQLRequestDataResponse,
	type InnerResponse,
	type Options,
	type ResultResponse,
} from '../types';

export async function makeGraphQLRequestWithoutRetries<Data, Variables>(
	serviceUrl: string,
	body: Body<Variables>,
	options: Options = {},
): Promise<GraphQLRequestDataResponse<Data>> {
	const operationNameQuery = options.operationName ? `?q=${options.operationName}` : '';

	const errorPolicy = options.errorPolicy || 'none';

	const url = serviceUrl + operationNameQuery;

	const request = fetch(url, {
		method: 'POST',
		headers: new Headers({
			'Content-Type': 'application/json',
			...(options.headers || {}),
		}),
		credentials: 'include',
		body: JSON.stringify(body),
	}).then((res) => {
		if (res.status < 300 || res.status === 400) {
			return res.json();
		} else {
			throw res;
		}
	});

	try {
		const response: InnerResponse<Data> = await request;

		const errors = response.errors;
		if (errors) {
			if (errorPolicy === 'none') {
				throw GraphQLError.from(errors);
			} else if (errorPolicy === 'all') {
				// Set timeout will postpone error throwing and de-touch it to another event loop,
				// so we can return data along with throwing error
				return new Promise((_resolve, reject) => {
					setTimeout(() => {
						reject(GraphQLError.from(errors));
					}, 0);
				});
			}
		}

		return response.data;
	} catch (error) {
		if (error instanceof Response) {
			return { response: error };
		}

		if (Object(error).hasOwnProperty('response')) {
			throw error;
		}

		return error as { response: Response };
	}
}

export async function handleGraphQLRequest<Key extends string, Data = unknown, Variables = unknown>(
	serviceUrl: string,
	body: Body<Variables>,
	options: Options = {},
): Promise<ResultResponse<Key, Data>> {
	const makeGraphQLRequestWithRetries = withExponentialBackoff<
		GraphQLRequestDataResponse<ResultResponse<Key, Data>>
	>(makeGraphQLRequestWithoutRetries, {
		initial: EXPONENTIAL_BACKOFF_RETRY_POLICY.INITIAL_DELAY,
		jitter: EXPONENTIAL_BACKOFF_RETRY_POLICY.JITTER,
		max: EXPONENTIAL_BACKOFF_RETRY_POLICY.MAX_RETRIES,
		retryIf: (data: GraphQLRequestDataResponse<ResultResponse<Key, Data>>) => {
			return isFetchResponse(data) && is5xx(data.response.status);
		},
	});

	const result = await makeGraphQLRequestWithRetries(serviceUrl, body, options);

	const response = (result as { response?: Response })?.response;

	if (response) {
		const status = response.status;
		const statusText = response.statusText;
		const traceId = response.headers.get('atl-traceid');

		handleResponse(response);

		if (status > 400 && status <= 599) {
			throw new HttpError({
				message: statusText,
				status,
				traceId: traceId ?? undefined,
			});
		}
	}

	return result as ResultResponse<Key, Data>;
}

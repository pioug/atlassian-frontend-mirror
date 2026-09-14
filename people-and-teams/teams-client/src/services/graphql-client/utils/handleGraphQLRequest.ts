import { HttpError } from '../../../common/utils/error/HttpError';
import { EXPONENTIAL_BACKOFF_RETRY_POLICY } from '../../../common/utils/http';
import { isFetchResponse } from '../../../common/utils/is-fetch-response';
import { is5xx } from '../../../common/utils/is5xx';
import { handleResponse } from '../../../common/utils/status-code-handlers-provider';
import { withExponentialBackoff } from '../../../common/utils/with-exponential-backoff';
import {
	type Body,
	type GraphQLRequestDataResponse,
	type Options,
	type ResultResponse,
} from '../types';

import { makeGraphQLRequestWithoutRetries } from './makeGraphQLRequestWithoutRetries';

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

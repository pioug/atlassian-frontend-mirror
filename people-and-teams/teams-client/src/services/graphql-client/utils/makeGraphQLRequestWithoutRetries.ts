import { GraphQLError } from '../../../common/utils/error/GraphQLError';
import {
	type Body,
	type GraphQLRequestDataResponse,
	type InnerResponse,
	type Options,
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

import {
	EXPONENTIAL_BACKOFF_RETRY_POLICY,
	withExponentialBackoff,
} from '../../../common/utils/http';
import { handleResponse } from '../../../common/utils/status-code-handlers-provider';

import { handleGraphQLRequest, makeGraphQLRequestWithoutRetries } from './index';

jest.mock('../../../common/utils/http');
jest.mock('../../../common/utils/status-code-handlers-provider');

describe('makeGraphQLRequestWithoutRetries and handleGraphQLRequest', () => {
	const serviceUrl = 'https://example.com/graphql';
	const body = { query: '{ test }' };
	const options = { operationName: 'TestOperation' };

	beforeEach(() => {
		jest.resetAllMocks();
		global.fetch = jest.fn();
	});

	it('should make a successful GraphQL request without retries', async () => {
		const responseData = { data: { test: 'success' } };
		(global.fetch as jest.Mock).mockResolvedValueOnce({
			status: 200,
			json: () => Promise.resolve(responseData),
		});

		const result = await makeGraphQLRequestWithoutRetries(serviceUrl, body, options);

		expect(global.fetch).toHaveBeenCalledWith(serviceUrl + '?q=TestOperation', {
			method: 'POST',
			headers: expect.any(Headers),
			credentials: 'include',
			body: JSON.stringify(body),
		});
		expect(result).toEqual(responseData.data);
	});

	it('should handle a GraphQL request with retries', async () => {
		const responseData = { data: { test: 'success' } };
		(withExponentialBackoff as jest.Mock).mockImplementationOnce((fn, config) => {
			return () => fn(serviceUrl, body, options);
		});
		(global.fetch as jest.Mock).mockResolvedValueOnce({
			status: 200,
			json: () => Promise.resolve(responseData),
		});

		const result = await handleGraphQLRequest(serviceUrl, body, options);

		expect(withExponentialBackoff).toHaveBeenCalledWith(expect.any(Function), {
			initial: EXPONENTIAL_BACKOFF_RETRY_POLICY.INITIAL_DELAY,
			jitter: EXPONENTIAL_BACKOFF_RETRY_POLICY.JITTER,
			max: EXPONENTIAL_BACKOFF_RETRY_POLICY.MAX_RETRIES,
			retryIf: expect.any(Function),
		});
		expect(result).toEqual(responseData.data);
	});

	it('should handle an unsuccessful GraphQL request with retries', async () => {
		const response = {
			status: 500,
			statusText: 'Internal Server Error',
			headers: { get: () => 'trace-id-123' },
		};
		const backoffResult = { response };
		(withExponentialBackoff as jest.Mock).mockReturnValueOnce(() => Promise.resolve(backoffResult));
		(handleResponse as jest.Mock).mockImplementation(() => {});

		try {
			await handleGraphQLRequest(serviceUrl, body, options);
		} catch (error) {
			expect(handleResponse).toHaveBeenCalledWith(response);
			expect((error as any).message).toEqual('Internal Server Error');
			expect((error as any).status).toEqual(500);
			expect((error as any).traceId).toEqual('trace-id-123');
		}
	});
});

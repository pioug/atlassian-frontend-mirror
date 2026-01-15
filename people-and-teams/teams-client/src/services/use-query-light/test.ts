import { act, renderHook, waitFor } from '@testing-library/react';
import { parse } from 'graphql';

import { fetchWithExponentialBackoff } from '../../common/utils/http';

import { useQueryLight } from './main';
import { UseQueryLightError } from './types';

const fakeGraphql = `
	query {
		test
	}
`;
const fakeServiceUrl = 'http://some-site.comn/graphql';
const fakeOperationName = 'test';

jest.mock('../../common/utils/http', () => ({
	...jest.requireActual('../../common/utils/http'),
	fetchWithExponentialBackoff: jest.fn(),
}));

describe('useQueryLight', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should fetch', () => {
		renderHook(() =>
			useQueryLight(parse(fakeGraphql), {
				serviceUrl: fakeServiceUrl,
				operationName: fakeOperationName,
			}),
		);

		expect(fetchWithExponentialBackoff).toHaveBeenCalledWith(
			`${fakeServiceUrl}?q=${fakeOperationName}`,
			expect.any(Object),
		);
	});

	it('should not fetch when skip is true', () => {
		renderHook(() =>
			useQueryLight(parse(fakeGraphql), {
				serviceUrl: 'http://localhost:8080/graphql',
				operationName: 'test',
				skip: true,
			}),
		);

		expect(fetchWithExponentialBackoff).not.toHaveBeenCalled();
	});

	it('should return correct set of result when fetch is successful', async () => {
		const body = { data: 'test' };
		const response: Response = new Response(JSON.stringify(body));
		(fetchWithExponentialBackoff as jest.Mock).mockResolvedValue(response);
		const { result } = renderHook(() =>
			useQueryLight(parse(fakeGraphql), {
				serviceUrl: fakeServiceUrl,
				operationName: fakeOperationName,
			}),
		);

		await waitFor(() => {
			expect(result.current.data).toEqual(body.data);
			expect(result.current.loading).toBe(false);
			expect(result.current.error).toBeUndefined();
		});
	});

	it('should handle error when fetch fails', async () => {
		const error = new Error('test error');
		(fetchWithExponentialBackoff as jest.Mock).mockRejectedValue(error);
		const { result } = renderHook(() =>
			useQueryLight(parse(fakeGraphql), {
				serviceUrl: fakeServiceUrl,
				operationName: fakeOperationName,
			}),
		);

		await waitFor(() => {
			expect(result.current.data).toBeUndefined();
			expect(result.current.loading).toBe(false);

			expect(result.current.error).toBeInstanceOf(UseQueryLightError);
			expect(result.current.error?.message).toBe(error.message);
			expect(result.current.error?.networkError).toBe(error);
			expect(result.current.error?.graphQLErrors).toEqual([]);
		});
	});

	it('should handle graphql errors correctly', async () => {
		const body = { errors: [{ message: 'test error' }, { message: 'second error' }] };
		const response: Response = new Response(JSON.stringify(body));
		(fetchWithExponentialBackoff as jest.Mock).mockResolvedValue(response);
		const { result } = renderHook(() =>
			useQueryLight(parse(fakeGraphql), {
				serviceUrl: fakeServiceUrl,
				operationName: fakeOperationName,
			}),
		);

		await waitFor(() => {
			expect(result.current.data).toBeUndefined();
			expect(result.current.loading).toBe(false);

			expect(result.current.error).toBeInstanceOf(UseQueryLightError);
			expect(result.current.error?.message).toBe('test error\nsecond error');
			expect(result.current.error?.networkError).toBeUndefined();
			expect(result.current.error?.graphQLErrors).toEqual(body.errors);
		});
	});

	it('should handle fetchMore correctly', async () => {
		const body = { data: ['test1'] };
		const response: Response = new Response(JSON.stringify(body));
		(fetchWithExponentialBackoff as jest.Mock).mockResolvedValue(response);
		const { result } = renderHook(() =>
			useQueryLight<undefined, string[]>(parse(fakeGraphql), {
				serviceUrl: fakeServiceUrl,
				operationName: fakeOperationName,
			}),
		);

		const newBody = { data: ['test2'] };
		const newResponse: Response = new Response(JSON.stringify(newBody));
		(fetchWithExponentialBackoff as jest.Mock).mockResolvedValue(newResponse);

		await act(async () => {
			await result.current.fetchMore({
				variables: undefined,
				handleDataMerge: (prevData, newData) => prevData && newData && [...prevData, ...newData],
			});
		});

		await waitFor(() => {
			expect(result.current.data).toEqual([...body.data, ...newBody.data]);
			expect(result.current.loading).toBe(false);
			expect(result.current.error).toBeUndefined();
		});
	});
});

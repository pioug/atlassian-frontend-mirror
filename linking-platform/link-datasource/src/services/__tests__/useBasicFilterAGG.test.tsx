import React from 'react';

import { renderHook, type RenderHookOptions } from '@testing-library/react';

import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';

import {
	mockFieldValuesResponse,
	mockHydrateJqlResponse,
	mockUserHydrationResponse,
	mockUserRecommendationsResponse,
} from '../mocks';
import { useBasicFilterAGG } from '../useBasicFilterAGG';

let mockRequest = jest.fn();

jest.mock('@atlaskit/linking-common', () => {
	const originalModule = jest.requireActual('@atlaskit/linking-common');
	return {
		...originalModule,
		request: (...args: any) => mockRequest(...args),
	};
});

const wrapper: RenderHookOptions<{}>['wrapper'] = ({ children }) => (
	<SmartCardProvider client={new CardClient()}>{children}</SmartCardProvider>
);

describe('useBasicFilterAGG', () => {
	const setup = () => {
		const { result } = renderHook(() => useBasicFilterAGG(), {
			wrapper,
		});

		const { getHydratedJQL, getFieldValues, getCurrentUserInfo, getUsersFromAccountIDs } =
			result.current;

		return {
			getHydratedJQL,
			getFieldValues,
			getCurrentUserInfo,
			getUsersFromAccountIDs,
		};
	};

	beforeEach(() => {
		mockRequest.mockClear();
	});

	it('returns datasource client extension methods', () => {
		const { result } = renderHook(() => useBasicFilterAGG(), {
			wrapper,
		});

		expect(result.current).toEqual({
			getFieldValues: expect.any(Function),
			getHydratedJQL: expect.any(Function),
			getCurrentUserInfo: expect.any(Function),
			getUsersFromAccountIDs: expect.any(Function),
		});
	});

	describe('#getHydratedJql', () => {
		const cloudId = 'my-cloud-id!';
		const jql = 'project=TEST';

		it('makes request to /graphql with expected arguments', async () => {
			const { getHydratedJQL } = setup();

			await getHydratedJQL(cloudId, jql);

			expect(mockRequest).toHaveBeenCalledWith(
				'post',
				'/gateway/api/graphql',
				expect.any(Object), // this is checked below
				{ 'X-ExperimentalApi': 'JiraJqlBuilder' },
				[200, 201, 202, 203, 204],
			);

			const fetchArgs = mockRequest.mock.calls[0][2];

			expect(fetchArgs.variables).toEqual(
				expect.objectContaining({
					cloudId,
					jql,
				}),
			);
		});

		it('returns success response', async () => {
			const { getHydratedJQL } = setup();

			const expectedResponse = mockHydrateJqlResponse;
			mockRequest.mockResolvedValueOnce(expectedResponse);

			const response = await getHydratedJQL(cloudId, jql);
			expect(response).toEqual(expectedResponse);
		});

		it('returns error response', async () => {
			const { getHydratedJQL } = setup();

			const error = new Error();
			mockRequest.mockRejectedValueOnce(error);

			await expect(getHydratedJQL(cloudId, jql)).rejects.toThrow();
		});
	});

	describe('#getFieldValues', () => {
		const cloudId = 'my-cloud-id!';
		const jql = 'project=TEST';
		const jqlTerm = 'project';
		const searchString = 'TEST';
		const pageCursor = 'cursor!';

		it('makes request to /graphql with expected arguments', async () => {
			const { getFieldValues } = setup();

			await getFieldValues({ cloudId, jql, jqlTerm, searchString, pageCursor });

			expect(mockRequest).toHaveBeenCalledWith(
				'post',
				'/gateway/api/graphql',
				expect.any(Object), // this is checked below
				{ 'X-ExperimentalApi': 'JiraJqlBuilder' },
				[200, 201, 202, 203, 204],
			);

			const fetchArgs = mockRequest.mock.calls[0][2];

			expect(fetchArgs.variables).toEqual(
				expect.objectContaining({
					cloudId,
					jql,
					jqlTerm,
					searchString,
					after: pageCursor,
				}),
			);
		});

		it('returns success response', async () => {
			const { getFieldValues } = setup();

			const expectedResponse = mockFieldValuesResponse;
			mockRequest.mockResolvedValueOnce(expectedResponse);

			const response = await getFieldValues({
				cloudId,
				jql,
				jqlTerm,
				searchString,
				pageCursor,
			});
			expect(response).toEqual(expectedResponse);
		});

		it('throws an error when fetch throws', async () => {
			const { getFieldValues } = setup();

			const error = new Error();
			mockRequest.mockRejectedValueOnce(error);

			await expect(
				getFieldValues({ cloudId, jql, jqlTerm, searchString, pageCursor }),
			).rejects.toThrow();
		});
	});

	describe('#getCurrentUserInfo', () => {
		const expectedUserQuery =
			'query userQuery {\n  me {\n    user {\n      id\n      accountId\n    }\n  }\n}';

		it('Makes request to /graphql with expected arguments', async () => {
			const { getCurrentUserInfo } = setup();

			await getCurrentUserInfo();

			expect(mockRequest).toHaveBeenCalledWith(
				'post',
				'/gateway/api/graphql',
				expect.any(Object), // this is checked below
				undefined,
				[200, 201, 202, 203, 204],
			);

			const fetchArgs = mockRequest.mock.calls[0][2];

			expect(fetchArgs).toEqual({
				operationName: 'userQuery',
				query: expectedUserQuery,
			});
		});

		it('returns correct success response', async () => {
			const { getCurrentUserInfo } = setup();

			const expectedResponse = mockUserRecommendationsResponse;
			mockRequest.mockResolvedValueOnce(expectedResponse);

			const response = await getCurrentUserInfo();
			expect(response).toEqual(expectedResponse);
		});

		it('throws an error when fetch encounters error', async () => {
			const { getCurrentUserInfo } = setup();

			const error = new Error();
			mockRequest.mockRejectedValueOnce(error);

			await expect(getCurrentUserInfo()).rejects.toThrow();
		});
	});

	describe('#getUsersFromAccountIDs', () => {
		it('makes request to /graphql with expected arguments', async () => {
			const { getUsersFromAccountIDs } = setup();

			await getUsersFromAccountIDs(['1', '2', '4']);

			expect(mockRequest).toHaveBeenCalledWith(
				'post',
				'/gateway/api/graphql',
				expect.any(Object), // this is checked below
				undefined,
				[200, 201, 202, 203, 204],
			);

			const fetchArgs = mockRequest.mock.calls[0][2];

			expect(fetchArgs.operationName).toEqual('userHydration');
			expect(fetchArgs.variables).toEqual({ accountIds: ['1', '2', '4'] });
			expect(fetchArgs.query).toMatchInlineSnapshot(`
        "query userHydration($accountIds: [ID!]!) {
          users(accountIds: $accountIds) {
            accountId
            name
            picture
          }
        }"
      `);
		});

		it('returns correct success response', async () => {
			const { getUsersFromAccountIDs } = setup();

			const expectedResponse = mockUserHydrationResponse;
			mockRequest.mockResolvedValueOnce(mockUserHydrationResponse);

			const response = await getUsersFromAccountIDs(['123']);
			expect(response).toEqual(expectedResponse);
		});

		it('throws an error when fetch encounters error', async () => {
			const { getUsersFromAccountIDs } = setup();

			const error = new Error();
			mockRequest.mockRejectedValueOnce(error);

			await expect(getUsersFromAccountIDs(['1', '2', '4'])).rejects.toThrow();
		});
	});
});

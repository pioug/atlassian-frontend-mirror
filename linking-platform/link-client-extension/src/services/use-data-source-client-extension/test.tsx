import React from 'react';

import { renderHook, type RenderHookOptions } from '@testing-library/react-hooks';

import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { NetworkError } from '@atlaskit/linking-common';
import type {
	DatasourceDataRequest,
	DatasourceDataResponse,
	DatasourceDetailsRequest,
	DatasourceDetailsResponse,
} from '@atlaskit/linking-types';

import { mockDatasourceDataResponse, mockDatasourceDetailsResponse } from './mocks';

import {
	datasourceDataResponsePromiseCache,
	datasourceDetailsResponsePromiseCache,
	useDatasourceClientExtension,
} from './index';

const allErrorCodes = [
	400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 421,
	422, 423, 424, 425, 426, 428, 429, 431, 451, 500, 501, 502, 503, 504, 505, 506, 507, 508, 511,
];

const datasourceId: string = '12e74246-a3f1-46c1-9fd9-8d952aa9f12f';

const wrapper: RenderHookOptions<{}>['wrapper'] = ({ children }) => (
	<SmartCardProvider client={new CardClient()}>{children}</SmartCardProvider>
);

describe('useDatasourceClientExtension', () => {
	let mockFetch: jest.Mock;

	const setup = () => {
		const datasourceDetailsParams: DatasourceDetailsRequest = {
			parameters: {
				cloudId: 'DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b',
				jql: 'project=EDM',
			},
		};

		const datasourceDataParams: DatasourceDataRequest = {
			fields: ['summary', 'issueType', 'status'],
			parameters: {
				cloudId: 'DUMMY-158c8204-ff3b-47c2-adbb-a0906ccc722b',
				jql: 'project = EDM',
			},
			pageSize: 20,
			pageCursor: 'c3RhcnRBdD01',
		};

		const { result } = renderHook(() => useDatasourceClientExtension(), {
			wrapper,
		});

		const { getDatasourceDetails, getDatasourceData } = result.current;

		return {
			getDatasourceDetails,
			getDatasourceData,
			datasourceDetailsParams,
			datasourceDataParams,
		};
	};

	beforeEach(() => {
		datasourceDetailsResponsePromiseCache.clear();
		datasourceDataResponsePromiseCache.clear();
		jest.resetModules();
		mockFetch = jest.fn();
		(global as any).fetch = mockFetch;
	});

	it('returns datasource client extension methods', () => {
		const { result } = renderHook(() => useDatasourceClientExtension(), {
			wrapper,
		});

		expect(result.current).toEqual({
			getDatasourceDetails: expect.any(Function),
			getDatasourceData: expect.any(Function),
		});
	});

	describe('#getDatasourceDetails', () => {
		it('makes request to /datasource/<datasourceId>/fetch/details', async () => {
			const { getDatasourceDetails, datasourceDetailsParams } = setup();

			mockFetch.mockResolvedValueOnce({
				json: async () => undefined,
				ok: true,
				text: async () => undefined,
			});

			await getDatasourceDetails(datasourceId, datasourceDetailsParams);

			expect(mockFetch).toHaveBeenCalledWith(
				expect.stringContaining(`/datasource/${datasourceId}/fetch/details`),
				{
					body: JSON.stringify(datasourceDetailsParams),
					credentials: 'include',
					headers: {
						Accept: 'application/json',
						'Cache-Control': 'no-cache',
						'Content-Type': 'application/json',
					},
					method: 'post',
				},
			);
		});

		it('returns error response', async () => {
			const { getDatasourceDetails, datasourceDetailsParams } = setup();

			const error = new Error();
			mockFetch.mockRejectedValueOnce(error);

			await expect(getDatasourceDetails(datasourceId, datasourceDetailsParams)).rejects.toBe(error);
		});

		it.each(allErrorCodes)('throws %s response', async (status: number) => {
			const { getDatasourceDetails, datasourceDetailsParams } = setup();

			const expectedResponse = { ok: false, status };
			mockFetch.mockResolvedValueOnce(expectedResponse);

			await expect(getDatasourceDetails(datasourceId, datasourceDetailsParams)).rejects.toBe(
				expectedResponse,
			);
		});

		it('throws network error on string error', async () => {
			const { getDatasourceDetails, datasourceDetailsParams } = setup();

			const errorMessage = 'API is down';
			mockFetch.mockRejectedValueOnce(errorMessage);

			await expect(getDatasourceDetails(datasourceId, datasourceDetailsParams)).rejects.toThrow(
				new NetworkError(errorMessage),
			);
		});

		it('throws network error response on TypeError', async () => {
			const { getDatasourceDetails, datasourceDetailsParams } = setup();

			const error = TypeError('null has no properties');
			mockFetch.mockRejectedValueOnce(error);

			await expect(getDatasourceDetails(datasourceId, datasourceDetailsParams)).rejects.toThrow(
				new NetworkError(error),
			);
		});

		it('returns success response', async () => {
			const { getDatasourceDetails, datasourceDetailsParams } = setup();

			const expectedResponse: DatasourceDetailsResponse = mockDatasourceDetailsResponse;

			mockFetch.mockResolvedValueOnce({
				body: '{}',
				json: async () => expectedResponse,
				ok: true,
				text: async () => JSON.stringify(expectedResponse),
			});

			const actualResponse = await getDatasourceDetails(datasourceId, datasourceDetailsParams);

			expect(actualResponse).toEqual(expectedResponse);
		});

		describe('with caching', () => {
			describe('when response is ok', () => {
				let expectedResponseOne: DatasourceDetailsResponse;

				beforeEach(() => {
					const { meta, data } = mockDatasourceDetailsResponse;
					expectedResponseOne = { meta, data: { ...data, name: 'One' } };
					const expectedResponseTwo: DatasourceDetailsResponse = {
						meta,
						data: { ...data, name: 'Two' },
					};

					mockFetch.mockResolvedValueOnce({
						body: '{}',
						json: async () => expectedResponseOne,
						ok: true,
						text: async () => JSON.stringify(expectedResponseOne),
					});
					mockFetch.mockResolvedValueOnce({
						body: '{}',
						json: async () => expectedResponseTwo,
						ok: true,
						text: async () => JSON.stringify(expectedResponseTwo),
					});
				});

				it('should not make another request with the same set of input parameters', async () => {
					const { getDatasourceDetails, datasourceDetailsParams } = setup();

					await getDatasourceDetails(datasourceId, {
						...datasourceDetailsParams,
					});
					await getDatasourceDetails(datasourceId, {
						...datasourceDetailsParams,
					});
					expect(mockFetch).toHaveBeenCalledTimes(1);
				});

				it('should return response from first request when called second time', async () => {
					const { getDatasourceDetails, datasourceDetailsParams } = setup();

					const actualResponseOne = await getDatasourceDetails(datasourceId, {
						...datasourceDetailsParams,
					});
					const actualResponseTwo = await getDatasourceDetails(datasourceId, {
						...datasourceDetailsParams,
					});

					expect(actualResponseOne).toEqual(expectedResponseOne);
					expect(actualResponseTwo).toEqual(expectedResponseOne);
				});

				it("should return response from first request even if it hasn't finished when second request", async () => {
					const { getDatasourceDetails, datasourceDetailsParams } = setup();

					const actualResponseOnePromise = getDatasourceDetails(datasourceId, {
						...datasourceDetailsParams,
					});
					const actualResponseTwoPromise = getDatasourceDetails(datasourceId, {
						...datasourceDetailsParams,
					});

					expect(await actualResponseOnePromise).toEqual(expectedResponseOne);
					expect(await actualResponseTwoPromise).toEqual(expectedResponseOne);
				});

				it('should force http call when requested', async () => {
					const { getDatasourceDetails, datasourceDetailsParams } = setup();

					await getDatasourceDetails(datasourceId, {
						...datasourceDetailsParams,
					});
					await getDatasourceDetails(datasourceId, {
						...datasourceDetailsParams,
					});
					await getDatasourceDetails(
						datasourceId,
						{
							...datasourceDetailsParams,
						},
						true,
					);
					await getDatasourceDetails(datasourceId, {
						...datasourceDetailsParams,
					});
					expect(mockFetch).toHaveBeenCalledTimes(2);
				});
			});

			it.each(allErrorCodes)('should not cache %s response', async (status: number) => {
				const rejectedFetchResult = {
					ok: false,
					status,
				};
				mockFetch.mockResolvedValueOnce(rejectedFetchResult);
				mockFetch.mockResolvedValueOnce({
					body: '{}',
					json: async () => mockDatasourceDetailsResponse,
					ok: true,
					text: async () => JSON.stringify(mockDatasourceDetailsResponse),
				});

				const { getDatasourceDetails, datasourceDetailsParams } = setup();

				await expect(
					getDatasourceDetails(datasourceId, { ...datasourceDetailsParams }),
				).rejects.toBe(rejectedFetchResult);
				expect(
					await getDatasourceDetails(datasourceId, {
						...datasourceDetailsParams,
					}),
				).toEqual({ ...mockDatasourceDetailsResponse });
			});
		});
	});

	describe('#getDatasourceData', () => {
		it('makes request to /datasource/<datasourceId>/fetch/data', async () => {
			const { getDatasourceData, datasourceDataParams } = setup();

			mockFetch.mockResolvedValueOnce({
				json: async () => undefined,
				ok: true,
				text: async () => undefined,
			});

			await getDatasourceData(datasourceId, datasourceDataParams);

			expect(mockFetch).toHaveBeenCalledWith(
				expect.stringContaining(`/datasource/${datasourceId}/fetch/data`),
				{
					body: JSON.stringify(datasourceDataParams),
					credentials: 'include',
					headers: {
						Accept: 'application/json',
						'Cache-Control': 'no-cache',
						'Content-Type': 'application/json',
					},
					method: 'post',
				},
			);
		});

		it('returns error response', async () => {
			const { getDatasourceData, datasourceDataParams } = setup();

			const error = new Error();
			mockFetch.mockRejectedValueOnce(error);

			await expect(getDatasourceData(datasourceId, datasourceDataParams)).rejects.toBe(error);
		});

		it.each(allErrorCodes)('throws %s response', async (status: number) => {
			const { getDatasourceData, datasourceDataParams } = setup();

			const expectedResponse = { ok: false, status };
			mockFetch.mockResolvedValueOnce(expectedResponse);

			await expect(getDatasourceData(datasourceId, datasourceDataParams)).rejects.toBe(
				expectedResponse,
			);
		});

		it('throws network error on string error', async () => {
			const { getDatasourceData, datasourceDataParams } = setup();

			const errorMessage = 'API is down';
			mockFetch.mockRejectedValueOnce(errorMessage);

			await expect(getDatasourceData(datasourceId, datasourceDataParams)).rejects.toThrow(
				new NetworkError(errorMessage),
			);
		});

		it('throws network error response on TypeError', async () => {
			const { getDatasourceData, datasourceDataParams } = setup();

			const error = TypeError('null has no properties');
			mockFetch.mockRejectedValueOnce(error);

			await expect(getDatasourceData(datasourceId, datasourceDataParams)).rejects.toThrow(
				new NetworkError(error),
			);
		});

		it('returns success response', async () => {
			const { getDatasourceData, datasourceDataParams } = setup();

			const expectedResponse: DatasourceDataResponse = mockDatasourceDataResponse;

			mockFetch.mockResolvedValueOnce({
				body: {},
				json: async () => expectedResponse,
				ok: true,
				text: async () => JSON.stringify(expectedResponse),
			});

			const response = await getDatasourceData(datasourceId, datasourceDataParams);

			expect(response).toEqual(expectedResponse);
		});

		describe('with caching', () => {
			describe('when response is ok', () => {
				let expectedResponseOne: DatasourceDataResponse;

				beforeEach(() => {
					const { meta, data } = mockDatasourceDataResponse;
					expectedResponseOne = { meta, data: { ...data, totalCount: 1 } };
					const expectedResponseTwo: DatasourceDataResponse = {
						meta,
						data: { ...data, totalCount: 2 },
					};

					mockFetch.mockResolvedValueOnce({
						body: '{}',
						json: async () => expectedResponseOne,
						ok: true,
						text: async () => JSON.stringify(expectedResponseOne),
					});
					mockFetch.mockResolvedValueOnce({
						body: '{}',
						json: async () => expectedResponseTwo,
						ok: true,
						text: async () => JSON.stringify(expectedResponseTwo),
					});
				});

				it('should not make another request with the same set of input parameters', async () => {
					const { getDatasourceData, datasourceDataParams } = setup();

					await getDatasourceData(datasourceId, { ...datasourceDataParams });
					await getDatasourceData(datasourceId, { ...datasourceDataParams });
					expect(mockFetch).toHaveBeenCalledTimes(1);
				});

				it('should not make another request when the field prop in the request parameter is sorted', async () => {
					const { getDatasourceData, datasourceDataParams } = setup();
					const dataWithSortedFields = {
						...datasourceDataParams,
						fields: ['issueType', 'status', 'summary'],
					};

					await getDatasourceData(datasourceId, { ...datasourceDataParams });
					await getDatasourceData(datasourceId, { ...dataWithSortedFields });

					expect(mockFetch).toHaveBeenCalledTimes(1);
				});

				it('should return response from first request when called second time', async () => {
					const { getDatasourceData, datasourceDataParams } = setup();

					const actualResponseOne = await getDatasourceData(datasourceId, {
						...datasourceDataParams,
					});
					const actualResponseTwo = await getDatasourceData(datasourceId, {
						...datasourceDataParams,
					});

					expect(actualResponseOne).toEqual(expectedResponseOne);
					expect(actualResponseTwo).toEqual(expectedResponseOne);
				});

				it("should return response from first request even if it hasn't finished when second request", async () => {
					const { getDatasourceData, datasourceDataParams } = setup();

					const actualResponseOnePromise = getDatasourceData(datasourceId, {
						...datasourceDataParams,
					});
					const actualResponseTwoPromise = getDatasourceData(datasourceId, {
						...datasourceDataParams,
					});

					expect(await actualResponseOnePromise).toEqual(expectedResponseOne);
					expect(await actualResponseTwoPromise).toEqual(expectedResponseOne);
				});

				it('should force http call when requested', async () => {
					const { getDatasourceData, datasourceDataParams } = setup();

					await getDatasourceData(datasourceId, { ...datasourceDataParams });
					await getDatasourceData(datasourceId, { ...datasourceDataParams });
					await getDatasourceData(datasourceId, { ...datasourceDataParams }, true);
					await getDatasourceData(datasourceId, { ...datasourceDataParams });
					expect(mockFetch).toHaveBeenCalledTimes(2);
				});
			});

			it.each(allErrorCodes)('should not cache %s response', async (status: number) => {
				const rejectedFetchResult = {
					ok: false,
					status,
				};
				mockFetch.mockResolvedValueOnce(rejectedFetchResult);
				mockFetch.mockResolvedValueOnce({
					body: '{}',
					json: async () => mockDatasourceDataResponse,
					ok: true,
					text: async () => JSON.stringify(mockDatasourceDataResponse),
				});

				const { getDatasourceData, datasourceDataParams } = setup();

				await expect(getDatasourceData(datasourceId, { ...datasourceDataParams })).rejects.toBe(
					rejectedFetchResult,
				);
				expect(await getDatasourceData(datasourceId, { ...datasourceDataParams })).toEqual({
					...mockDatasourceDataResponse,
				});
			});
		});
	});
});

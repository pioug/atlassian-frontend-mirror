import fetchMock from 'fetch-mock/cjs/client';

import { fetchObjectSchema, fetchObjectSchemas, getWorkspaceId, validateAql } from '../cmdbService';
import { FetchError, getStatusCodeGroup, PermissionError } from '../cmdbService.utils';

describe('cmdbService', () => {
	beforeEach(() => {
		fetchMock.reset();
	});

	const workspaceId = 'workspaceId';
	const schemaId = 'schemaId';
	const fireEventMock = jest.fn();

	describe('getWorkspaceId', () => {
		const mockResponse = {
			results: [
				{
					id: '5',
				},
			],
		};

		it('should return workspaceId', async () => {
			const mock = fetchMock.get({
				url: '/rest/servicedesk/cmdb/latest/workspace',
				response: mockResponse,
			});

			const response = await getWorkspaceId(fireEventMock);

			expect(mock.calls()).toHaveLength(1);
			expect(mock.done()).toBe(true);
			expect(response).toEqual(mockResponse.results[0].id);
			expect(fireEventMock).toBeCalledWith('operational.getWorkspaceId.success', {});
		});

		it('should throw PermissionError if response results is empty', async () => {
			const mockResponse = {
				results: [],
			};
			const mock = fetchMock.get({
				url: '/rest/servicedesk/cmdb/latest/workspace',
				response: mockResponse,
			});

			await expect(getWorkspaceId).rejects.toThrow(PermissionError);
			expect(mock.calls()).toHaveLength(1);
			expect(mock.done()).toBe(true);
		});

		it.each([
			[500, FetchError],
			[429, FetchError],
			[412, PermissionError],
			[401, PermissionError],
		])(
			'should throw correct error type if response status is %s',
			async (statusCode: number, errorType: string | RegExp | Error | jest.Constructable) => {
				const mock = fetchMock.get({
					url: '/rest/servicedesk/cmdb/latest/workspace',
					response: statusCode,
				});

				await expect(getWorkspaceId(fireEventMock)).rejects.toThrow(errorType);
				expect(mock.calls()).toHaveLength(1);
				expect(mock.done()).toBe(true);
				expect(fireEventMock).toBeCalledWith('operational.getWorkspaceId.failed', {
					statusCodeGroup: getStatusCodeGroup(new FetchError(statusCode)),
				});
			},
		);
	});

	describe('validateAql', () => {
		const mockResponseIsValid = {
			isValid: true,
		};

		const mockResponseInvalid = {
			isValid: false,
		};

		it.each([
			[{ qlQuery: 'valid aql' }, mockResponseIsValid],
			[{ qlQuery: 'invalidAql' }, mockResponseInvalid],
		])(
			'should return correct isValid boolean when data is %o',
			async (aql, expectedMockResponse) => {
				const mock = fetchMock.post({
					url: `/gateway/api/jsm/assets/workspace/${workspaceId}/v1/aql/validate`,
					response: expectedMockResponse,
					body: {
						qlQuery: aql.qlQuery,
						context: 'SMART_LINKS',
					},
				});

				const response = await validateAql(workspaceId, aql, fireEventMock);

				expect(mock.calls()).toHaveLength(1);
				expect(mock.done()).toBe(true);
				expect(response).toEqual(expectedMockResponse);
				expect(fireEventMock).toBeCalledWith('operational.validateAql.success', {});
			},
		);

		it.each([
			[500, FetchError],
			[401, PermissionError],
		])(
			'should throw correct error type if response status is %s',
			async (statusCode: number, errorType: string | RegExp | Error | jest.Constructable) => {
				const query = { qlQuery: 'valid aql' };
				const mock = fetchMock.post({
					url: `/gateway/api/jsm/assets/workspace/${workspaceId}/v1/aql/validate`,
					response: statusCode,
					body: {
						context: 'SMART_LINKS',
						...query,
					},
				});

				await expect(validateAql(workspaceId, query, fireEventMock)).rejects.toThrow(errorType);
				expect(mock.calls()).toHaveLength(1);
				expect(mock.done()).toBe(true);
				expect(fireEventMock).toBeCalledWith('operational.validateAql.failed', {
					statusCodeGroup: getStatusCodeGroup(new FetchError(statusCode)),
				});
			},
		);
	});

	describe('fetchObjectSchema', () => {
		it('should return an object schema', async () => {
			const mockResponseObjectSchema = {
				id: schemaId,
				name: 'objSchema1',
			};
			const mock = fetchMock.get({
				url: `/gateway/api/jsm/assets/workspace/${workspaceId}/v1/objectschema/${schemaId}`,
				response: mockResponseObjectSchema,
			});

			const response = await fetchObjectSchema(workspaceId, schemaId, fireEventMock);

			expect(mock.calls()).toHaveLength(1);
			expect(mock.done()).toBe(true);
			expect(response).toEqual(mockResponseObjectSchema);
			expect(fireEventMock).toBeCalledWith('operational.objectSchema.success', {});
		});

		it.each([
			[500, FetchError],
			[401, PermissionError],
		])(
			'should throw correct error type if response status is %s',
			async (statusCode: number, errorType: string | RegExp | Error | jest.Constructable) => {
				const mock = fetchMock.get({
					url: `/gateway/api/jsm/assets/workspace/${workspaceId}/v1/objectschema/${schemaId}`,
					response: statusCode,
				});

				await expect(fetchObjectSchema(workspaceId, schemaId, fireEventMock)).rejects.toThrow(
					errorType,
				);
				expect(mock.calls()).toHaveLength(1);
				expect(mock.done()).toBe(true);
				expect(fireEventMock).toBeCalledWith('operational.objectSchema.failed', {
					statusCodeGroup: getStatusCodeGroup(new FetchError(statusCode)),
				});
			},
		);
	});

	describe('fetchObjectSchemas', () => {
		const mockResponseWithQuery = {
			values: [
				{
					id: '3',
					name: 'schemaQuery',
				},
			],
		};

		const mockResponseWithoutQuery = {
			values: [
				{
					id: '4',
					name: 'objSchema4',
				},
			],
		};

		it.each([
			['schemaQuery', mockResponseWithQuery],
			['', mockResponseWithoutQuery],
			[undefined, mockResponseWithoutQuery],
		])(
			'should call endpoint with correct params and return an array of object schemas when query is %s',
			async (query, expectedMockResponse) => {
				const mock = fetchMock.get({
					url: `/gateway/api/jsm/assets/workspace/${workspaceId}/v1/objectschema/list?maxResults=20&includeCounts=false${
						query ? `&query=${query}` : ''
					}`,
					response: expectedMockResponse,
				});

				const response = await fetchObjectSchemas(workspaceId, query, fireEventMock);

				expect(mock.calls()).toHaveLength(1);
				expect(mock.done()).toBe(true);
				expect(response).toEqual(expectedMockResponse);
				expect(fireEventMock).toBeCalledWith('operational.objectSchemas.success', {});
			},
		);

		it.each([
			[500, FetchError],
			[401, PermissionError],
		])(
			'should throw correct error type if response status is %s',
			async (statusCode: number, errorType: string | RegExp | Error | jest.Constructable) => {
				const mock = fetchMock.get({
					url: `/gateway/api/jsm/assets/workspace/${workspaceId}/v1/objectschema/list?maxResults=20&includeCounts=false`,
					response: statusCode,
				});

				await expect(fetchObjectSchemas(workspaceId, undefined, fireEventMock)).rejects.toThrow(
					errorType,
				);
				expect(mock.calls()).toHaveLength(1);
				expect(mock.done()).toBe(true);
				expect(fireEventMock).toBeCalledWith('operational.objectSchemas.failed', {
					statusCodeGroup: getStatusCodeGroup(new FetchError(statusCode)),
				});
			},
		);
	});
});

import fetchMock from 'fetch-mock/cjs/client';

import {
	fetchObjectSchema,
	fetchObjectSchemas,
	getWorkspaceId,
	resolvePrimaryWorkspace,
	validateAql,
} from '../cmdbService';
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
			expect(fireEventMock).toHaveBeenCalledWith('operational.getWorkspaceId.success', {});
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
				expect(fireEventMock).toHaveBeenCalledWith('operational.getWorkspaceId.failed', {
					statusCodeGroup: getStatusCodeGroup(new FetchError(statusCode)),
				});
			},
		);
	});

	describe('resolvePrimaryWorkspace', () => {
		const cloudId = 'cloud-id-123';
		const resolverUrl = '/assets/internal/workspace?productContext=confluence';

		it('should call the unit-aware resolver with the cloudId header and map linkedAssetsWorkspaceId to workspaceId', async () => {
			const mock = fetchMock.get({
				url: resolverUrl,
				response: {
					linkedAssetsWorkspaceId: 'primary-workspace-id',
					linkedAssetsSiteCloudId: '858300e7-08ae-403f-852d-924d7db4b1e8',
					siteWithJiraUrl: 'https://primary.jira-dev.com',
				},
			});

			const response = await resolvePrimaryWorkspace(cloudId);

			expect(mock.calls()).toHaveLength(1);
			expect(mock.done()).toBe(true);
			// cloudId is sent via the x-atlassian-cloud-id header
			const [, requestInit] = mock.lastCall() ?? [];
			expect(new Headers(requestInit?.headers).get('x-atlassian-cloud-id')).toBe(cloudId);
			expect(response).toEqual({ workspaceId: 'primary-workspace-id' });
		});

		it('should throw when the resolver returns no linkedAssetsWorkspaceId', async () => {
			const mock = fetchMock.get({
				url: resolverUrl,
				response: {
					linkedAssetsSiteCloudId: '858300e7-08ae-403f-852d-924d7db4b1e8',
					siteWithJiraUrl: 'https://primary.jira-dev.com',
				},
			});

			await expect(resolvePrimaryWorkspace(cloudId)).rejects.toThrow(
				'Assets workspace resolver returned no workspaceId',
			);
			expect(mock.done()).toBe(true);
		});

		it.each([[404], [403], [500]])(
			'should throw when the resolver responds with status %s',
			async (statusCode: number) => {
				const mock = fetchMock.get({
					url: resolverUrl,
					response: statusCode,
				});

				await expect(resolvePrimaryWorkspace(cloudId)).rejects.toBeDefined();
				expect(mock.done()).toBe(true);
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
				expect(fireEventMock).toHaveBeenCalledWith('operational.validateAql.success', {});
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
				expect(fireEventMock).toHaveBeenCalledWith('operational.validateAql.failed', {
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
			expect(fireEventMock).toHaveBeenCalledWith('operational.objectSchema.success', {});
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
				expect(fireEventMock).toHaveBeenCalledWith('operational.objectSchema.failed', {
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
				expect(fireEventMock).toHaveBeenCalledWith('operational.objectSchemas.success', {});
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
				expect(fireEventMock).toHaveBeenCalledWith('operational.objectSchemas.failed', {
					statusCodeGroup: getStatusCodeGroup(new FetchError(statusCode)),
				});
			},
		);
	});
});

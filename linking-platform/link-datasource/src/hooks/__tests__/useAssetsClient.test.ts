import { act, renderHook, waitFor } from '@testing-library/react';

import { asMock } from '@atlaskit/link-test-helpers/jest';

import { fetchObjectSchema, fetchObjectSchemas, getWorkspaceId } from '../../services/cmdbService';
import { type ObjectSchema } from '../../types/assets/types';
import { useAssetsClient } from '../useAssetsClient';

jest.mock('../../services/cmdbService');

const mockFetchObjectSchemasResponse = {
	startAt: 0,
	maxResults: 20,
	total: 2,
	values: [
		{
			id: '1',
			name: 'schemaOne',
		},
		{
			id: '2',
			name: 'schemaTwo',
		},
	],
	isLast: true,
};

describe('useAssetsClient', () => {
	const workspaceId = 'workspaceId';
	const schemaName = 'schemaName';
	const schemaId = 'schemaId';
	const initialParameters = {
		aql: '',
		workspaceId: '',
		schemaId,
	};
	const mockGetWorkspaceId = asMock(getWorkspaceId);
	const mockFetchObjectSchema = asMock(fetchObjectSchema);
	const mockFetchObjectSchemas = asMock(fetchObjectSchemas);
	const mockFetchEvent = expect.any(Function);

	beforeEach(() => {
		jest.resetAllMocks();
		mockGetWorkspaceId.mockResolvedValue(workspaceId);
		mockFetchObjectSchema.mockResolvedValue({ name: schemaName, id: schemaId });
		mockFetchObjectSchemas.mockResolvedValue(mockFetchObjectSchemasResponse);
	});

	it('should fetch workspaceId and object schemas when mounted', async () => {
		const { result } = renderHook(() => useAssetsClient());
		await waitFor(() => {
			expect(result.current.workspaceId).toEqual(workspaceId);
			expect(result.current.workspaceError).toEqual(undefined);
			expect(result.current.objectSchemas).toEqual(mockFetchObjectSchemasResponse.values);
			expect(result.current.objectSchemasError).toEqual(undefined);
			expect(result.current.totalObjectSchemas).toEqual(mockFetchObjectSchemasResponse.total);
			expect(mockFetchObjectSchemas).toHaveBeenCalledWith(workspaceId, undefined, mockFetchEvent);
			expect(mockFetchObjectSchema).not.toHaveBeenCalled();
		});
	});

	it('should fetch object schema when initital schema id in parameters exists', async () => {
		const { result } = renderHook(() => useAssetsClient(initialParameters));
		await waitFor(() => {
			expect(result.current.workspaceId).toEqual(workspaceId);
			expect(mockFetchObjectSchema).toHaveBeenCalledWith(
				workspaceId,
				initialParameters.schemaId,
				mockFetchEvent,
			);
			expect(result.current.existingObjectSchema).toMatchObject({
				name: schemaName,
				id: schemaId,
			});
		});
	});

	it('should set existingObjectSchemaError to an error when fetchObjectSchema rejects', async () => {
		// PermissionError and FetchError extend Error so this test verifies they propogate up
		const mockError = new Error();
		mockFetchObjectSchema.mockRejectedValue(mockError);
		const { result } = renderHook(() => useAssetsClient(initialParameters));
		await waitFor(() => {
			expect(mockFetchObjectSchema).toHaveBeenCalledWith(
				workspaceId,
				initialParameters.schemaId,
				mockFetchEvent,
			);
			expect(result.current.existingObjectSchema).toEqual(undefined);
			expect(result.current.existingObjectSchemaError).toBe(mockError);
		});
	});

	it('should set existingObjectSchemaError to a newly constructed error when fetchObjectSchema rejects with a non error type', async () => {
		const mockError = { error: 'fake error message' };
		mockFetchObjectSchema.mockRejectedValue(mockError);
		const { result } = renderHook(() => useAssetsClient(initialParameters));
		await waitFor(() => {
			expect(mockFetchObjectSchema).toHaveBeenCalledWith(
				workspaceId,
				initialParameters.schemaId,
				mockFetchEvent,
			);
			expect(result.current.existingObjectSchema).toEqual(undefined);
			expect(result.current.existingObjectSchemaError?.message).toEqual(`Unexpected error occured`);
		});
	});

	it('should set workspaceError to an error when getWorkspaceId rejects', async () => {
		// PermissionError and FetchError extend Error so this test verifies they propogate up
		const mockError = new Error();
		mockGetWorkspaceId.mockRejectedValue(mockError);
		const { result } = renderHook(() => useAssetsClient());
		await waitFor(() => {
			expect(mockFetchObjectSchema).not.toHaveBeenCalled();
			expect(mockFetchObjectSchemas).not.toHaveBeenCalled();
			expect(result.current.workspaceError).toBe(mockError);
		});
	});

	it('should set workspaceError to a newly constructed error when getWorkspaceId rejects with a non error type', async () => {
		const mockError = { error: 'fake error message' };
		mockGetWorkspaceId.mockRejectedValue(mockError);
		const { result } = renderHook(() => useAssetsClient());
		await waitFor(() => {
			expect(mockFetchObjectSchema).not.toHaveBeenCalled();
			expect(mockFetchObjectSchemas).not.toHaveBeenCalled();
			expect(result.current.workspaceError?.message).toEqual(`Unexpected error occured`);
		});
	});

	it('should set objectSchemasError to an error when fetchObjectSchemas rejects', async () => {
		// PermissionError and FetchError extend Error so this test verifies they propogate up
		const mockError = new Error();
		mockFetchObjectSchemas.mockRejectedValue(mockError);
		const { result } = renderHook(() => useAssetsClient());
		await waitFor(() => {
			expect(mockFetchObjectSchemas).toHaveBeenCalledWith(workspaceId, undefined, mockFetchEvent);
			expect(result.current.objectSchemas).toBe(undefined);
			expect(result.current.objectSchemasError).toBe(mockError);
		});
	});

	it('should set objectSchemasError to a newly constructed error when fetchObjectSchemas rejects with a non error type', async () => {
		const mockError = { error: 'fake error message' };
		mockFetchObjectSchemas.mockRejectedValue(mockError);
		const { result } = renderHook(() => useAssetsClient());
		await waitFor(() => {
			expect(mockFetchObjectSchemas).toHaveBeenCalledWith(workspaceId, undefined, mockFetchEvent);
			expect(result.current.objectSchemas).toBe(undefined);
			expect(result.current.objectSchemasError?.message).toEqual(`Unexpected error occured`);
		});
	});

	it('should correctly set assetsClientLoading', async () => {
		let fetchObjectSchemaPromise: (
			value: ObjectSchema | PromiseLike<ObjectSchema>,
		) => void = () => {};
		const deferredPromise = new Promise((resolve) => (fetchObjectSchemaPromise = resolve));
		mockFetchObjectSchema.mockReturnValue(deferredPromise);
		const { result } = renderHook(() => useAssetsClient(initialParameters));
		expect(result.current.assetsClientLoading).toBe(true);
		act(() => {
			fetchObjectSchemaPromise({ name: schemaName, id: schemaId });
		});

		await waitFor(() => {
			expect(result.current.assetsClientLoading).toBe(false);
		});
	});
});

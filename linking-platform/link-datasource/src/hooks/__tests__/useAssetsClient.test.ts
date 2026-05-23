import { act, renderHook, waitFor } from '@testing-library/react';

import { asMock } from '@atlaskit/link-test-helpers/jest';
import { useAssetsWorkspaceHost } from '@atlassian/assets-workspace-host';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import { fetchObjectSchema, fetchObjectSchemas, getWorkspaceId } from '../../services/cmdbService';
import { getMeta } from '../../services/getMeta';
import { type ObjectSchema } from '../../types/assets/types';
import { useAssetsClient } from '../useAssetsClient';

jest.mock('../../services/cmdbService');
jest.mock('@atlassian/assets-workspace-host');
jest.mock('../../services/getMeta', () => ({
	getMeta: jest.fn(),
	__clearMetaCacheForTests: jest.fn(),
}));

const mockUseAssetsWorkspaceHost = asMock(useAssetsWorkspaceHost);
const mockGetMeta = getMeta as jest.MockedFunction<typeof getMeta>;

// Production hook reads `isIdle` + `isPending` directly off the resolver
// hook result (mirroring the existing `isPending` API). Each factory should
// produce the canonical state for that lifecycle phase.
const resolverIdle = () =>
	({
		resolvedWorkspaceId: undefined,
		isIdle: true,
		isPending: false,
	}) as unknown as ReturnType<typeof useAssetsWorkspaceHost>;

// `resolverNoData` represents a settled-but-empty resolver (e.g. tenant has
// no Units workspace), used to drive the legacy `getWorkspaceId()` fallback.
const resolverNoData = () =>
	({
		resolvedWorkspaceId: undefined,
		isIdle: false,
		isPending: false,
	}) as unknown as ReturnType<typeof useAssetsWorkspaceHost>;

const resolverPending = () =>
	({
		resolvedWorkspaceId: undefined,
		isIdle: false,
		isPending: true,
	}) as unknown as ReturnType<typeof useAssetsWorkspaceHost>;

const resolverWithWorkspaceId = (id: string) =>
	({
		resolvedWorkspaceId: id,
		isIdle: false,
		isPending: false,
	}) as unknown as ReturnType<typeof useAssetsWorkspaceHost>;

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
		// Default to Idle so the gate-OFF path drives the legacy fetch and
		// behaves identically to pre-ASTRAL-195 behaviour. Tests that exercise
		// the gate-ON resolver path opt-in by overriding this mock.
		mockUseAssetsWorkspaceHost.mockReturnValue(resolverIdle());
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

	describe('Units workspace host resolver', () => {
		const cloudIdFromMeta = 'cloud-id-from-meta';
		const resolvedWorkspaceId = 'resolved-workspace-id-from-resolver';

		describe('cloudId source resolution', () => {
			it('reads cloudId from <meta name="ajs-cloud-id">', () => {
				mockGetMeta.mockReturnValue(cloudIdFromMeta);
				renderHook(() => useAssetsClient(initialParameters));
				expect(mockGetMeta).toHaveBeenCalledWith('ajs-cloud-id');
				expect(mockUseAssetsWorkspaceHost).toHaveBeenCalledWith(
					expect.objectContaining({ cloudId: cloudIdFromMeta }),
				);
			});

			it('passes empty string when the meta tag is absent', () => {
				mockGetMeta.mockReturnValue(undefined);
				renderHook(() => useAssetsClient(initialParameters));
				expect(mockUseAssetsWorkspaceHost).toHaveBeenCalledWith(
					expect.objectContaining({ cloudId: '' }),
				);
			});

			it('forwards productContext: "confluence" to the resolver', () => {
				mockGetMeta.mockReturnValue(cloudIdFromMeta);
				renderHook(() => useAssetsClient(initialParameters));
				expect(mockUseAssetsWorkspaceHost).toHaveBeenCalledWith(
					expect.objectContaining({ productContext: 'confluence' }),
				);
			});

			ffTest.on(
				'astral_units_workspace_host_resolver',
				'when the gate is ON but the cloudId is empty',
				() => {
					it('still skips the resolver to avoid a no-op /workspace lookup', () => {
						mockGetMeta.mockReturnValue(undefined);
						renderHook(() => useAssetsClient(initialParameters));
						expect(mockUseAssetsWorkspaceHost).toHaveBeenCalledWith(
							expect.objectContaining({ cloudId: '', skip: true }),
						);
					});
				},
			);
		});

		describe('resolver gate', () => {
			ffTest.off('astral_units_workspace_host_resolver', 'when the resolver gate is OFF', () => {
				it('skips the resolver hook (skip: true)', () => {
					mockGetMeta.mockReturnValue(cloudIdFromMeta);
					renderHook(() => useAssetsClient(initialParameters));
					expect(mockUseAssetsWorkspaceHost).toHaveBeenCalledWith(
						expect.objectContaining({ skip: true }),
					);
				});
			});

			ffTest.on('astral_units_workspace_host_resolver', 'when the resolver gate is ON', () => {
				it('engages the resolver hook (skip: false)', () => {
					mockGetMeta.mockReturnValue(cloudIdFromMeta);
					renderHook(() => useAssetsClient(initialParameters));
					expect(mockUseAssetsWorkspaceHost).toHaveBeenCalledWith(
						expect.objectContaining({ skip: false }),
					);
				});
			});
		});

		describe('workspaceId source selection', () => {
			ffTest.on(
				'astral_units_workspace_host_resolver',
				'when the resolver gate is ON and the resolver yielded a workspaceId',
				() => {
					it('uses the resolved workspaceId and bypasses the legacy fetch', async () => {
						mockGetMeta.mockReturnValue(cloudIdFromMeta);
						mockUseAssetsWorkspaceHost.mockReturnValue(
							resolverWithWorkspaceId(resolvedWorkspaceId),
						);
						const { result } = renderHook(() => useAssetsClient(initialParameters));
						await waitFor(() => {
							expect(result.current.workspaceId).toEqual(resolvedWorkspaceId);
						});
						expect(mockGetWorkspaceId).not.toHaveBeenCalled();
						expect(mockFetchObjectSchema).toHaveBeenCalledWith(
							resolvedWorkspaceId,
							schemaId,
							mockFetchEvent,
						);
						expect(mockFetchObjectSchemas).toHaveBeenCalledWith(
							resolvedWorkspaceId,
							undefined,
							mockFetchEvent,
						);
					});
				},
			);

			ffTest.off(
				'astral_units_workspace_host_resolver',
				'when the resolver gate is OFF even if the resolver yielded a workspaceId',
				() => {
					it('ignores the resolver and runs the legacy getWorkspaceId() path', async () => {
						mockGetMeta.mockReturnValue(cloudIdFromMeta);
						mockUseAssetsWorkspaceHost.mockReturnValue(
							resolverWithWorkspaceId(resolvedWorkspaceId),
						);
						const { result } = renderHook(() => useAssetsClient(initialParameters));
						await waitFor(() => {
							expect(result.current.workspaceId).toEqual(workspaceId);
						});
						expect(mockGetWorkspaceId).toHaveBeenCalledTimes(1);
					});
				},
			);

			it('falls back to getWorkspaceId() when the resolver yields no workspaceId', async () => {
				mockGetMeta.mockReturnValue(cloudIdFromMeta);
				mockUseAssetsWorkspaceHost.mockReturnValue(resolverNoData());
				const { result } = renderHook(() => useAssetsClient(initialParameters));
				await waitFor(() => {
					expect(result.current.workspaceId).toEqual(workspaceId);
				});
				expect(mockGetWorkspaceId).toHaveBeenCalledTimes(1);
				expect(mockFetchObjectSchemas).toHaveBeenCalledWith(workspaceId, undefined, mockFetchEvent);
			});

			ffTest.on(
				'astral_units_workspace_host_resolver',
				'when the resolver gate is ON and the resolver is Pending',
				() => {
					it('holds loading state and does not call getWorkspaceId()', async () => {
						mockGetMeta.mockReturnValue(cloudIdFromMeta);
						mockUseAssetsWorkspaceHost.mockReturnValue(resolverPending());
						const { result } = renderHook(() => useAssetsClient(initialParameters));
						await Promise.resolve();
						expect(result.current.assetsClientLoading).toBe(true);
						expect(mockGetWorkspaceId).not.toHaveBeenCalled();
						expect(mockFetchObjectSchemas).not.toHaveBeenCalled();
					});
				},
			);

			ffTest.off(
				'astral_units_workspace_host_resolver',
				'when the resolver gate is OFF and the resolver is Pending',
				() => {
					it('still proceeds to call legacy getWorkspaceId() (pending guard is gate-conditional)', async () => {
						mockGetMeta.mockReturnValue(cloudIdFromMeta);
						mockUseAssetsWorkspaceHost.mockReturnValue(resolverPending());
						const { result } = renderHook(() => useAssetsClient(initialParameters));
						await waitFor(() => {
							expect(result.current.workspaceId).toEqual(workspaceId);
						});
						expect(mockGetWorkspaceId).toHaveBeenCalledTimes(1);
					});
				},
			);

			ffTest.on(
				'astral_units_workspace_host_resolver',
				'when the resolver gate is ON and the resolver is Idle (cold mount)',
				() => {
					it('holds loading state and does not fall through to the legacy getWorkspaceId()', async () => {
						mockGetMeta.mockReturnValue(cloudIdFromMeta);
						mockUseAssetsWorkspaceHost.mockReturnValue(resolverIdle());
						const { result } = renderHook(() => useAssetsClient(initialParameters));
						await Promise.resolve();
						expect(result.current.assetsClientLoading).toBe(true);
						expect(mockGetWorkspaceId).not.toHaveBeenCalled();
						expect(mockFetchObjectSchemas).not.toHaveBeenCalled();
					});
				},
			);

			ffTest.off(
				'astral_units_workspace_host_resolver',
				'when the resolver gate is OFF and the resolver is Idle',
				() => {
					it('proceeds to call the legacy getWorkspaceId() (Idle guard is gate-conditional)', async () => {
						mockGetMeta.mockReturnValue(cloudIdFromMeta);
						mockUseAssetsWorkspaceHost.mockReturnValue(resolverIdle());
						const { result } = renderHook(() => useAssetsClient(initialParameters));
						await waitFor(() => {
							expect(result.current.workspaceId).toEqual(workspaceId);
						});
						expect(mockGetWorkspaceId).toHaveBeenCalledTimes(1);
					});
				},
			);
		});
	});
});

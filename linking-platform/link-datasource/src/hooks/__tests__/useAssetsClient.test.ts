import { act, renderHook } from '@testing-library/react-hooks';

import { asMock } from '@atlaskit/link-test-helpers/jest';

import { fetchObjectSchema, getWorkspaceId } from '../../services/cmdbService';
import { ObjectSchema } from '../../types/assets/types';
import { useAssetsClient } from '../useAssetsClient';

jest.mock('../../services/cmdbService');

describe('useAssetsClient', () => {
  const workspaceId = 'workspaceId';
  const schemaName = 'schemaName';
  const schemaId = 'schemaId';
  const initialParameters = {
    aql: '',
    cloudId: '',
    schemaId,
  };
  const mockGetWorkspaceId = asMock(getWorkspaceId);
  const mockFetchObjectSchema = asMock(fetchObjectSchema);

  beforeEach(() => {
    jest.resetAllMocks();
    mockGetWorkspaceId.mockResolvedValue(workspaceId);
    mockFetchObjectSchema.mockResolvedValue({ name: schemaName, id: schemaId });
  });

  it('should fetch workspaceId when mounted', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useAssetsClient(initialParameters),
    );
    await waitForNextUpdate();
    expect(result.current.workspaceId).toEqual(workspaceId);
    expect(mockFetchObjectSchema).toHaveBeenCalledWith(
      workspaceId,
      initialParameters.schemaId,
    );
    expect(result.current.objectSchema).toMatchObject({
      name: schemaName,
      id: schemaId,
    });
  });

  it('should fetch object schema when initital schema id in parameters exists', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useAssetsClient(initialParameters),
    );
    await waitForNextUpdate();
    expect(result.current.workspaceId).toEqual(workspaceId);
    expect(mockFetchObjectSchema).toHaveBeenCalledWith(
      workspaceId,
      initialParameters.schemaId,
    );
    expect(result.current.objectSchema).toMatchObject({
      name: schemaName,
      id: schemaId,
    });
  });

  it('should swallow fetchObjectSchema error when call rejects', async () => {
    const mockError = new Error();
    mockFetchObjectSchema.mockRejectedValue(mockError);
    const { result, waitForNextUpdate } = renderHook(() =>
      useAssetsClient(initialParameters),
    );
    await waitForNextUpdate();
    expect(result.current.workspaceId).toEqual(workspaceId);
    expect(mockFetchObjectSchema).toHaveBeenCalledWith(
      workspaceId,
      initialParameters.schemaId,
    );
    expect(result.current.objectSchema).toEqual(undefined);
  });

  it('should return an error when getWorkspaceId rejects', async () => {
    const mockError = new Error();
    mockGetWorkspaceId.mockRejectedValue(mockError);
    const { result, waitForNextUpdate } = renderHook(() => useAssetsClient());
    await waitForNextUpdate();
    expect(mockFetchObjectSchema).not.toHaveBeenCalled();
    expect(result.current.workspaceError).toBe(mockError);
  });

  it('should return a newly constructed error when getWorkspaceId rejects with a non error type', async () => {
    const mockError = { error: 'fake error message' };
    mockGetWorkspaceId.mockRejectedValue(mockError);
    const { result, waitForNextUpdate } = renderHook(() => useAssetsClient());
    await waitForNextUpdate();
    expect(mockFetchObjectSchema).not.toHaveBeenCalled();
    expect(result.current.workspaceError?.message).toEqual(
      `Unexpected error occured`,
    );
  });

  it('should correctly set assetsClientLoading', async () => {
    let fetchObjectSchemaPromise: (
      value: ObjectSchema | PromiseLike<ObjectSchema>,
    ) => void = () => {};
    const deferredPromise = new Promise(
      resolve => (fetchObjectSchemaPromise = resolve),
    );
    mockFetchObjectSchema.mockReturnValue(deferredPromise);
    const { result, waitForNextUpdate } = renderHook(() =>
      useAssetsClient(initialParameters),
    );
    expect(result.current.assetsClientLoading).toBe(true);
    act(() => {
      fetchObjectSchemaPromise({ name: schemaName, id: schemaId });
    });
    await waitForNextUpdate();
    expect(result.current.assetsClientLoading).toBe(false);
  });
});

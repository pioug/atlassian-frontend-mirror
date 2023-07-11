import { renderHook } from '@testing-library/react-hooks';

import { asMock } from '@atlaskit/link-test-helpers/jest';

import {
  fetchObjectSchemas,
  getWorkspaceId,
  validateAql,
} from '../../services/cmdbService';
import { useAssetsClient } from '../useAssetsClient';

jest.mock('../../services/cmdbService');

describe('useAssetsClient', () => {
  const workspaceId = 'workspaceId';
  const mockObjectSchemaResponse = {
    values: [],
  };

  // eslint-disable-next-line no-console
  const consoleError = console.error;

  beforeEach(() => {
    jest.resetAllMocks();
    asMock(getWorkspaceId).mockResolvedValue(workspaceId);
    asMock(validateAql).mockResolvedValue({ isValid: true });
    asMock(fetchObjectSchemas).mockResolvedValue(mockObjectSchemaResponse);
    // eslint-disable-next-line no-console
    console.error = jest.fn();
  });

  afterEach(() => {
    // eslint-disable-next-line no-console
    console.error = consoleError;
  });

  it.each(['hostname', undefined])(
    'should fetch workspaceId and object schemas when mounted and hostname is %s',
    async hostname => {
      const { result, waitForNextUpdate } = renderHook(() =>
        useAssetsClient(hostname),
      );
      await waitForNextUpdate();
      expect(getWorkspaceId).toHaveBeenCalledWith(hostname);
      expect(fetchObjectSchemas).toHaveBeenCalledWith(workspaceId, hostname);
      expect(result.current.workspaceId).toEqual(workspaceId);
      expect(result.current.objectSchemas).toEqual(
        mockObjectSchemaResponse.values,
      );
    },
  );

  it('should return an error if workspace fetch fails', async () => {
    const mockError = new Error();
    asMock(getWorkspaceId).mockRejectedValue(mockError);
    const { result, waitForNextUpdate } = renderHook(() => useAssetsClient());
    await waitForNextUpdate();
    expect(result.current.error).toBe(mockError);
  });

  it('should return an error if object schemas fetch fails', async () => {
    const mockError = new Error('test error');
    asMock(fetchObjectSchemas).mockRejectedValue(mockError);
    const { result, waitForNextUpdate } = renderHook(() => useAssetsClient());
    await waitForNextUpdate();
    expect(result.current.error).toBe(mockError);
  });

  it('should return a newly constructed error if non Error type error is thrown', async () => {
    const mockError = { error: 'fake error message' };
    asMock(fetchObjectSchemas).mockRejectedValue(mockError);
    const { result, waitForNextUpdate } = renderHook(() => useAssetsClient());
    await waitForNextUpdate();
    expect(result.current.error?.message).toEqual(`Unexpected error occured`);
    // eslint-disable-next-line no-console
    expect(console.error).toBeCalledWith({
      error: 'fake error message',
    });
  });
});

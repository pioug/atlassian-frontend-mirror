import { renderHook } from '@testing-library/react-hooks';
import { mocked } from 'ts-jest/utils';
import { useSmartLinkClientExtension } from '@atlaskit/link-client-extension';
import { SmartLinkActionType } from '@atlaskit/linking-types/smart-link-actions';
import type { InvokeRequest } from '@atlaskit/linking-types/smart-link-actions';

import useInvoke from '../index';

jest.mock('@atlaskit/link-provider', () => ({
  useSmartLinkContext: jest.fn().mockReturnValue({
    connections: { client: {} },
  }),
}));

jest.mock('@atlaskit/link-client-extension', () => ({
  useSmartLinkClientExtension: jest.fn(),
}));

describe('useInvoke', () => {
  const request: InvokeRequest = {
    action: {
      actionType: SmartLinkActionType.GetStatusTransitionsAction,
      resourceIdentifiers: {
        issueKey: 'issue-id',
        hostname: 'some-hostname',
      },
    },
    providerKey: 'object-provider',
  };

  it('makes request to client extension', async () => {
    const mockInvoke = jest.fn();
    mocked(useSmartLinkClientExtension).mockReturnValue({ invoke: mockInvoke });

    const { result } = renderHook(() => useInvoke());

    await result.current(request);

    expect(mockInvoke).toHaveBeenCalledTimes(1);
    expect(mockInvoke).toHaveBeenCalledWith(request);
  });

  it('returns response', async () => {
    const expectedResponse = { a: 'invoke-response' };
    const mockInvoke = jest.fn().mockResolvedValueOnce(expectedResponse);
    mocked(useSmartLinkClientExtension).mockReturnValue({ invoke: mockInvoke });

    const { result } = renderHook(() => useInvoke());

    const response = await result.current(request);

    expect(response).toBe(expectedResponse);
  });

  it('executes callback function', async () => {
    const expectedResponse = { b: 'transform-response' };
    const callback = jest.fn().mockReturnValue(expectedResponse);
    mocked(useSmartLinkClientExtension).mockReturnValue({
      invoke: jest.fn().mockResolvedValueOnce({ a: 'invoke-response' }),
    });

    const { result } = renderHook(() => useInvoke());

    const response = await result.current(request, callback);

    expect(response).toBe(expectedResponse);
  });
});

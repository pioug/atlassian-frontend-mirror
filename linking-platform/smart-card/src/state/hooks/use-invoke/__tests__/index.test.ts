import { renderHook } from '@testing-library/react-hooks';
import { mocked } from 'ts-jest/utils';
import { useSmartLinkClientExtension } from '@atlaskit/link-client-extension';
import { SmartLinkActionType } from '@atlaskit/linking-types/smart-link-actions';
import type { InvokeRequest } from '@atlaskit/linking-types/smart-link-actions';
import 'jest-extended';

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

  describe('trackers', () => {
    const mockStarted = jest.fn();
    const mockSuccess = jest.fn();
    const mockFailed = jest.fn();
    const tracker = {
      started: mockStarted,
      success: mockSuccess,
      failed: mockFailed,
    };
    afterEach(() => {
      jest.clearAllMocks();
    });
    it.each([
      SmartLinkActionType.GetStatusTransitionsAction,
      SmartLinkActionType.StatusUpdateAction,
      'some-new-actin-type',
    ])(
      'calls started and success tracker on invoke success for %s',
      async (actionType) => {
        const mockInvoke = jest.fn();
        mocked(useSmartLinkClientExtension).mockReturnValue({
          invoke: mockInvoke,
        });

        const { result } = renderHook(() => useInvoke(tracker));
        const req = {
          ...request,
          action: {
            ...request.action,
            actionType: actionType as SmartLinkActionType,
          },
        };
        await result.current(req);

        expect(mockStarted).toHaveBeenCalledTimes(1);
        expect(mockStarted).toHaveBeenCalledWith({
          smartLinkActionType: actionType,
        });
        expect(mockStarted).toHaveBeenCalledBefore(mockSuccess);
        expect(mockInvoke).toHaveBeenCalledWith(req);
        expect(mockSuccess).toHaveBeenCalledTimes(1);
        expect(mockSuccess).toHaveBeenCalledWith({
          smartLinkActionType: actionType,
        });
        expect(mockInvoke).toHaveBeenCalledBefore(mockSuccess);
        expect(mockFailed).toHaveBeenCalledTimes(0);
      },
    );

    it('calls started and failed tracker on invoke failure', async () => {
      const mockInvoke = jest.fn();
      mockInvoke.mockRejectedValue(new Error(''));
      mocked(useSmartLinkClientExtension).mockReturnValue({
        invoke: mockInvoke,
      });

      const { result } = renderHook(() => useInvoke(tracker));

      await expect(result.current(request)).toReject();

      expect(mockStarted).toHaveBeenCalledTimes(1);
      expect(mockStarted).toHaveBeenCalledWith({
        smartLinkActionType: request.action.actionType,
      });
      expect(mockStarted).toHaveBeenCalledBefore(mockFailed);
      expect(mockInvoke).toHaveBeenCalledWith(request);
      expect(mockFailed).toHaveBeenCalledTimes(1);
      expect(mockFailed).toHaveBeenCalledWith({
        smartLinkActionType: request.action.actionType,
      });
      expect(mockInvoke).toHaveBeenCalledBefore(mockFailed);
      expect(mockSuccess).toHaveBeenCalledTimes(0);
    });
  });
});

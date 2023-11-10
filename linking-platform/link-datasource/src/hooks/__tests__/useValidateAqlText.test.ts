import { act, renderHook } from '@testing-library/react-hooks';

import { asMock } from '@atlaskit/link-test-helpers/jest';

import { validateAql } from '../../services/cmdbService';
import { AqlValidateResponse } from '../../types/assets/types';
import {
  AqlValidationResponse,
  useValidateAqlText,
} from '../useValidateAqlText';

jest.mock('../../services/cmdbService');

describe('useValidateAqlText', () => {
  const workspaceId = 'workspaceId';
  const aqlText = 'hello';

  const mockValidateAql = asMock(validateAql);
  const mockAqlValidateResponse = {
    isValid: true,
    errorMessages: [''],
    errors: {},
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return initial state on mount', async () => {
    const { result } = renderHook(() => useValidateAqlText(workspaceId));
    expect(result.current.isValidAqlText).toEqual(false);
    expect(result.current.validateAqlTextError).toEqual(undefined);
    expect(result.current.validateAqlTextLoading).toEqual(false);
    expect(result.current.validateAqlText).toEqual(expect.any(Function));
  });

  it.each([true, false])(
    'should return correct boolean when validateAql response is "%s"',
    async expectedIsValid => {
      mockValidateAql.mockResolvedValue({
        ...mockAqlValidateResponse,
        isValid: expectedIsValid,
      });
      const { result } = renderHook(() => useValidateAqlText(workspaceId));
      const validateAqlText = result.current.validateAqlText;
      let validateAqlTextResponse: AqlValidationResponse | undefined;
      await act(async () => {
        validateAqlTextResponse = await validateAqlText(aqlText);
      });
      expect(mockValidateAql).toBeCalledWith(workspaceId, { qlQuery: aqlText });
      expect(validateAqlTextResponse?.isValid).toBe(expectedIsValid);
      expect(result.current.isValidAqlText).toEqual(expectedIsValid);
      expect(result.current.validateAqlTextError).toEqual(undefined);
    },
  );

  it('should return false and an error when validateAql rejects', async () => {
    const mockError = new Error();
    mockValidateAql.mockRejectedValue(mockError);
    const { result, waitForNextUpdate } = renderHook(() =>
      useValidateAqlText(workspaceId),
    );
    act(() => {
      result.current.validateAqlText(aqlText);
    });
    await waitForNextUpdate();
    expect(result.current.isValidAqlText).toBe(false);
    expect(result.current.validateAqlTextError).toBe(mockError);
  });

  it('should return false and an error when validateAql rejects with a non error type', async () => {
    const mockError = { error: 'fake error message' };
    mockValidateAql.mockRejectedValue(mockError);
    const { result, waitForNextUpdate } = renderHook(() =>
      useValidateAqlText(workspaceId),
    );
    act(() => {
      result.current.validateAqlText(aqlText);
    });
    await waitForNextUpdate();
    expect(result.current.isValidAqlText).toBe(false);
    expect(result.current.validateAqlTextError?.message).toEqual(
      `Unexpected error occured`,
    );
  });

  it('should return false and an error message when validateAql return error iql message in server response', async () => {
    mockValidateAql.mockResolvedValue({
      ...mockAqlValidateResponse,
      isValid: false,
      errors: {
        iql: 'A validation error message',
      },
    });
    const { result } = renderHook(() => useValidateAqlText(workspaceId));
    const validateAqlText = result.current.validateAqlText;
    let validateAqlTextResponse: AqlValidationResponse | undefined;
    await act(async () => {
      validateAqlTextResponse = await validateAqlText(aqlText);
    });
    expect(validateAqlTextResponse?.isValid).toBe(false);
    expect(validateAqlTextResponse?.message).toBe('A validation error message');
    expect(result.current.isValidAqlText).toBe(false);
  });

  it('should correctly set validateAqlTextLoading when validateAql is called', async () => {
    let validateAqlResolveFn: (
      value: AqlValidateResponse | PromiseLike<AqlValidateResponse>,
    ) => void = () => {};
    const deferredPromise = new Promise(
      resolve => (validateAqlResolveFn = resolve),
    );
    mockValidateAql.mockReturnValue(deferredPromise);
    const { result, waitForNextUpdate } = renderHook(() =>
      useValidateAqlText(workspaceId),
    );

    const validateAqlText = result.current.validateAqlText;
    act(() => {
      validateAqlText(aqlText);
    });
    expect(result.current.validateAqlTextLoading).toBe(true);
    act(() => {
      validateAqlResolveFn(mockAqlValidateResponse);
    });
    await waitForNextUpdate();
    expect(result.current.validateAqlTextLoading).toBe(false);
  });
});

import { waitFor } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';

import { asMock } from '@atlaskit/link-test-helpers/jest';

import { validateAql } from '../../services/cmdbService';
import { SEARCH_DEBOUNCE, useValidateAqlText } from '../useValidateAqlText';

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
  const mockFireEvent = expect.any(Function);

  beforeEach(() => {
    jest.resetAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should set the validation result to idle when initial query is empty', () => {
    const { result } = renderHook(() => useValidateAqlText(workspaceId, ''));
    expect(result.current.lastValidationResult.type).toEqual('idle');
  });

  it('should set the validation result to loading when initial query is NOT empty', () => {
    const { result } = renderHook(() =>
      useValidateAqlText(workspaceId, aqlText),
    );
    expect(result.current.lastValidationResult).toEqual(
      expect.objectContaining({
        type: 'loading',
      }),
    );
  });

  it('should not call the validation if the query is emtpy', async () => {
    const { result } = renderHook(() => useValidateAqlText(workspaceId, ''));
    await act(async () => {
      result.current.debouncedValidation('');
      jest.advanceTimersByTime(SEARCH_DEBOUNCE);
    });
    await waitFor(() => {
      expect(mockValidateAql).not.toHaveBeenCalled();
      expect(result.current.lastValidationResult.type).toEqual('idle');
    });
  });

  it('should update the query correctly if entered after the debounce time', async () => {
    const { result } = renderHook(() => useValidateAqlText(workspaceId, ''));

    await act(async () => {
      result.current.debouncedValidation(aqlText);
      jest.advanceTimersByTime(SEARCH_DEBOUNCE);
    });
    await waitFor(() => {
      expect(mockValidateAql).toHaveBeenCalledTimes(1);
    });

    await act(async () => {
      result.current.debouncedValidation('new query');
      jest.advanceTimersByTime(SEARCH_DEBOUNCE);
    });
    await waitFor(() => {
      expect(mockValidateAql).toHaveBeenCalledTimes(2);
    });
  });

  it('should correctly set loading state and debounce the query validation call', async () => {
    const { result } = renderHook(() => useValidateAqlText(workspaceId, ''));
    expect(result.current.lastValidationResult).toEqual(
      expect.objectContaining({
        type: 'idle',
      }),
    );
    await act(async () => {
      result.current.debouncedValidation(aqlText);
    });
    expect(result.current.lastValidationResult).toEqual(
      expect.objectContaining({
        type: 'loading',
      }),
    );
    await act(async () => {
      result.current.debouncedValidation(`${aqlText}asdasd`);
      result.current.debouncedValidation(`${aqlText}asd8a90`);
      result.current.debouncedValidation(`${aqlText}80823`);
      jest.advanceTimersByTime(400);
    });
    await waitFor(() => {
      expect(mockValidateAql).toHaveBeenCalledTimes(1);
    });
  });

  it('should return valid when validateAql returns isValid = true', async () => {
    mockValidateAql.mockResolvedValue(mockAqlValidateResponse);
    const { result } = renderHook(() => useValidateAqlText(workspaceId, ''));
    const validateAqlText = result.current.validateAqlText;
    let validateAqlTextResponse: 'error' | undefined;
    await act(async () => {
      validateAqlTextResponse = await validateAqlText(aqlText);
    });
    await waitFor(() => {
      expect(result.current.lastValidationResult).toEqual(
        expect.objectContaining({
          type: 'valid',
          validatedAql: aqlText,
        }),
      );
      expect(validateAqlTextResponse).toEqual(undefined);
      expect(mockValidateAql).toHaveBeenCalledWith(
        workspaceId,
        { qlQuery: aqlText },
        mockFireEvent,
      );
    });
  });

  it('should return invalid when validateAql rejects', async () => {
    const mockError = new Error();
    mockValidateAql.mockRejectedValue(mockError);
    const { result } = renderHook(() => useValidateAqlText(workspaceId, ''));
    const validateAqlText = result.current.validateAqlText;
    let validateAqlTextResponse: 'error' | undefined;
    await act(async () => {
      validateAqlTextResponse = await validateAqlText(aqlText);
    });
    await waitFor(() => {
      expect(result.current.lastValidationResult).toEqual(
        expect.objectContaining({
          type: 'invalid',
          error: '',
        }),
      );
      expect(validateAqlTextResponse).toEqual('error');
    });
  });

  it('should return invalid when validateAql rejects with a non error type', async () => {
    const mockError = { error: 'fake error message' };
    mockValidateAql.mockRejectedValue(mockError);
    const { result } = renderHook(() => useValidateAqlText(workspaceId, ''));
    const validateAqlText = result.current.validateAqlText;
    let validateAqlTextResponse: 'error' | undefined;
    await act(async () => {
      validateAqlTextResponse = await validateAqlText(aqlText);
    });
    await waitFor(() => {
      expect(result.current.lastValidationResult).toEqual(
        expect.objectContaining({
          type: 'invalid',
          error: '',
        }),
      );
      expect(validateAqlTextResponse).toEqual('error');
    });
  });

  it('should return invalid when validateAql returns isValid = false', async () => {
    mockValidateAql.mockResolvedValue({
      ...mockAqlValidateResponse,
      isValid: false,
    });
    const { result } = renderHook(() => useValidateAqlText(workspaceId, ''));
    const validateAqlText = result.current.validateAqlText;
    let validateAqlTextResponse: 'error' | undefined;
    await act(async () => {
      validateAqlTextResponse = await validateAqlText(aqlText);
    });
    await waitFor(() => {
      expect(result.current.lastValidationResult).toEqual(
        expect.objectContaining({
          type: 'invalid',
          error: '',
        }),
      );
      expect(validateAqlTextResponse).toEqual('error');
    });
  });

  it('should return invalid and an error message when validateAql return error iql message in server response', async () => {
    mockValidateAql.mockResolvedValue({
      ...mockAqlValidateResponse,
      isValid: false,
      errors: {
        iql: 'A validation error message',
      },
    });
    const { result } = renderHook(() => useValidateAqlText(workspaceId, ''));
    const validateAqlText = result.current.validateAqlText;
    let validateAqlTextResponse: 'error' | undefined;
    await act(async () => {
      validateAqlTextResponse = await validateAqlText(aqlText);
    });
    await waitFor(() => {
      expect(result.current.lastValidationResult).toEqual(
        expect.objectContaining({
          type: 'invalid',
          error: 'A validation error message',
        }),
      );
      expect(validateAqlTextResponse).toEqual('error');
    });
  });
});

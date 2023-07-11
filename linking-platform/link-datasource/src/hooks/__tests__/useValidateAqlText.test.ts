import { act, renderHook } from '@testing-library/react-hooks';

import { asMock } from '@atlaskit/link-test-helpers/jest';

import { validateAql } from '../../services/cmdbService';
import { AqlValidateResponse } from '../../types/assets/types';
import { useValidateAqlText } from '../useValidateAqlText';

jest.mock('../../services/cmdbService');

describe('useValidateAqlText', () => {
  const hostname = 'hostname';
  const workspaceId = 'workspaceId';

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it.each([
    [workspaceId, hostname],
    [workspaceId, undefined],
  ])(
    'should return initial state when hostname is %s and workspaceId is %s',
    (workspaceId, hostname?) => {
      const { result } = renderHook(() =>
        useValidateAqlText(workspaceId, hostname),
      );
      expect(result.current.isLoading).toEqual(false);
      expect(result.current.validateAqlText).toEqual(expect.any(Function));
    },
  );

  describe('validateAqlText', () => {
    it.each([true, false])(
      'should return correctly if validateAql isValid is "%s"',
      async expectedIsValid => {
        asMock(validateAql).mockResolvedValue({ isValid: expectedIsValid });
        const { result } = renderHook(() =>
          useValidateAqlText(workspaceId, 'hostname'),
        );
        const validateAqlText = result.current.validateAqlText;
        let actualIsValid: boolean = !expectedIsValid;
        await act(async () => {
          actualIsValid = await validateAqlText('hello');
        });
        expect(validateAql).toBeCalledWith(
          workspaceId,
          { qlQuery: 'hello' },
          'hostname',
        );
        expect(actualIsValid).toBe(expectedIsValid);
      },
    );

    it('should correctly set isLoading when method is called', async () => {
      let validateAqlResolveFn: (
        value: AqlValidateResponse | PromiseLike<AqlValidateResponse>,
      ) => void = () => {};
      const deferredPromise = new Promise(
        resolve => (validateAqlResolveFn = resolve),
      );
      asMock(validateAql).mockReturnValue(deferredPromise);
      const { result, waitForNextUpdate } = renderHook(() =>
        useValidateAqlText(workspaceId, 'hostname'),
      );

      const validateAqlText = result.current.validateAqlText;
      act(() => {
        validateAqlText('hello');
      });
      expect(result.current.isLoading).toBe(true);
      act(() => {
        validateAqlResolveFn({
          isValid: true,
          errorMessages: [''],
          errors: {},
        });
      });
      await waitForNextUpdate();
      expect(result.current.isLoading).toBe(false);
    });
  });
});

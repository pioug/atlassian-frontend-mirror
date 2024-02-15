import { useCallback, useRef, useState } from 'react';

import { useDatasourceAnalyticsEvents } from '../analytics';
import { validateAql } from '../services/cmdbService';

type IdleResult = {
  type: 'idle';
};
type LoadingResult = {
  type: 'loading';
};
export type ValidResult = {
  type: 'valid';
  validatedAql: string;
};
export type InvalidResult = {
  type: 'invalid';
  error: string;
};
export type AqlValidationResult =
  | IdleResult
  | LoadingResult
  | ValidResult
  | InvalidResult;

export type AqlValidationResponse = {
  isValid: boolean;
  message: string | null;
};

export type UseValidateAqlTextState = {
  debouncedValidation: (
    value: string | undefined,
  ) => Promise<string | undefined>;
  validateAqlText: (aql: string) => Promise<'error' | undefined>;
  lastValidationResult: AqlValidationResult;
};

export const SEARCH_DEBOUNCE = 350;

export const useValidateAqlText = (
  workspaceId: string,
  initialValue: string,
): UseValidateAqlTextState => {
  const timeout = useRef<Function>();
  const lastValue = useRef<string | undefined>('');

  const lastResult = useRef<Promise<string | undefined>>(
    Promise.resolve(undefined),
  );
  const [lastValidationResult, setLastValidationResult] =
    useState<AqlValidationResult>(
      initialValue.trim() === '' ? { type: 'idle' } : { type: 'loading' },
    );
  const { fireEvent } = useDatasourceAnalyticsEvents();

  // We return undefined when valid and 'error' when invalid
  const validateAqlText = useCallback(
    async (aql: string | undefined) => {
      if (aql?.trim()) {
        try {
          const validateAqlResponse = await validateAql(
            workspaceId,
            { qlQuery: aql },
            fireEvent,
          );
          if (validateAqlResponse.isValid) {
            setLastValidationResult({ type: 'valid', validatedAql: aql });
            return undefined;
          } else {
            setLastValidationResult({
              type: 'invalid',
              error: validateAqlResponse.errors?.iql ?? '',
            });
            return 'error';
          }
        } catch (err) {
          setLastValidationResult({
            type: 'invalid',
            error: '',
          });
          return 'error';
        }
      }
      setLastValidationResult({ type: 'idle' });
      return undefined;
    },
    [workspaceId, fireEvent],
  );

  /* Debounce async validation for input, validation is also called on every field change
  in a form so we need to also memoize. The async validate function is expected to either:
  Immediately return a promise (which is then collected into an array, every single time validation is run),
  or immediately return either undefined or an error message */
  const debouncedValidation = (value: string | undefined) =>
    new Promise<string | undefined>(resolve => {
      if (timeout.current) {
        timeout.current();
      }

      if (value !== lastValue.current) {
        setLastValidationResult({ type: 'loading' });
        const timerId = setTimeout(() => {
          lastValue.current = value;
          lastResult.current = validateAqlText(value);
          resolve(lastResult.current);
        }, SEARCH_DEBOUNCE);
        timeout.current = () => {
          clearTimeout(timerId);
          resolve('debouncing');
        };
      } else {
        resolve(lastResult.current);
      }
    });

  return {
    debouncedValidation,
    validateAqlText,
    lastValidationResult,
  };
};

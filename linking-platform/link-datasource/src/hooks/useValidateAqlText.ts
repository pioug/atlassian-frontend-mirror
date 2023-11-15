import { useCallback, useState } from 'react';

import { useDatasourceAnalyticsEvents } from '../analytics';
import { validateAql } from '../services/cmdbService';

export type AqlValidationResponse = {
  isValid: boolean;
  message: string | null;
};

export type UseValidateAqlTextState = {
  validateAqlTextLoading: boolean;
  validateAqlTextError: Error | undefined;
  isValidAqlText: boolean;
  validateAqlText: (aql: string) => Promise<AqlValidationResponse>;
};

export const useValidateAqlText = (
  workspaceId: string,
): UseValidateAqlTextState => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isValidAqlText, setIsValidAqlText] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>();
  const { fireEvent } = useDatasourceAnalyticsEvents();

  const validateAqlText = useCallback(
    async (aql: string) => {
      setLoading(true);
      setError(undefined);
      let isValid = false;
      let message = null;
      try {
        const validateAqlResponse = await validateAql(
          workspaceId,
          { qlQuery: aql },
          fireEvent,
        );
        setIsValidAqlText(validateAqlResponse.isValid);
        isValid = validateAqlResponse.isValid;
        message = validateAqlResponse.errors?.iql || null;
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error('Unexpected error occured'));
        }
      } finally {
        setLoading(false);
      }
      return {
        isValid,
        message,
      };
    },
    [workspaceId, fireEvent],
  );

  return {
    isValidAqlText,
    validateAqlText,
    validateAqlTextLoading: loading,
    validateAqlTextError: error,
  };
};

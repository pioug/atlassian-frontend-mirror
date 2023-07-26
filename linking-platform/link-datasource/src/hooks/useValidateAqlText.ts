import { useCallback, useState } from 'react';

import { validateAql } from '../services/cmdbService';

export type UseValidateAqlTextState = {
  validateAqlTextLoading: boolean;
  validateAqlTextError: Error | undefined;
  isValidAqlText: boolean;
  validateAqlText: (aql: string) => Promise<boolean>;
};

export const useValidateAqlText = (
  workspaceId: string,
  hostname?: string,
): UseValidateAqlTextState => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isValidAqlText, setIsValidAqlText] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>();

  const validateAqlText = useCallback(
    async (aql: string) => {
      setLoading(true);
      setError(undefined);
      let isValid = false;
      try {
        const validateAqlResponse = await validateAql(workspaceId, {
          qlQuery: aql,
        });
        setIsValidAqlText(validateAqlResponse.isValid);
        isValid = validateAqlResponse.isValid;
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error('Unexpected error occured'));
        }
      } finally {
        setLoading(false);
      }
      return isValid;
    },
    [workspaceId],
  );

  return {
    isValidAqlText,
    validateAqlText,
    validateAqlTextLoading: loading,
    validateAqlTextError: error,
  };
};

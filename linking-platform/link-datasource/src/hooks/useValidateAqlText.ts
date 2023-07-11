import { useCallback, useState } from 'react';

import { validateAql } from '../services/cmdbService';

export const useValidateAqlText = (workspaceId: string, hostname?: string) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateAqlText = useCallback(
    async (aql: string) => {
      setIsLoading(true);
      const validateAqlResponse = await validateAql(
        workspaceId,
        { qlQuery: aql },
        hostname,
      );
      setIsLoading(false);

      return validateAqlResponse.isValid;
    },
    [hostname, workspaceId],
  );

  return {
    validateAqlText,
    isLoading,
  };
};

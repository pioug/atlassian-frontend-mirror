import { useCallback, useState } from 'react';

import { fetchObjectSchemas } from '../services/cmdbService';
import { ObjectSchema } from '../types/assets/types';

export type UseObjectSchemasState = {
  objectSchemasLoading: boolean;
  objectSchemasError: Error | undefined;
  objectSchemas: ObjectSchema[] | undefined;
  fetchObjectSchemas: (query: string) => Promise<ObjectSchema[] | undefined>;
};

export const useObjectSchemas = (
  workspaceId: string,
): UseObjectSchemasState => {
  const [loading, setLoading] = useState<boolean>(false);
  const [objectSchemas, setObjectSchemas] = useState<
    ObjectSchema[] | undefined
  >();
  const [error, setError] = useState<Error | undefined>();

  const request = useCallback(
    async (query: string) => {
      setLoading(true);
      setError(undefined);
      let fetchedObjectSchemas;
      try {
        const fetchedObjectSchemasResponse = await fetchObjectSchemas(
          workspaceId,
          query,
        );
        setObjectSchemas(fetchedObjectSchemasResponse.values);
        fetchedObjectSchemas = fetchedObjectSchemasResponse.values;
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error('Unexpected error occured'));
        }
      } finally {
        setLoading(false);
      }
      return fetchedObjectSchemas;
    },
    [workspaceId],
  );

  return {
    objectSchemasLoading: loading,
    objectSchemasError: error,
    objectSchemas,
    fetchObjectSchemas: request,
  };
};

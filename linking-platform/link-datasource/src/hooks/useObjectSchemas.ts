import { useCallback, useState } from 'react';

import { fetchObjectSchemas } from '../services/cmdbService';
import { ObjectSchema } from '../types/assets/types';

export type FetchObjectSchemasDetails = Pick<
  UseObjectSchemasState,
  'objectSchemas' | 'totalObjectSchemas'
>;

export type UseObjectSchemasState = {
  objectSchemasLoading: boolean;
  objectSchemasError: Error | undefined;
  objectSchemas: ObjectSchema[] | undefined;
  totalObjectSchemas: number | undefined;
  fetchObjectSchemas: (query: string) => Promise<FetchObjectSchemasDetails>;
};

export const useObjectSchemas = (
  workspaceId: string,
): UseObjectSchemasState => {
  const [loading, setLoading] = useState<boolean>(false);
  const [objectSchemas, setObjectSchemas] = useState<
    ObjectSchema[] | undefined
  >();
  const [totalObjectSchemas, setTotalObjectSchemas] = useState<
    number | undefined
  >();
  const [error, setError] = useState<Error | undefined>();

  const request = useCallback(
    async (query: string) => {
      setLoading(true);
      setError(undefined);
      let fetchedObjectSchemas;
      let fetchTotalObjectSchemas;
      try {
        const fetchedObjectSchemasResponse = await fetchObjectSchemas(
          workspaceId,
          query,
        );
        setObjectSchemas(fetchedObjectSchemasResponse.values);
        setTotalObjectSchemas(fetchedObjectSchemasResponse.total);
        fetchedObjectSchemas = fetchedObjectSchemasResponse.values;
        fetchTotalObjectSchemas = fetchedObjectSchemasResponse.total;
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
        objectSchemas: fetchedObjectSchemas,
        totalObjectSchemas: fetchTotalObjectSchemas,
      };
    },
    [workspaceId],
  );

  return {
    objectSchemasLoading: loading,
    objectSchemasError: error,
    objectSchemas,
    totalObjectSchemas,
    fetchObjectSchemas: request,
  };
};

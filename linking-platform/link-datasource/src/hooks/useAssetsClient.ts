import { useEffect, useState } from 'react';

import { fetchObjectSchemas, getWorkspaceId } from '../services/cmdbService';
import { ObjectSchema } from '../types/assets/types';

// TODO: Pass in localhost:3000 for testing locally - remember to remove this code after
// You must also have a proxy server running to forward requests from http://localhost:3000 to a JSM premium url
export const useAssetsClient = (hostname?: string) => {
  const [objectSchemas, setObjectSchemas] = useState<ObjectSchema[]>();
  const [workspaceId, setWorkspaceId] = useState<string>();
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    (async () => {
      try {
        const workspaceId = await getWorkspaceId(hostname);

        const objectSchemasResponse = await fetchObjectSchemas(
          workspaceId,
          hostname,
        );

        setWorkspaceId(workspaceId);
        setObjectSchemas(objectSchemasResponse.values);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error('Unexpected error occured'));
          // eslint-disable-next-line no-console
          console.error(err);
        }
      }
    })();
  }, [hostname]);

  return {
    workspaceId,
    objectSchemas,
    error,
  };
};

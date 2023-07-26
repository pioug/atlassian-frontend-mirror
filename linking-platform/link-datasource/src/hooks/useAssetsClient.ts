import { useEffect, useState } from 'react';

import { fetchObjectSchema, getWorkspaceId } from '../services/cmdbService';
import { ObjectSchema } from '../types/assets/types';
import { AssetsDatasourceParameters } from '../ui/assets-modal/types';

export type UseAssetsClientState = {
  workspaceId: string | undefined;
  workspaceError: Error | undefined;
  objectSchema: ObjectSchema | undefined;
  assetsClientLoading: boolean;
};

export const useAssetsClient = (
  initialParameters?: AssetsDatasourceParameters,
): UseAssetsClientState => {
  const [loading, setLoading] = useState<boolean>(false);
  const [workspaceId, setWorkspaceId] = useState<string | undefined>();
  const [objectSchema, setObjectSchema] = useState<ObjectSchema | undefined>();
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(undefined);
      try {
        const workspaceId = await getWorkspaceId();
        setWorkspaceId(workspaceId);
        // Check schema from initial parameters still exists and fetch name for schema select
        if (initialParameters?.schemaId) {
          try {
            const fetchedObjectSchema = await fetchObjectSchema(
              workspaceId,
              initialParameters?.schemaId,
            );
            setObjectSchema(fetchedObjectSchema);
          } catch {
            // Could update this to check if status is 404 and set objectSchemaError
          }
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error('Unexpected error occured'));
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [initialParameters]);

  return {
    workspaceId,
    workspaceError: error,
    objectSchema,
    assetsClientLoading: loading,
  };
};

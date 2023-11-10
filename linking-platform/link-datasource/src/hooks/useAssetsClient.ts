import { useEffect, useState } from 'react';

import {
  fetchObjectSchema,
  fetchObjectSchemas,
  getWorkspaceId,
} from '../services/cmdbService';
import { ObjectSchema } from '../types/assets/types';
import { AssetsDatasourceParameters } from '../ui/assets-modal/types';

export type UseAssetsClientState = {
  workspaceId: string | undefined;
  workspaceError: Error | undefined;
  existingObjectSchema: ObjectSchema | undefined;
  existingObjectSchemaError: Error | undefined;
  objectSchemas: ObjectSchema[] | undefined;
  objectSchemasError: Error | undefined;
  totalObjectSchemas: number | undefined;
  assetsClientLoading: boolean;
};

const handleAssetsClientErrors = (
  errorSetter: React.Dispatch<React.SetStateAction<Error | undefined>>,
  error: unknown,
) => {
  if (error instanceof Error) {
    errorSetter(error);
  } else {
    errorSetter(new Error('Unexpected error occured'));
  }
};

export const useAssetsClient = (
  initialParameters?: AssetsDatasourceParameters,
): UseAssetsClientState => {
  const [loading, setLoading] = useState<boolean>(false);
  const [workspaceId, setWorkspaceId] = useState<string | undefined>();
  const [workspaceError, setWorkspaceError] = useState<Error | undefined>();
  const [existingObjectSchema, setExistingObjectSchema] = useState<
    ObjectSchema | undefined
  >();
  const [existingObjectSchemaError, setExistingObjectSchemaError] = useState<
    Error | undefined
  >();
  const [objectSchemas, setObjectSchemas] = useState<
    ObjectSchema[] | undefined
  >();
  const [totalObjectSchemas, setTotalObjectSchemas] = useState<
    number | undefined
  >();
  const [objectSchemasError, setObjectSchemasError] = useState<
    Error | undefined
  >();

  /*
   * We wrap this in nested try/catch blocks because we want to handle
   * workspaceError/existingObjectSchemaError/objectSchemasError differently
   * if we need to implement more initial data fetching/errors we should look at a store
   */
  useEffect(() => {
    (async () => {
      setLoading(true);
      setWorkspaceError(undefined);
      try {
        const workspaceId = await getWorkspaceId();
        setWorkspaceId(workspaceId);
        // Check schema from initial parameters still exists and fetch name/permissions for schema select
        if (initialParameters?.schemaId) {
          try {
            const fetchedObjectSchema = await fetchObjectSchema(
              workspaceId,
              initialParameters?.schemaId,
            );
            setExistingObjectSchema(fetchedObjectSchema);
          } catch (fetchObjectSchemaError) {
            handleAssetsClientErrors(
              setExistingObjectSchemaError,
              fetchObjectSchemaError,
            );
          }
        }
        try {
          const fetchedObjectSchemasResponse = await fetchObjectSchemas(
            workspaceId,
          );
          setObjectSchemas(fetchedObjectSchemasResponse.values);
          setTotalObjectSchemas(fetchedObjectSchemasResponse.total);
        } catch (fetchObjectSchemasError) {
          handleAssetsClientErrors(
            setObjectSchemasError,
            fetchObjectSchemasError,
          );
        }
      } catch (getWorkspaceIdError) {
        handleAssetsClientErrors(setWorkspaceError, getWorkspaceIdError);
      } finally {
        setLoading(false);
      }
    })();
  }, [initialParameters]);

  return {
    workspaceId,
    workspaceError,
    existingObjectSchema,
    existingObjectSchemaError,
    objectSchemas,
    totalObjectSchemas,
    objectSchemasError,
    assetsClientLoading: loading,
  };
};

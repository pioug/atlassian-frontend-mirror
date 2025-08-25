import { useEffect, useState } from 'react';

import { useDatasourceAnalyticsEvents } from '../analytics';
import { fetchObjectSchema, fetchObjectSchemas, getWorkspaceId } from '../services/cmdbService';
import { type ObjectSchema } from '../types/assets/types';
import { type AssetsDatasourceParameters } from '../ui/assets-modal/types';

export type UseAssetsClientState = {
	assetsClientLoading: boolean;
	existingObjectSchema: ObjectSchema | undefined;
	existingObjectSchemaError: Error | undefined;
	objectSchemas: ObjectSchema[] | undefined;
	objectSchemasError: Error | undefined;
	totalObjectSchemas: number | undefined;
	workspaceError: Error | undefined;
	workspaceId: string | undefined;
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
	const [existingObjectSchema, setExistingObjectSchema] = useState<ObjectSchema | undefined>();
	const [existingObjectSchemaError, setExistingObjectSchemaError] = useState<Error | undefined>();
	const [objectSchemas, setObjectSchemas] = useState<ObjectSchema[] | undefined>();
	const [totalObjectSchemas, setTotalObjectSchemas] = useState<number | undefined>();
	const [objectSchemasError, setObjectSchemasError] = useState<Error | undefined>();
	const { fireEvent } = useDatasourceAnalyticsEvents();

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
				const workspaceId = await getWorkspaceId(fireEvent);
				setWorkspaceId(workspaceId);
				// Check schema from initial parameters still exists and fetch name/permissions for schema select
				if (initialParameters?.schemaId) {
					try {
						const fetchedObjectSchema = await fetchObjectSchema(
							workspaceId,
							initialParameters?.schemaId,
							fireEvent,
						);
						setExistingObjectSchema(fetchedObjectSchema);
					} catch (fetchObjectSchemaError) {
						handleAssetsClientErrors(setExistingObjectSchemaError, fetchObjectSchemaError);
					}
				}
				try {
					const fetchedObjectSchemasResponse = await fetchObjectSchemas(
						workspaceId,
						undefined,
						fireEvent,
					);
					setObjectSchemas(fetchedObjectSchemasResponse.values);
					setTotalObjectSchemas(fetchedObjectSchemasResponse.total);
				} catch (fetchObjectSchemasError) {
					handleAssetsClientErrors(setObjectSchemasError, fetchObjectSchemasError);
				}
			} catch (getWorkspaceIdError) {
				handleAssetsClientErrors(setWorkspaceError, getWorkspaceIdError);
			} finally {
				setLoading(false);
			}
		})();
	}, [initialParameters, fireEvent]);

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

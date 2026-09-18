import { request } from '@atlaskit/linking-common/api';

import { type FetchObjectSchemaResponse, type ObjectSchema } from '../types/assets/types';
import type { AnalyticsFireEvent } from './cmdbService';
import { FetchError } from './FetchError';
import { getStatusCodeGroup } from './getStatusCodeGroup';
import { mapFetchErrors } from './mapFetchErrors';
import { PermissionError } from './PermissionError';

export const fetchObjectSchema = async (
	workspaceId: string,
	schemaId: string,
	fireEvent?: AnalyticsFireEvent,
): Promise<ObjectSchema> => {
	const url = `/gateway/api/jsm/assets/workspace/${workspaceId}/v1/objectschema/${schemaId}`;
	try {
		const response = await request<FetchObjectSchemaResponse>(
			'get',
			url,
			undefined,
			undefined,
			[200, 201, 202, 203, 204],
		);
		fireEvent && fireEvent('operational.objectSchema.success', {});
		return response;
	} catch (err) {
		let error = mapFetchErrors(err);
		if (error instanceof FetchError) {
			fireEvent &&
				fireEvent('operational.objectSchema.failed', {
					statusCodeGroup: getStatusCodeGroup(error),
				});
			if (error.statusCode === 401 || error.statusCode === 403) {
				error = new PermissionError('Failed to fetch object schemas');
			}
		}
		throw error;
	}
};

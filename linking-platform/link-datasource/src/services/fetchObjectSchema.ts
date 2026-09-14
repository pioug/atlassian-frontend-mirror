import { request } from '@atlaskit/linking-common/api';

import { type FetchObjectSchemaResponse, type ObjectSchema } from '../types/assets/types';

import { FetchError } from './FetchError';
import { PermissionError } from './PermissionError';
import type { AnalyticsFireEvent } from './cmdbService';
import { getStatusCodeGroup } from './getStatusCodeGroup';
import { mapFetchErrors } from './mapFetchErrors';

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

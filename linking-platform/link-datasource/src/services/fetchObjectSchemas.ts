import { request } from '@atlaskit/linking-common/api';

import { type FetchObjectSchemasResponse } from '../types/assets/types';
import type { AnalyticsFireEvent } from './cmdbService';
import { FetchError } from './FetchError';
import { getStatusCodeGroup } from './getStatusCodeGroup';
import { mapFetchErrors } from './mapFetchErrors';
import { PermissionError } from './PermissionError';

export const fetchObjectSchemas = async (
	workspaceId: string,
	query?: string,
	fireEvent?: AnalyticsFireEvent,
): Promise<FetchObjectSchemasResponse> => {
	const queryParams = new URLSearchParams();
	queryParams.set('maxResults', '20');
	queryParams.set('includeCounts', 'false');
	query && queryParams.set('query', query);
	const url = `/gateway/api/jsm/assets/workspace/${workspaceId}/v1/objectschema/list?${queryParams}`;
	try {
		const response = await request<FetchObjectSchemasResponse>(
			'get',
			url,
			undefined,
			undefined,
			[200, 201, 202, 203, 204],
		);
		fireEvent && fireEvent('operational.objectSchemas.success', {});
		return response;
	} catch (err) {
		let error = mapFetchErrors(err);
		if (error instanceof FetchError) {
			fireEvent &&
				fireEvent('operational.objectSchemas.failed', {
					statusCodeGroup: getStatusCodeGroup(error),
				});
			if (error.statusCode === 401 || error.statusCode === 403) {
				error = new PermissionError('Failed to fetch object schemas');
			}
		}
		throw error;
	}
};

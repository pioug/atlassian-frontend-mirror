import { request } from '@atlaskit/linking-common/api';

import { type GetWorkspaceDetailsResponse } from '../types/assets/types';

import { FetchError } from './FetchError';
import { PermissionError } from './PermissionError';
import type { AnalyticsFireEvent } from './cmdbService';
import { getStatusCodeGroup } from './getStatusCodeGroup';
import { mapFetchErrors } from './mapFetchErrors';

export const getWorkspaceId = async (fireEvent?: AnalyticsFireEvent): Promise<string> => {
	const url = '/rest/servicedesk/cmdb/latest/workspace';

	try {
		const workspaceDetailsResponse = await request<GetWorkspaceDetailsResponse>(
			'get',
			url,
			undefined,
			undefined,
			[200, 201, 202, 203, 204],
		);
		if (!workspaceDetailsResponse.results?.length) {
			throw new PermissionError('No workspace results found');
		}
		fireEvent && fireEvent('operational.getWorkspaceId.success', {});
		return workspaceDetailsResponse.results[0].id;
	} catch (err) {
		let error = mapFetchErrors(err);
		if (error instanceof FetchError) {
			fireEvent &&
				fireEvent('operational.getWorkspaceId.failed', {
					statusCodeGroup: getStatusCodeGroup(error),
				});
			// Only 429 and5xx errors will be treated as FetchErrors otherwise PermissionError
			if (getStatusCodeGroup(error) !== '5xx' && error.statusCode !== 429) {
				error = new PermissionError('Failed to fetch workspace');
			}
		}
		throw error;
	}
};

import { request } from '@atlaskit/linking-common/api';

import { type AqlValidateResponse } from '../types/assets/types';
import type { AnalyticsFireEvent } from './cmdbService';
import { FetchError } from './FetchError';
import { getStatusCodeGroup } from './getStatusCodeGroup';
import { mapFetchErrors } from './mapFetchErrors';
import { PermissionError } from './PermissionError';

export const validateAql = async (
	workspaceId: string,
	data: { qlQuery: string },
	fireEvent?: AnalyticsFireEvent,
): Promise<AqlValidateResponse> => {
	const url = `/gateway/api/jsm/assets/workspace/${workspaceId}/v1/aql/validate`;
	try {
		const response = await request<AqlValidateResponse>(
			'post',
			url,
			{
				qlQuery: data.qlQuery,
				context: 'SMART_LINKS',
			},
			undefined,
			[200, 201, 202, 203, 204],
		);
		fireEvent && fireEvent('operational.validateAql.success', {});
		return response;
	} catch (err) {
		let error = mapFetchErrors(err);
		if (error instanceof FetchError) {
			fireEvent &&
				fireEvent('operational.validateAql.failed', {
					statusCodeGroup: getStatusCodeGroup(error),
				});
			if (error.statusCode === 401 || error.statusCode === 403) {
				error = new PermissionError('Failed to fetch object schemas');
			}
		}
		throw error;
	}
};

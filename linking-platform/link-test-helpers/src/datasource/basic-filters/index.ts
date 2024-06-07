import fetchMock from 'fetch-mock/cjs/client';

import {
	fieldValuesEmptyResponse,
	fieldValuesErrorResponse,
	fieldValuesResponseForAssignees,
	fieldValuesResponseForProjects,
	fieldValuesResponseForProjectsMoreData,
	fieldValuesResponseForStatuses,
	fieldValuesResponseForTypes,
	hydrateJqlStandardResponseForVRTesting,
	successfuluserHydrationResponse,
	successfulUserQueryResponse,
} from './mocks';

export const mockBasicFilterAGGFetchRequests = () => {
	fetchMock.post(new RegExp(`/graphql`), async (_url: string, details: any) => {
		return new Promise((resolve) => {
			const requestBody = JSON.parse(details.body);

			// CLOL basic filter - edited/created by
			if (requestBody.operationName === 'userQuery') {
				return resolve(successfulUserQueryResponse);
			}

			if (requestBody.operationName === 'userHydration') {
				return resolve(successfuluserHydrationResponse);
			}

			// JLOL basic filter hydration for VR testing
			if (requestBody.operationName === 'hydrate') {
				return resolve(hydrateJqlStandardResponseForVRTesting);
			}

			const filterType: string = requestBody.variables.jqlTerm;
			const searchString: string = requestBody.variables.searchString;
			const pageCursor: string = requestBody.variables.after;

			const mockBasicFilterData: Record<string, any> = {
				project: fieldValuesResponseForProjects,
				assignee: fieldValuesResponseForAssignees,
				type: fieldValuesResponseForTypes,
				status: fieldValuesResponseForStatuses,
			};

			const resolveData = {
				data: mockBasicFilterData[filterType]?.data || [],
			};

			// playwright test specifically requesting more projects data
			if (pageCursor) {
				resolve(fieldValuesResponseForProjectsMoreData);
			}

			// slowing down specifically for vr testing
			if (searchString === 'loading-message') {
				setTimeout(() => {
					resolve(resolveData);
				}, 5000);
			} // returning empty response for vr testing
			else if (searchString === 'empty-message') {
				resolve(fieldValuesEmptyResponse);
			} // returning error response for vr testing
			else if (searchString === 'error-message') {
				resolve(fieldValuesErrorResponse);
			} else {
				resolve(resolveData);
			}
		});
	});
};

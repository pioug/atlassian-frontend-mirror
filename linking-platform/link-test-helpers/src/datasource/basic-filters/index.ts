import fetchMock from 'fetch-mock/cjs/client';

import {
  fieldValuesEmptyResponse,
  fieldValuesErrorResponse,
  fieldValuesResponseForAssignees,
  fieldValuesResponseForProjects,
  fieldValuesResponseForProjectsMoreData,
  fieldValuesResponseForStatuses,
  fieldValuesResponseForTypes,
} from './mocks';

export const mockBasicFilterAGGFetchRequests = () => {
  fetchMock.post(new RegExp(`/graphql`), async (_url: string, details: any) => {
    return new Promise(resolve => {
      const requestBody = JSON.parse(details.body);
      const filterType: string = requestBody.variables.jqlTerm;
      const searchString: string = requestBody.variables.searchString;
      const pageCursor: string = requestBody.variables.after;

      const mockBasicFilterData: Record<string, any> = {
        project: fieldValuesResponseForProjects,
        assignee: fieldValuesResponseForAssignees,
        issuetype: fieldValuesResponseForTypes,
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
      if (searchString.includes('loading')) {
        setTimeout(() => {
          resolve(resolveData);
        }, 5000);
      } // returning empty response for vr testing
      else if (searchString.includes('empty')) {
        resolve(fieldValuesEmptyResponse);
      } // returning error response for vr testing
      else if (searchString.includes('error')) {
        resolve(fieldValuesErrorResponse);
      } else {
        resolve(resolveData);
      }
    });
  });
};

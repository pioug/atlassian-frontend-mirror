import fetchMock from 'fetch-mock/cjs/client';

import {
  fieldValuesResponseForAssignees,
  fieldValuesResponseForProjects,
  fieldValuesResponseForStatuses,
  fieldValuesResponseForTypes,
} from './mocks';

export const mockBasicFilterAGGFetchRequests = () => {
  fetchMock.post(new RegExp(`/graphql`), async (_url: string, details: any) => {
    return new Promise(resolve => {
      const requestBody = JSON.parse(details.body);
      const filterType: string = requestBody.variables.jqlTerm;

      const mockBasicFilterData: Record<string, any> = {
        project: fieldValuesResponseForProjects,
        assignee: fieldValuesResponseForAssignees,
        issuetype: fieldValuesResponseForTypes,
        status: fieldValuesResponseForStatuses,
      };

      resolve({
        data: mockBasicFilterData[filterType]?.data || [],
      });
    });
  });
};

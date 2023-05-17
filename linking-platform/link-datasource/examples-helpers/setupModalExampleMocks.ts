import fetchMock from 'fetch-mock/cjs/client';

import { mockAutoCompleteData } from './mockAutocompleteData';
import { mockSiteData } from './mockJiraAvailableSites';
import { mockSuggestionData } from './mockSuggestionData';

export const setupModalExampleMocks = () => {
  fetchMock.mock('/gateway/api/available-sites', async () =>
    Promise.resolve({ sites: mockSiteData }),
  );

  // /gateway/api/ex/jira/:cloudId//rest/api/latest/jql/autocompletedata
  fetchMock.mock(
    /\/gateway\/api\/ex\/jira\/.+\/\/rest\/api\/latest\/jql\/autocompletedata/g,
    async () =>
      new Promise(resolve => {
        setTimeout(() => resolve(mockAutoCompleteData), 150);
      }),
  );

  // /gateway/api/ex/jira/:cloudId//rest/api/latest/jql/autocompletedata/suggestions?fieldName=:fieldName&fieldValue=:fieldValue
  fetchMock.mock(
    /\/gateway\/api\/ex\/jira\/.+\/\/rest\/api\/latest\/jql\/autocompletedata\/suggestions\?.+/g,
    async () =>
      new Promise(resolve => {
        setTimeout(() => resolve(mockSuggestionData), 150);
      }),
  );
};

// Calling it on module level once for any number of imports
setupModalExampleMocks();

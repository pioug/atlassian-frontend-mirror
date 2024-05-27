import { useEffect } from 'react';

import fetchMock from 'fetch-mock/cjs/client';

import { EntityType, type UserSearchResponse } from '@atlaskit/smart-common';

import { mockUserSearchData } from './mock-urs-data';

const mockEndpoints = () => {
  // http://www.wheresrhys.co.uk/fetch-mock/#usageconfiguration
  // Unmatched routes will fallback to the network
  fetchMock.config.fallbackToNetwork = true;

  const userRecommendationsResponse = (): UserSearchResponse => {
    return {
      recommendedUsers: mockUserSearchData
        .filter(() => Math.random() < 0.7)
        .map(({ id, name, avatarUrl = '', nickname }) => ({
          entityType: EntityType.USER,
          id,
          name,
          avatarUrl,
          nickname,
        })),
      errors: [],
    };
  };

  fetchMock.mock(
    {
      functionMatcher: (url: string) => {
        return url === '/gateway/api/v1/recommendations';
      },
    },
    () => userRecommendationsResponse(),
    { method: 'POST', overwriteRoutes: false },
  );
};

// Simple hook for using inside example pages, which sets up the mock API responses, and then
// un-sets the mock API responses when the example is exited.
export const useEndpointMocks = () => {
  useEffect(() => {
    mockEndpoints();
    return () => fetchMock.reset();
  }, []);
};

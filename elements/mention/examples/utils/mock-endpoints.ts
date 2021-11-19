import { useEffect } from 'react';
import fetchMock from 'fetch-mock/cjs/client';
import { randomMentions } from '../../example-helpers';
import {
  EntityType,
  RecommendationResponse,
} from '../../src/api/SmartMentionTypes';
import { MentionsResult } from '../../src/types';
import { ApiClientResponse } from '../../src/default-mention-name-resolver/default-mention-name-resolver';

const mockEndpoints = () => {
  // http://www.wheresrhys.co.uk/fetch-mock/#usageconfiguration
  // Unmatched routes will fallback to the network
  fetchMock.config.fallbackToNetwork = true;

  const graphqlProfileLookupResponse = (): { data: ApiClientResponse } => ({
    data: {
      users: [
        {
          name: 'Demo user',
          accountId: '655363:724d1c89-a70d-4153-9ee3-0415d514b5c6',
        },
      ],
    },
  });

  fetchMock.mock(
    new RegExp('/gateway/api/graphql'),
    () => graphqlProfileLookupResponse(),
    { method: 'POST', overwriteRoutes: false },
  );

  const userRecommendationsResponse = (): RecommendationResponse => {
    return {
      recommendedUsers: randomMentions().map(
        ({ id, name, avatarUrl = '', nickname }) => ({
          entityType: EntityType.USER,
          id,
          name,
          avatarUrl,
          nickname,
        }),
      ),
      errors: [],
    };
  };

  fetchMock.mock(
    new RegExp('/gateway/api/v1/recommendations'),
    () => userRecommendationsResponse(),
    { method: 'POST', overwriteRoutes: false },
  );

  const getMentionSearchResponse = (): MentionsResult => {
    return {
      query: '',
      mentions: randomMentions().map(
        ({ id, name, mentionName, nickname, avatarUrl }) => ({
          id,
          name,
          mentionName,
          nickname,
          avatarUrl,
        }),
      ),
    };
  };

  fetchMock.mock(
    new RegExp('/gateway/bootstrap'),
    () => getMentionSearchResponse(),
    { method: 'GET', overwriteRoutes: false },
  );

  fetchMock.mock(
    new RegExp('/gateway/search'),
    () => getMentionSearchResponse(),
    { method: 'GET', overwriteRoutes: false },
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

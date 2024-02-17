import { useEffect, useState } from 'react';
import fetchMock from 'fetch-mock/cjs/client';
import { mentions as mentionsData } from '@atlaskit/util-data-test/mention-story-data';
import { EntityType, RecommendationResponse } from '../src/types';
import { ApiClientResponse } from '../src/service/users-client';
import { LegionResponse } from '../src/service/teams-client';
import { users } from './users';
import { teams } from './teams';

export const randomMentions = () =>
  mentionsData.filter(() => Math.random() < 0.7);

const mockEndpoints = (failRecommendations: boolean) => {
  // Unmatched routes will fallback to the network
  fetchMock.config.fallbackToNetwork = true;

  const userRecommendationsResponse = (): RecommendationResponse => {
    return {
      recommendedUsers: randomMentions().map(
        ({ id, name, avatarUrl = '', nickname, nonLicensedUser }) => ({
          entityType: EntityType.USER,
          id,
          name,
          avatarUrl,
          nickname,
          nonLicensedUser,
        }),
      ),
      errors: [],
    };
  };

  if (failRecommendations) {
    fetchMock.mock(new RegExp('/gateway/api/v1/recommendations'), 500);
  } else {
    fetchMock.mock(
      new RegExp('/gateway/api/v1/recommendations'),
      () =>
        new Promise((resolve) => {
          setTimeout(resolve, 250);
        }).then(() => userRecommendationsResponse()),
      { method: 'POST', overwriteRoutes: false },
    );
  }

  const graphqlProfileLookupResponse = (): { data: ApiClientResponse } => ({
    data: {
      users: users.map((user) => ({
        name: user.displayName,
        accountId: user.accountId,
        picture: user.profilePicture.path,
      })),
    },
  });

  fetchMock.mock(new RegExp('/graphql'), () => graphqlProfileLookupResponse(), {
    method: 'POST',
    overwriteRoutes: false,
  });

  // Teams
  fetchMock.mock(
    new RegExp('/gateway/api/v3/teams/.+'),
    (url: string): LegionResponse | 500 => {
      const teamId = url.split('/').pop();
      const team = teams.find((t) => t.id === teamId);
      return team
        ? { id: team.id, displayName: team.name, smallAvatarImageUrl: '' }
        : 500;
    },
    {
      method: 'GET',
      overwriteRoutes: false,
    },
  );
};

// Simple hook for using inside example pages, which sets up the mock API responses, and then
// un-sets the mock API responses when the example is exited.
export const useEndpointMocks = ({ failRecommendations = false } = {}) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setReady(true);
    }, 250);
  }, []);

  useEffect(() => {
    mockEndpoints(failRecommendations);
    return () => fetchMock.reset();
  }, [failRecommendations]);

  return { ready };
};

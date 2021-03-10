import type { ProfileClientOptions, Team } from '../types';
import { teamRequestAnalytic } from '../util/analytics';
import { getPageTime } from '../util/performance';

import CachingClient from './CachingClient';
import { graphqlQuery } from './graphqlUtils';

/**
 * @param  {string} userId
 * @param  {string} cloudId
 * @return {string} GraphQL Query String
 */
const buildTeamQuery = (teamId: string) => ({
  query: `query Team($teamId: String!) {
    Team: Team(teamId: $teamId) {
      id,
      description,
      displayName,
      largeHeaderImageUrl,
      smallHeaderImageUrl,
      largeAvatarImageUrl,
      smallAvatarImageUrl,
      members {
        id,
        fullName,
        avatarUrl,
      },
    }
  }`,
  variables: {
    teamId,
  },
});

export default class TeamProfileCardClient extends CachingClient<Team> {
  options: ProfileClientOptions;

  constructor(options: ProfileClientOptions) {
    super(options);
    this.options = options;
  }

  makeRequest(teamId: string): Promise<Team> {
    if (!this.options.url) {
      throw new Error('config.url is a required parameter for fetching teams');
    }

    const query = buildTeamQuery(teamId);

    return graphqlQuery<{ Team: Team }>(this.options.url, query).then(
      data => data.Team,
    );
  }

  getProfile(
    teamId: string,
    orgId?: string,
    analytics?: (event: Record<string, any>) => void,
  ): Promise<Team> {
    if (!teamId) {
      return Promise.reject(new Error('teamId is missing'));
    }

    const cache = this.getCachedProfile(teamId);

    if (cache) {
      return Promise.resolve(cache);
    }

    return new Promise((resolve, reject) => {
      const startTime = getPageTime();

      if (analytics) {
        analytics(teamRequestAnalytic('triggered'));
      }

      this.makeRequest(teamId)
        .then((data: Team) => {
          if (this.cache) {
            this.setCachedProfile(teamId, data);
          }
          if (analytics) {
            analytics(
              teamRequestAnalytic('succeeded', {
                duration: getPageTime() - startTime,
              }),
            );
          }
          resolve(data);
        })
        .catch(error => {
          if (analytics) {
            analytics(
              teamRequestAnalytic('failed', {
                duration: getPageTime() - startTime,
              }),
            );
          }
          reject(error);
        });
    });
  }
}

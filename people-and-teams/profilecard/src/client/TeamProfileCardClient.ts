import { AnalyticsEventPayload } from '@atlaskit/analytics-next';

import type { ProfileClientOptions, Team } from '../types';
import { teamRequestAnalytics } from '../util/analytics';
import { getPageTime } from '../util/performance';

import CachingClient from './CachingClient';
import { getErrorAttributes } from './errorUtils';
import { getTeamFromAGG } from './getTeamFromAGG';
import { GraphQLError } from './graphqlUtils';

export default class TeamProfileCardClient extends CachingClient<Team> {
  options: ProfileClientOptions;

  constructor(options: ProfileClientOptions) {
    super(options);
    this.options = options;
  }

  makeRequest(teamId: string, _orgId: string | undefined): Promise<Team> {
    if (!this.options.gatewayGraphqlUrl) {
      throw new Error(
        'Trying to fetch via gateway with no specified config.gatewayGraphqlUrl',
      );
    }

    return getTeamFromAGG(this.options.gatewayGraphqlUrl, teamId);
  }

  getProfile(
    teamId: string,
    orgId: string | undefined,
    analytics?: (event: AnalyticsEventPayload) => void,
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
        analytics(teamRequestAnalytics('triggered'));
      }

      this.makeRequest(teamId, orgId)
        .then((data: Team) => {
          if (this.cache) {
            this.setCachedProfile(teamId, data);
          }
          if (analytics) {
            analytics(
              teamRequestAnalytics('succeeded', {
                duration: getPageTime() - startTime,
                gateway: true,
              }),
            );
          }
          resolve(data);
        })
        .catch((error: GraphQLError) => {
          if (analytics) {
            analytics(
              teamRequestAnalytics('failed', {
                duration: getPageTime() - startTime,
                ...getErrorAttributes(error),
                gateway: true,
              }),
            );
          }
          reject(error);
        });
    });
  }
}

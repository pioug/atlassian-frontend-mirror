import {
  ProfileClientOptions,
  ReportingLinesUser,
  TeamCentralReportingLinesData,
} from '../types';

import CachingClient from './CachingClient';
import { graphqlQuery } from './graphqlUtils';

const buildReportingLinesQuery = (aaid: string) => ({
  query: `
    fragment ReportingLinesUserPII on UserPII {
      name
      picture
    }

    fragment ReportingLinesUserFragment on ReportingLinesUser {
      accountIdentifier
      identifierType
      pii {
        ...ReportingLinesUserPII
      }
    }

    query ReportingLines($aaid: String) {
      reportingLines(aaidOrHash: $aaid) {
        managers {
          ...ReportingLinesUserFragment
        }
        reports {
          ...ReportingLinesUserFragment
        }
      }
    }
  `,
  variables: {
    aaid,
  },
});

type TeamCentralCardClientOptions = ProfileClientOptions & {
  teamCentralUrl: string;
};

class TeamCentralCardClient extends CachingClient<
  TeamCentralReportingLinesData
> {
  options: TeamCentralCardClientOptions;
  /**
   * Simple circuit breaker to avoid making unnecessary calls to Team Central on auth failures
   * This is to handle the case where products may have provided teamCentralUrl, but the site itself
   * doesn't actually have any TC product.
   *
   * There's currently no way to reset this circuit breaker, but that's fine. This is meant to
   * catch a pretty specific edge case.
   */
  bypassOnFailure: boolean;

  constructor(options: TeamCentralCardClientOptions) {
    super(options);
    this.options = options;
    this.bypassOnFailure = false;
  }

  async makeRequest(userId: string) {
    if (!this.options.teamCentralUrl) {
      throw new Error(
        'options.teamCentralUrl is a required parameter for retrieving Team Central data',
      );
    }

    const query = buildReportingLinesQuery(userId);

    const response = await graphqlQuery<{
      reportingLines: TeamCentralReportingLinesData;
    }>(this.options.teamCentralUrl, query);

    return response.reportingLines;
  }

  getReportingLines(userId: string): Promise<TeamCentralReportingLinesData> {
    if (!userId) {
      return Promise.reject(new Error('userId missing'));
    }

    const cache = this.getCachedProfile(userId);

    if (cache) {
      return Promise.resolve(cache);
    }

    if (this.bypassOnFailure) {
      return Promise.resolve({});
    }

    return new Promise((resolve) => {
      this.makeRequest(userId)
        .then((data: TeamCentralReportingLinesData) => {
          const enhancedData = {
            managers: this.filterReportingLinesUser(data?.managers),
            reports: this.filterReportingLinesUser(data?.reports),
          };
          if (this.cache) {
            this.setCachedProfile(userId, enhancedData);
          }
          resolve(enhancedData);
        })
        .catch((error: any) => {
          if (error?.status === 401 || error?.status === 403) {
            // Trigger circuit breaker
            this.bypassOnFailure = true;
          }

          /**
           * Reporting lines aren't part of the critical path of profile card.
           * Just resolve with empty values instead of bubbling up the error.
           */
          resolve({});
        });
    });
  }

  private filterReportingLinesUser(
    users: ReportingLinesUser[] = [],
  ): ReportingLinesUser[] {
    return users.filter((user) => user.identifierType === 'ATLASSIAN_ID');
  }
}

export default TeamCentralCardClient;

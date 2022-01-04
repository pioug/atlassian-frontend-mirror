import {
  ClientOverrides,
  ProfileClientOptions,
  TeamCentralReportingLinesData,
} from '../types';

import TeamCentralCardClient from './TeamCentralCardClient';
import TeamProfileCardClient from './TeamProfileCardClient';
import UserProfileCardClient from './UserProfileCardClient';

class ProfileCardClient {
  userClient: UserProfileCardClient;
  teamClient: TeamProfileCardClient;
  tcClient?: TeamCentralCardClient;

  constructor(config: ProfileClientOptions, clients?: ClientOverrides) {
    this.userClient = clients?.userClient || new UserProfileCardClient(config);
    this.teamClient = clients?.teamClient || new TeamProfileCardClient(config);
    this.tcClient = maybeCreateTeamCentralClient(config, clients);
  }

  flushCache() {
    this.userClient.flushCache();
    this.teamClient.flushCache();
    this.tcClient?.flushCache();
  }

  getProfile(cloudId: string, userId: string): Promise<any> {
    return this.userClient.getProfile(cloudId, userId);
  }

  getTeamProfile(
    teamId: string,
    orgId?: string,
    analytics?: (event: Record<string, any>) => void,
  ) {
    return this.teamClient.getProfile(teamId, orgId, analytics);
  }

  getReportingLines(userId: string): Promise<TeamCentralReportingLinesData> {
    return (
      this.tcClient?.getReportingLines(userId) ||
      Promise.resolve({
        managers: [],
        reports: [],
      })
    );
  }
}

function maybeCreateTeamCentralClient(
  config: ProfileClientOptions,
  clients?: ClientOverrides,
) {
  if (clients?.teamCentralClient) {
    return clients.teamCentralClient;
  }
  const teamCentralUrl = config.teamCentralUrl;
  return teamCentralUrl
    ? new TeamCentralCardClient({ ...config, teamCentralUrl })
    : undefined;
}

export default ProfileCardClient;

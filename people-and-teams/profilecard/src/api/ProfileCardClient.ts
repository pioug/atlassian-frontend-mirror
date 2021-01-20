import { ClientOverrides, ProfileClientOptions } from '../types';
import UserProfileCardClient from './UserProfileCardClient';
import TeamProfileCardClient from './TeamProfileCardClient';

class ProfileCardClient {
  userClient: UserProfileCardClient;
  teamClient: TeamProfileCardClient;

  constructor(config: ProfileClientOptions, clients?: ClientOverrides) {
    this.userClient = clients?.userClient || new UserProfileCardClient(config);
    this.teamClient = clients?.teamClient || new TeamProfileCardClient(config);
  }

  flushCache() {
    this.userClient.flushCache();
    this.teamClient.flushCache();
  }

  getProfile(cloudId: string, userId: string): Promise<any> {
    return this.userClient.getProfile(cloudId, userId);
  }

  getTeamProfile(teamId: string, orgId?: string) {
    return this.teamClient.getProfile(teamId, orgId);
  }
}

export default ProfileCardClient;

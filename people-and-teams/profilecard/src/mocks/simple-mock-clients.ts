import ProfileCardClient from '../client/ProfileCardClient';
import TeamProfileCardClient from '../client/TeamProfileCardClient';
import UserProfileCardClient from '../client/UserProfileCardClient';
import { ProfileCardClientData, Team } from '../types';

import profiles from './profile-data';
import teamData from './team-data';
import { getTimeString, getWeekday } from './util';

class SimpleMockTeamClient extends TeamProfileCardClient {
  makeRequest(teamId: string): Promise<Team> {
    const simpleMockTeam = teamData({
      members: 5,
    });

    return Promise.resolve({
      teamId,
      ...simpleMockTeam,
    });
  }
}

class SimpleMockUserClient extends UserProfileCardClient {
  makeRequest(cloudId: string, userId: string): Promise<ProfileCardClientData> {
    const profile = profiles[0];

    const weekday = getWeekday();
    const data: any = { ...profile };

    data.remoteTimeString = getTimeString();
    data.remoteWeekdayIndex = weekday.index;
    data.remoteWeekdayString = weekday.string;

    return Promise.resolve(data);
  }
}

const args = { cacheSize: 10, maxCacheAge: 0, url: '/graphql/directory' };
export const simpleMockUserClient = new SimpleMockUserClient(args);
export const simpleMockTeamClient = new SimpleMockTeamClient(args);

export const simpleProfileClient = new ProfileCardClient(args, {
  userClient: simpleMockUserClient,
  teamClient: simpleMockTeamClient,
});

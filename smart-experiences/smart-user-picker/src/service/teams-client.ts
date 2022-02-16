import { Team } from '@atlaskit/user-picker';

import { getConfig } from '../config';
import { UNKNOWN_TEAM } from './constants';

type LegionRequest = {
  baseUrl?: string;
  id: string;
};

export type LegionResponse = {
  id: string;
  displayName: string;
  smallAvatarImageUrl: string;
};

const transformTeam = (team: LegionResponse, id: string): Team => {
  return {
    id,
    name: team.displayName,
    type: 'team',
    avatarUrl: team.smallAvatarImageUrl,
  };
};

const hydrateTeamFromLegion = (request: LegionRequest): Promise<Team> => {
  const url = `${getConfig().getTeamsUrl(request.baseUrl)}/${request.id}`;
  return fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
    },
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }

      return Promise.reject({
        message: `error calling Legion, statusCode=${response.status}, statusText=${response.statusText}`,
      });
    })
    .then((response: LegionResponse) => {
      return transformTeam(response, request.id);
    })
    .catch(() => ({
      ...UNKNOWN_TEAM, // on network error, return original team with label 'Unknown'
      id: request.id,
    }));
};

export default hydrateTeamFromLegion;

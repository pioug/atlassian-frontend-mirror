import type { Team } from '../types';

import { graphqlQuery } from './graphqlUtils';

interface AGGTeam extends Omit<Team, 'members'> {
  members?: {
    nodes: AGGMember[];
  };
}

interface AGGMember {
  member: {
    accountId: string;
    name: string;
    picture: string;
  };
}

interface AGGResult {
  team: AGGTeam;
}

export const extractIdFromAri = (ari: string) => {
  const slashPos = ari.indexOf('/');
  const id = ari.slice(slashPos + 1);
  return id;
};

export const idToAri = (teamId: string) => {
  return `ari:cloud:teams::team/${teamId}`;
};

export const convertTeam = (result: AGGResult): Team => {
  const { team } = result;
  return {
    ...team,
    id: extractIdFromAri(team.id),
    members: team.members?.nodes.map(({ member }) => ({
      id: member.accountId,
      fullName: member.name,
      avatarUrl: member.picture,
    })),
  };
};

const GATEWAY_QUERY = `query TeamCard($teamId: ID!) {
  Team: team {
    team (id: $teamId) {
      id
      displayName
      description
      smallHeaderImageUrl
      largeHeaderImageUrl
      smallAvatarImageUrl
      largeAvatarImageUrl
      members {
        nodes {
          member {
            accountId
            name
            picture
          }
        }
      }
    }
  }
}`;

export const buildGatewayQuery = (teamId: string) => ({
  query: GATEWAY_QUERY,
  variables: { teamId: idToAri(teamId) },
});

export const addExperimentalHeaders = (headers: Headers): Headers => {
  headers.append('X-ExperimentalApi', 'teams-beta');
  headers.append('X-ExperimentalApi', 'team-members-beta');

  return headers;
};

export async function getTeamFromAGG(
  url: string,
  teamId: string,
): Promise<Team> {
  const query = buildGatewayQuery(teamId);

  const { Team } = await graphqlQuery<{ Team: AGGResult }>(
    url,
    query,
    addExperimentalHeaders,
  );

  return convertTeam(Team);
}

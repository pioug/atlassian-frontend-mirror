import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import type { Team } from '../types';
import packageInfo from '../version.json';

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
  return `ari:cloud:identity::team/${teamId}`;
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

// indented so it's
const TEAM_FRAGMENT = `
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
`;

// We alias the team node to always be team
export const GATEWAY_QUERY_V2 = `query TeamCard($teamId: ID!, $siteID: ID!) {
  Team: team {
    team: teamV2(id: $teamId, siteId: $siteId) {
      ${TEAM_FRAGMENT}
    }
  }
}`;
export const GATEWAY_QUERY = `query TeamCard($teamId: ID!) {
  Team: team {
    team(id: $teamId) {
      ${TEAM_FRAGMENT}
    }
  }
}`;

type TeamQueryVariables = { teamId: string; siteId?: string };

export const buildGatewayQuery = ({ teamId, siteId }: TeamQueryVariables) => ({
  query: getBooleanFF('platform.teams.site-scoped.m1')
    ? GATEWAY_QUERY_V2
    : GATEWAY_QUERY,
  variables: {
    teamId: idToAri(teamId),
    ...(getBooleanFF('platform.teams.site-scoped.m1')
      ? { siteId: siteId || 'None' }
      : {}),
  },
});

export const addHeaders = (headers: Headers): Headers => {
  headers.append('X-ExperimentalApi', 'teams-beta');
  headers.append('X-ExperimentalApi', 'team-members-beta');
  headers.append('atl-client-name', packageInfo.name);
  headers.append('atl-client-version', packageInfo.version);

  return headers;
};

export async function getTeamFromAGG(
  url: string,
  teamId: string,
  siteId?: string,
): Promise<Team> {
  const query = buildGatewayQuery({
    teamId,
    siteId,
  });

  const { Team } = await graphqlQuery<{ Team: AGGResult }>(
    url,
    query,
    addHeaders,
  );

  return convertTeam(Team);
}

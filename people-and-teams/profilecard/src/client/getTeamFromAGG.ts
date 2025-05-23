import type { Team } from '../types';

import { AGGQuery } from './graphqlUtils';

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

const ARI_PREFIX = 'ari:cloud:identity::team/';

export const extractIdFromAri = (ari: string) => {
	const slashPos = ari.indexOf('/');
	const id = ari.slice(slashPos + 1);
	return id;
};

/**
 * @deprecated Use idToAriSafe instead
 */
export const idToAri = (teamId: string) => {
	return `ari:cloud:identity::team/${teamId}`;
};

export const idToAriSafe = (teamIdOrTeamAri: string) =>
	teamIdOrTeamAri.startsWith(ARI_PREFIX) ? teamIdOrTeamAri : idToAri(teamIdOrTeamAri);

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
	  isVerified
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
export const GATEWAY_QUERY_V2 = `query TeamCard($teamId: ID!, $siteId: String!) {
  Team: team {
    team: teamV2(id: $teamId, siteId: $siteId) @optIn(to: "Team-v2") {
      ${TEAM_FRAGMENT}
    }
  }
}`;

type TeamQueryVariables = { teamId: string; siteId?: string };

export const buildGatewayQuery = ({ teamId, siteId }: TeamQueryVariables) => ({
	query: GATEWAY_QUERY_V2,
	variables: {
		teamId: idToAriSafe(teamId),
		siteId: siteId || 'None',
	},
});

export const addHeaders = (headers: Headers): Headers => {
	headers.append('X-ExperimentalApi', 'teams-beta');
	headers.append('X-ExperimentalApi', 'team-members-beta');
	headers.append('atl-client-name', process.env._PACKAGE_NAME_ as string);
	headers.append('atl-client-version', process.env._PACKAGE_VERSION_ as string);

	return headers;
};

export async function getTeamFromAGG(url: string, teamId: string, siteId?: string): Promise<Team> {
	const query = buildGatewayQuery({
		teamId,
		siteId,
	});

	const { Team } = await AGGQuery<{ Team: AGGResult }>(url, query, addHeaders);

	return convertTeam(Team);
}

import { type UserARI } from '../../../../common/types';
import { type MembershipRole, type MembershipState } from '../../../../types';
import { type AGGPageInfo } from '../../types';

const TeamMembershipQuery = `query app_user_characteristics($teamId: ID!, $siteId: String!, $membershipState: [TeamMembershipState!]!, $first: Int!, $after: String) {
    team {
      teamV2(
        id: $teamId
        siteId: $siteId
      ) @optIn(to: "Team-v2") {
        members(state: $membershipState, first: $first, after: $after) {
          edges {
            node {
              member {
                id
                name
                picture
                accountStatus
                ... on AtlassianAccountUser {
                  extendedProfile {
                    jobTitle
                  }
                }
                ... on AppUser {
                  appType
                }
              }
              role
              state
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
  }`;

export default TeamMembershipQuery;

export type TeamMembershipQueryVariables = {
	teamId: string;
	siteId: string;
	membershipState: MembershipState[];
};

export type TeamMembershipQueryResponse = {
	teamV2: {
		members: {
			edges: {
				node: {
					role: MembershipRole;
					state: MembershipState;
					member: {
						name: string;
						picture: string;
						id: UserARI;
						accountStatus: 'active' | 'inactive' | 'closed';
						extendedProfile: {
							jobTitle: string | null;
						} | null;
						appType?: string | null;
					};
				};
			}[];
			pageInfo: AGGPageInfo;
		};
	};
};

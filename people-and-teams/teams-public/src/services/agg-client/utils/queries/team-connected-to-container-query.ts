import { print } from 'graphql';
import gql from 'graphql-tag';

import type {
	MembershipRole,
	MembershipState,
	TeamMembershipSettings,
	TeamState,
	UserARI,
} from '../../../../common/types';
import { AGGPageInfo } from '../../types';

export const TeamConnectedToContainerQuery = print(gql`
	query getTeamsForContainer($containerId: ID!) {
		graphStore @optIn(to: "GraphStore") {
			teamConnectedToContainerInverse(id: $containerId)
				@optIn(to: "GraphStoreTeamConnectedToContainer") {
				edges {
					node {
						... on TeamV2 {
							id
							description
							displayName
							creator {
								id
							}
							smallAvatarImageUrl
							smallHeaderImageUrl
							largeAvatarImageUrl
							largeHeaderImageUrl
							members {
								nodes {
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
								pageInfo {
									endCursor
									hasNextPage
								}
							}
							organizationId
							membershipSettings
							isVerified
							state
						}
					}
				}
			}
		}
	}
`);

export type TeamConnectedToContainerQueryVariables = {
	containerId: string;
};

export type TeamConnectedToContainerQueryResponse = {
	teamConnectedToContainerInverse: {
		edges: {
			node: {
				id: string;
				description: string;
				displayName: string;
				creator: {
					id: string;
				};
				smallAvatarImageUrl: string;
				smallHeaderImageUrl: string;
				largeAvatarImageUrl: string;
				largeHeaderImageUrl: string;
				members?: {
					nodes: {
						role: MembershipRole;
						state: MembershipState;
						member?: {
							name: string;
							picture: string;
							id: UserARI;
							accountStatus: 'active' | 'inactive' | 'closed';
							extendedProfile: {
								jobTitle: string | null;
							} | null;
							appType?: string | null;
						};
					}[];
					pageInfo: AGGPageInfo;
				};
				organizationId?: string;
				membershipSettings: TeamMembershipSettings;
				isVerified?: boolean;
				state: TeamState;
			};
		}[];
	};
};

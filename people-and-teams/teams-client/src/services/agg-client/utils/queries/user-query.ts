import { print } from 'graphql';
import gql from 'graphql-tag';

import { type UserStatus } from '../../../../types/user';

export const TeamsUserQuery = print(gql`
	query TeamsUserQuery($userId: ID!) {
		user(accountId: $userId) {
			id
			name
			picture
			accountStatus
			__typename
			... on AtlassianAccountUser {
				email
				nickname
				locale
				zoneinfo
				extendedProfile {
					jobTitle
					organization
					department
					location
					phoneNumbers {
						type
						value
					}
					closedDate
					inactiveDate
				}
			}
			... on CustomerUser {
				email
				locale
				zoneinfo
			}
			... on AppUser {
				appType
			}
		}
	}
`);

export type TeamsUserQueryVariables = {
	userId: string;
};

type PhoneNumber = {
	type?: string;
	value: string;
};

export type TeamsUserQueryResponse = {
	id: string;
	name: string;
	picture: string;
	accountStatus: UserStatus;
	__typename: 'AppUser' | string;
	email?: string;
	nickname?: string;
	locale?: string;
	zoneinfo?: string;
	extendedProfile?: {
		jobTitle?: string;
		organization?: string;
		department?: string;
		location?: string;
		phoneNumbers?: PhoneNumber[];
		closedDate?: string;
		inactiveDate?: string;
	};
	appType?: string;
};

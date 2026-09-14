import type { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const aggUserQuery: DocumentNode = gql`
	query user($userId: ID!) {
		user(accountId: $userId) {
			id
			name
			picture
			accountStatus
			__typename
			... on AtlassianAccountUser {
				email
				nickname
				zoneinfo
				extendedProfile {
					jobTitle
					organization
					location
					closedDate
					inactiveDate
				}
			}
			... on CustomerUser {
				email
				zoneinfo
			}
			... on AppUser {
				appType
			}
		}
	}
`;

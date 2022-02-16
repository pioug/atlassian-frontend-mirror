import gql from 'graphql-tag';

export const UserAndGroupSearchQuery = gql`
  query UserAndGroupSearchQuery(
    $searchTerm: String!
    $maxResults: Int = 50
    $withGroups: Boolean = true
  ) {
    userGroupSearch(query: $searchTerm, maxResults: $maxResults) {
      users {
        type
        displayName
        profilePicture {
          path
        }
        ... on User {
          accountId
        }
        ... on KnownUser {
          accountId
        }
      }
      groups @include(if: $withGroups) {
        id
        name
      }
    }
  }
`;

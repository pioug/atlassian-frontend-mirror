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
	  state
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
export const GATEWAY_QUERY_V2: 'query TeamCard($teamId: ID!, $siteId: String!) {\n  Team: team {\n    team: teamV2(id: $teamId, siteId: $siteId) @optIn(to: "Team-v2") {\n      \n      id\n      displayName\n      description\n      smallHeaderImageUrl\n      largeHeaderImageUrl\n      smallAvatarImageUrl\n      largeAvatarImageUrl\n\t  isVerified\n\t  state\n      members {\n        nodes {\n          member {\n            accountId\n            name\n            picture\n          }\n        }\n      }\n\n    }\n  }\n}' = `query TeamCard($teamId: ID!, $siteId: String!) {
  Team: team {
    team: teamV2(id: $teamId, siteId: $siteId) @optIn(to: "Team-v2") {
      ${TEAM_FRAGMENT}
    }
  }
}`;

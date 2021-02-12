import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';

export default md`
  ${(<AtlassianInternalWarning />)}

  A client class used to fetch data about users and teams to be shown in profile cards.

  ## Usage

  ### Details of the \`ProfileClient\`

  The \`ProfileClient\` has a bit of a hierarchy built into it. The \`ProfileClient\` contains two
  other instances, a \`UserProfileClient\` and \`TeamProfileClient\`, used to fetch user and team
  profile data respectively.

  All three of these (\`ProfileClient\`, \`UserProfileClient\` and \`TeamProfileClient\`) are
  exported and can be instantiated directly by consumers.

  The \`UserProfileClient\` and \`TeamProfileClient\` both extend an internal class, the
  \`CachingClient\`, which handles the shared concerns of managing a LRU cache for each client.

  This structure differs from the simpler structure used prior to major version 14.0.0 (when there
  was no support for fetching teams).

  ### Instantiating a basic \`ProfileClient\`

  ${code`
import ProfileCardResourced, { ProfileClient } from '@atlaskit/profilecard';

const profileClient = new ProfileClient({
  url: 'https://directory-graphql-service/endpoint' // GraphQL service endpoint
});

<ProfileCardResourced
  cloudId="SOME-CLOUD-ID"
  userId="SOME-USER-ID"
  resourceClient={profileClient}
  actions={[
    {
      label: 'View profile',
      id: 'view-profile',
      callback: () => {}
    }
  ]}
/>
  `}

  ### Customising the LRU cache of the \`ProfileClient\`

  ${code`
import { ProfileClient } from '@atlaskit/profilecard';

const profileClient = new ProfileClient({
  url: 'https://directory-graphql-service/endpoint', // GraphQL service endpoint
  cacheSize: 10, // Max item capacity of the LRU cache
  cacheMaxAge: 5000, // Milliseconds
});
  `}

  ### Customising / Extending the \`ProfileClient\`

  ${code`
import { ProfileClient, Team, TeamProfileClient, UserProfileClient } from '@atlaskit/profilecard';

const getUserDetailsSpecialWay = (url, cloudId, userId) => {
  const fetchUrl = \`https://someservice.com/fetchuser?userId=\${userId}\`;

  return fetch(fetchUrl, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  });
};

class CustomUserClient extends UserProfileClient {
  makeRequest(cloudId: string, userId: string) {
    // 'userId' and 'cloudId' are passed from a trigger or resource profile card
    // based on the component's props.
    // The string of 'cloudId/userId' is used as cache identifier.
    //
    // Inside 'makeRequest' the 'url' parameter the client was instantiated
    // with is accessible via 'this.options.url'.
    //
    // 'makeRequest' must return a Promise that resolves with an object
    // of the following structure:
    //
    // {
    //   "avatarUrl": string,
    //   "fullName": string,
    //   "nickname": string,
    //   "email": string,
    //   "location": string,
    //   "meta": string,
    //   "timestring": string
    // }

    return getUserDetailsSpecialWay(this.options.url, cloudId, userId);
  }
}

const getTeamDetailsSpecialWay = (url, orgId, teamId) => {
  const fetchUrl = \`https://someservice.com/team?teamId=\${teamId}\`;

  return fetch(fetchUrl, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  });
};

class CustomTeamClient extends TeamProfileClient {
  makeRequest(teamId: string, orgId: string): Promise<Team> {
    // 'teamId' and 'orgId' are passed from a trigger or resource profile card
    // based on the component's props.
    // The teamId is used as cache identifier.
    //
    // Inside 'makeRequest' the 'url' parameter the client was instantiated
    // with is accessible via 'this.options.url'.
    //
    // 'makeRequest' must return a Promise that resolves with an object
    // of type Team:
    //
    // export interface Team {
    //   // Header image props
    //   largeHeaderImageUrl?: string;
    //   smallHeaderImageUrl?: string;
    //   // Regular team details
    //   id: string;
    //   displayName: string;
    //   description: string;
    //   organizationId?: string;
    //   members?: {
    //     id: string;
    //     fullName: string;
    //     avatarUrl: string;
    //   }[];
    // }

    return getTeamDetailsSpecialWay(this.options.url, orgId, teamId);
  }
}

const config = {
  url: 'https://rest-api/endpoint', // Custom REST API endpoint
  cacheSize: 10,
  cacheMaxAge: 5000,
};

const profileClient = new ProfileClient(config, {
  userClient: new CustomUserClient(config), // Override default user client
  teamClient: new CustomTeamClient(config), // Override default team client
});`}

  In the above example, you don't need to override both the user and team clients. Only override
  the one you need to modify and the ProfileClient will construct the other itself. Or even better,
  hopefully you don't need to override either and the default behaviour works for you.
`;

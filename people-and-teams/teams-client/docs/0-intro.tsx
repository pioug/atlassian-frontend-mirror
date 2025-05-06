import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';

export default md`

${(<AtlassianInternalWarning />)}

# TeamsClient

TeamsClient is a core component for managing team-related data and operations in Atlassian products. Its primary purpose is to provide a unified interface for interacting with team services, ensuring efficient data fetching and management.

## Dependencies

- \`react\`

## Installation

${code`yarn add @atlaskit/teams-client`}

## Usage

The following code example shows how to initialize and use the TeamsClient:

${code`import { TeamsClient } from '@atlaskit/teams-client';`}

${code`
// Initialize the client
const client = new TeamsClient();

// Set context for all requests
client.setContext({
  cloudId: 'your-cloud-id',
  orgId: 'your-org-id'
});

// Example: Get team by ID
const team = await client.getTeamById('team-id');
`}

## Key Features

TeamsClient provides several key functionalities:

- Team Management (create, update, delete teams)
- Team Membership Operations (add/remove members, handle join requests)
- Team Data Retrieval (get team details, memberships, links)
- User Management (user profiles, permissions)
- Media Management (team and user avatars/headers)
`;

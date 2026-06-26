import React from 'react';

import { AtlassianInternalWarning, code, md } from '@atlaskit/docs';

const _default_1: any = md`
  ${(<AtlassianInternalWarning />)}

  ## Deprecated

  **TeamProfileCardTrigger is deprecated and no longer provides any profile card functionality.**
  It simply renders its children as-is without any popup or interaction behavior.

  ### Migration

  Use \`TeamProfileCardWithTrigger\` from \`@atlassian/team-profilecard\` instead:

  ${code`
// Before (deprecated - no longer works)
import { TeamProfileCardTrigger } from '@atlaskit/profilecard';

<TeamProfileCardTrigger
  orgId="SOME-ORG-ID"
  teamId="SOME-TEAM-ID"
  resourceClient={profileClient}
>
  <Avatar ... />
</TeamProfileCardTrigger>

// After (use this instead)
import { TeamProfileCardWithTrigger } from '@atlassian/team-profilecard/trigger';

<TeamProfileCardWithTrigger
  teamAri={toTeamARI(teamId)}
  cloudId={cloudId}
  userId={userId}
  trigger="hover"
  showFlag={addFlag}
>
  <Avatar ... />
</TeamProfileCardWithTrigger>
  `}

  ### Key differences

  - **teamAri** replaces \`teamId\` and \`orgId\` - use \`toTeamARI(teamId)\` from \`@atlaskit/teams-client\`
  - **cloudId** is now a required prop
  - **userId** is the viewing user's account ID
  - **showFlag** replaces \`addFlag\` for displaying flag notifications
  - **trigger** accepts \`'hover'\`, \`'click'\`, or \`['hover', 'click']\` instead of \`'hover-click'\`
  - **placement** replaces \`position\` for popup placement
  - **resourceClient** is no longer needed - the new component handles data fetching internally via Relay
`;
export default _default_1;

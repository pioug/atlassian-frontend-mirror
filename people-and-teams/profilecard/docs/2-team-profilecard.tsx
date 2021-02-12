import React from 'react';

import { Link } from 'react-router-dom';

import {
  AtlassianInternalWarning,
  code,
  Example,
  md,
  Props,
} from '@atlaskit/docs';

export default md`
  ${(<AtlassianInternalWarning />)}

  A React component that wraps a trigger, such that when interacted a user profile card pops up.

  It's recommended to talk to us on Slack at #team-twp-people-teams before integrating this in
  your product.

  ## Usage

  ### Using the ProfileCardTrigger

  ${code`
import { ProfileClient, TeamProfileCardTrigger } from '@atlaskit/profilecard';

const profileClient = new ProfileClient({
  url: 'https://directory-graphql-service/endpoint' // GraphQL service endpoint
});

<TeamProfileCardTrigger
  orgId="SOME-ORG-ID"
  teamId="SOME-TEAM-ID"
  resourceClient={profileClient}
>
  <Avatar ... />
</TeamProfileCardTrigger>
  `}

  ${(
    <Example
      packageName="@atlaskit/profilecard"
      Component={require('../examples/09-team-profilecard-trigger').default}
      title="Profilecard"
      source={require('!!raw-loader!../examples/09-team-profilecard-trigger')}
    />
  )}

  Here are some relevant examples for better understanding the \`trigger\` and \`triggerLinkType\`
  props:

  ${(
    <ul>
      <li>
        <Link to="/examples/people-and-teams/profilecard/trigger-link-types">
          Trigger link types
        </Link>
      </li>
      <li>
        <Link to="/examples/people-and-teams/profilecard/team-profilecard-trigger">
          Team profilecard trigger
        </Link>
      </li>
    </ul>
  )}

  ${(
    <Props
      heading="TeamProfileCardTrigger Props..."
      props={require('!!extract-react-types-loader!../src/components/TeamProfileCardTrigger')}
    />
  )}

`;

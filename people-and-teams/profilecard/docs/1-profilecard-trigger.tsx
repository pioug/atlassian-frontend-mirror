import React from 'react';

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

  ## Usage

  ### Using the ProfileCardTrigger

  ${code`
import { ProfileClient, ProfileCardTrigger } from '@atlaskit/profilecard';

const profileClient = new ProfileClient({
  url: 'https://directory-graphql-service/endpoint' // GraphQL service endpoint
});

<ProfileCardTrigger
  cloudId="DUMMY-10ae0bf3-157e-43f7-be45-f1bb13b39048"
  userId="638454:c8dddbde-3f65-4078-946e-8f9834a3c908"
  resourceClient={profileClient}
  actions={[
    {
      label: 'View profile',
      id: 'view-profile',
      callback: () => {}
    }
  ]}
>
  <Avatar ... />
</ProfileCardTrigger>
  `}

  ${(
    <Example
      packageName="@atlaskit/profilecard"
      Component={require('../examples/05-profilecard-trigger').default}
      title="Profilecard"
      source={require('!!raw-loader!../examples/05-profilecard-trigger')}
    />
  )}

  ${(
    <Props
      heading="ProfileCardTrigger Props"
      props={require('!!extract-react-types-loader!../src/components/ProfileCardTrigger')}
    />
  )}

`;

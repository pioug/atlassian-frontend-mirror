import React from 'react';
import {
  md,
  Example,
  code,
  Props,
  AtlassianInternalWarning,
} from '@atlaskit/docs';

export default md`
  ${(<AtlassianInternalWarning />)}
  
  A React component to display a card with user information.

  ## Usage

  ### Using the ProfileClient

  ${code`
import ProfileCardResourced, { ProfileClient } from '@atlaskit/profilecard';

const profileClient = new ProfileClient({
  url: 'https://directory-graphql-service/endpoint' // GraphQL service endpoint
});

const analytics = (eventname, attributes) => {
  // ...
}

<ProfileCardResourced
  cloudId="DUMMY-10ae0bf3-157e-43f7-be45-f1bb13b39048"
  userId="638454:c8dddbde-3f65-4078-946e-8f9834a3c908"
  resourceClient={profileClient}
  actions={[
    {
      label: 'View profile',
      id: 'view-profile',
      callback: () => {}
    }
  ]},
  analytics={analytics}
/>
  `}

  ### Using the LRU cache of the \`ProfileClient\`

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
import { ProfileClient } from '@atlaskit/profilecard';

const getProfileDataFromSomewhereElse = (url, cloudId, userId) => {
  const fetchUrl = 'https://someservice.com/fetchuser?userId=' + userId;

  return fetch(fetchUrl, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  });
};

class CustomProfileClient extends ProfileClient {
  /**
   * @param {String} cloudId
   * @param {String} userId
   * @returns {Promise}
   */
  makeRequest(cloudId, userId) {
    // 'userId' and 'cloudId' are passed from 'ProfileCardResourced'
    // component properties.
    // The string of 'cloudId/userId' is used as cache identifier.
    //
    // Inside 'makeRequest' the 'url' parameter the client was instantiated
    // with is accessible via 'this.config.url'.
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

    return getProfileDataFromSomewhereElse(this.config.url, cloudId, userId);
  }
}

const profileClient = new CustomProfileClient({
  url: 'https://rest-api/endpoint', // Custom REST API endpoint
  cacheSize: 10,
  cacheMaxAge: 5000,
});`}

  ${(
    <Example
      packageName="@atlaskit/profilecard"
      Component={require('../examples/01-profilecard').default}
      title="Profilecard"
      source={require('!!raw-loader!../examples/01-profilecard')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/profilecard"
      Component={require('../examples/02-profilecard-resourced').default}
      title="ProfilecardResourced"
      source={require('!!raw-loader!../examples/02-profilecard-resourced')}
    />
  )}

  ${(
    <Props
      heading="ProfileCard Props"
      props={require('!!extract-react-types-loader!../src/components/ProfileCard')}
    />
  )}

  ${(
    <Props
      heading="ProfileCardResourced Props"
      props={require('!!extract-react-types-loader!../src/components/ProfileCardResourced')}
    />
  )}
 
`;

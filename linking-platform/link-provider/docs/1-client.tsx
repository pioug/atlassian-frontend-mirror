import { code, md, Props } from '@atlaskit/docs';
import React from 'react';

export default md`

# CardClient

The Client is a HTTP client which interacts with the [Object Resolver Service](https://microscope.prod.atl-paas.net/services/object-resolver-service), or a service of your own. It lives on the **SmartCardProvider**, which uses **React.Context**.

The Object Resolver Service provides primary endpoints:

* **/resolve:** for getting the JSON-LD metadata for Smart Links.

By default, the Client will talk to **/gateway/api/object-resolver** endpoint of the current domain. This assumes that your product has already integrated with Stargate so that our service is accessible through that endpoint.
We **do not** offer a way to configure that endpoint. Please refer to the section below on how to provide your own implementation.

## Providing your own implementation

If you have a service of your own which resolves metadata for specific kinds of links, you can communicate with that service by extending the Client:

${code`
const myDefinitionId = 'awesome-object-provider';
const myResponse = {
meta: {
  visibility: 'public',
  access: 'granted',
  auth: [],
  definitionId: myDefinitionId,
},
data: {
  name: 'My Smart Link metadata',
},
} as ResolveResponse;

// Setup custom client which speaks to awesome-object-provider service.
class AwesomeClient extends Client {
fetchData(url: string) {
  if (isUrlAwesome(url)) {
    return Promise.resolve(myResponse);
  }
  return super.fetchData(url);
}
}

// Set up the Provider with this custom client.
...
<SmartCardProvider client={new AwesomeClient()}>
	<Card appearance="block" url={awesomeUrl} />
</SmartCardProvider>
`}

## Limitations

### Production and staging environment

Due to security reasons, **Object Resolver Service** cannot resolve Atlassian production and staging links interchangeably.
This means we can only resolve Atlassian staging links in the staging environment and production links in the production environment.

## Setting up for local development

For local development, please configure \`CardClient\` to point to the staging environment and ensure that you're logged in to [https://pug.jira-dev.com](https://pug.jira-dev.com/).

${code`
import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';

<SmartCardProvider client="new CardClient('stg')">
	<Card appearance="inline" url="https://staging-link-url" />
</SmartCardProvider>
`}

${(<Props heading="" props={require('!!extract-react-types-loader!./props/props-client')} />)}

`;

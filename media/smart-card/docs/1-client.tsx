import { md, code } from '@atlaskit/docs';

export default md`
  # Intro

  The Client is a HTTP client which interacts with the [Object Resolver Service](https://microscope.prod.atl-paas.net/object-resolver-service), or a service of your own. It lives on the **SmartCardProvider**, which uses **React.Context**. 
  
  The Object Resolver Service provides two primary endpoints:

  * **/check:** for checking if a URL is supported by Object Resolver Service;
  * **/resolve:** for getting the JSON-LD metadata backing a link.
  
  We recommend a similar API contract for your services. All clients must return data in the [JSON-LD format](https://product-fabric.atlassian.net/wiki/spaces/SL/pages/460753040/Atlassian+Object+Vocabulary+JSON-LD). We export **ResolveResponse** to represent this:

  ${code`
  type RemoteResourceAuthConfig = {
    key: string;
    displayName: string;
    url: string;
  };

  type ResolveResponse = {
    meta: {
      visibility: 'public' | 'restricted' | 'other' | 'not_found';
      access: 'granted' | 'unauthorized' | 'forbidden';
      auth: RemoteResourceAuthConfig[];
      definitionId: string;
    };
    data?: {
      [name: string]: any;
    };
  }
  `}

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

  // Setup the Provider with this custom client.
  ...
  <SmartCardProvider client={new AwesomeClient()}>
    ...
    <Card appearance="block" url={awesomeUrl} />
    ...
  </SmartCardProvider>
  ...
 `}
`;

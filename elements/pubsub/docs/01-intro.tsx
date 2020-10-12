import React from 'react';
import { md, Example, code, AtlassianInternalWarning } from '@atlaskit/docs';

import PubSubExample from '../examples/00-client';

const PubSubdSource = require('!!raw-loader!../examples/00-client');

export default md`
  ${(<AtlassianInternalWarning />)}
  
  This provides components for receiving events from the PubSub service.

  ## Usage

  ${code`
  import { PubSubClient } from '@atlassian/pubsub';

  ### Using the component as a component developer

  class Component {
    private pubSubClient: PubSubClient;

    constructor(pubSubClient: PubSubClient) {
      this.pubSubClient = pubSubClient;
      this.subscribeToPubSubEvents();
    }

    private subscribeToPubSubEvents() {
      this.pubSubClient.on('avi:jira:updated:issue', this.onIssueUpdate);
    }

    onIssueUpdate = (event: string, payload) => {

    };
  };`}

  ### Using the component as a product developer

  ${code`import { default as Client } from '@atlassian/pubsub';

  const pubSubClient = new Client({
    product: 'STRIDE',
    url: 'https://api-private.atlassian.com/pubsub',
  });

  // Call join to join channels for the given context, for example for current conversations in Stride
  pubSubClient.join([
    'ari:cloud:banana:f7ebe2c0-0309-4687-b913-41d422f2110b:conversation/b17d8707-db6e-436e-95b9-102dd1986293',
  ]);

  // Call leave to leave channels (when closing a conversation for example)
  pubSubClient.leave([
    'ari:cloud:banana:f7ebe2c0-0309-4687-b913-41d422f2110b:conversation/b17d8707-db6e-436e-95b9-102dd1986293',
  ]);
};`}

  You should then make the pubSubClient available to components.

  ${(
    <Example
      packageName="@atlaskit/pubsub"
      Component={PubSubExample}
      title="Client"
      source={PubSubdSource}
    />
  )}
`;

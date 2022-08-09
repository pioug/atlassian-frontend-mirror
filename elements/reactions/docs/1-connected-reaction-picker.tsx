import React from 'react';
import { md, Example, code, Props } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

import ConnectedReactionPickerExample from '../examples/00-connected-reaction-picker';

export default md`

  The ConnectedReactionPicker component renders the Reaction picker custom selector to add a new reaction to the content displayed.

  ## Usage

  Import the component in your React app as follows:

  ${code`
  import { ReactionStore, ConnectedReactionPicker, State, MemoryReactionsStore, ReactionServiceClient } from '@atlaskit/reactions';
  import { EmojiResource, EmojiResourceConfig } from '@atlaskit/emoji/resource';

  // Config object for the emoji resource
  const config: EmojiResourceConfig = {
    singleEmojiApi: {
      getUrl: (emojiId: string) => 'https://emoji-example/emoji/site-id/emojiId',
      securityProvider: () => ({
        headers: {
          'User-Context': '{{token}}',
          Authorization: 'Bearer {{token}}',
        },
      })
    },
    optimisticImageApi: {
      getUrl: (emojiId: string) => 'https://emoji-example/emoji/site-id/emojiId/path',
      securityProvider: () => ({
        headers: {
          'User-Context': '{{token}}',
          Authorization: 'Bearer {{token}}',
        },
      })
    },
    providers: [
      {
        url: 'https://emoji-example/emoji/standard',
      },
      {
        url: 'https://emoji-example/emoji/site-id/site',
        securityProvider: () => ({
          headers: {
            Authorization: 'Bearer {{token}}',
          },
        }),
      },
    ]
  };

  const apiConfig = {
    baseUrl: 'http://www.example.org',
    // optional, generate token from asap, check \`pf-emoji-service\` for more info
    authHeader: 'Bearer token',
  };

  // Create a client object fetching the reactions data from the specified url
  const client = new ReactionServiceClient(apiConfig.baseUrl, apiConfig.authHeader);

  // Define the initial state object
  const intialState: State = {
    reactions: {},
    flash: {}
  };

  // Define the store object that will handle all the reactions data (get/set/remove) and the API calls to the server
  const store = new MemoryReactionsStore(client, intialState, {
    subproduct: 'atlaskit',
  });


  // Define an emoji resource object instance (EmojiResource implements the EmojiProvider interface) that will be passed as prop to the ConnectedReactionPicker component
  const emojiResource = new EmojiResource(config); //See warning below

  /**
   * fetch from all the providers in the config object and cache the results (see EmojiResource for more info).
   * Note: this is a one time fetch, so if you want to fetch from the same providers again, you need to create a new EmojiResource instance. Furhermore, you'll need to handle for a failed fetch and retry requests if your app logic requires this.
   */
  emojiResource.fetchEmojiProvider();

  // Retrieve your ari and containerAri values from the server
  const ari = 'ari:cloud:owner:demo-cloud-id:item/1';
  const containerAri = 'ari:cloud:owner:demo-cloud-id:container/1';

  const emojiProvider = new EmojiResource(config);
  const emojiId = { shortName: ':grimacing:', id: '1f603' };


  ReactDOM.render(
    <ConnectedReactionPicker
    store={store}
    containerAri={containerAri}
    ari={demoAri}
    emojiProvider={Promise.resolve(emojiResource)}
    />
  );`}

  ${(
    <>
      <br />
      <SectionMessage
        appearance="warning"
        title="There should be only one instance of EmojiResource in your application"
      >
        <p>
          Make sure EmojiResource is initialised only once to avoid performance
          issues using useMemo.
        </p>
      </SectionMessage>
    </>
  )}

  ### Example:

  ${(
    <Example
      packageName="@atlaskit/reactions"
      Component={ConnectedReactionPickerExample}
      title="Connected Reactions Picker"
      source={require('!!raw-loader!../examples/00-connected-reaction-picker')}
    />
  )}

  ${(
    <Props
      heading="ConnectedReactionPicker Props"
      props={require('!!extract-react-types-loader!../extract-react-type/ConnectedReactionPicker')}
    />
  )}
`;

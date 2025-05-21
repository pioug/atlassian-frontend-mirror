import Link from '@atlaskit/link';
import { fg } from '@atlaskit/platform-feature-flags';
import React from 'react';
import { md, Example, Props, code, AtlassianInternalWarning } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';
import { Text } from '@atlaskit/primitives/compiled';

import ReactionsExample from '../examples/01-connected-reactions-view';

const LinkComponent = (props: any) =>
	// eslint-disable-next-line @atlaskit/design-system/no-html-anchor, jsx-a11y/anchor-has-content
	fg('dst-a11y__replace-anchor-with-link__editor-collabo') ? <Link {...props} /> : <a {...props} />;

export default md`
  ${(<AtlassianInternalWarning />)}

  The main purpose of the Reactions component is to provide users the ability to react to pieces of content.
  It includes support for adding/view/remove a reaction from a specified emoji provider object.

  The key components to use are:
  1. [connectedReactionPicker](/packages/elements/reactions/docs/connected-reaction-picker)
  1. [connectedReactionsView](/packages/elements/reactions/docs/connected-reactions-view)

  The key types to use are:
  1. [ReactionsStore](/packages/elements/reactions/docs/reactions-store)
  1. [ReactionServiceClient](/packages/elements/reactions/docs/reaction-service-client)
  1. [EmojiResource](https://atlaskit.atlassian.com/packages/elements/emoji/docs/resourced-emoji)

  The guide to supporting GraphQL can be found here:
  * [Graphql Support](/packages/elements/reactions/docs/graphql-support)

  ## Usage

  For each of these components, first import the following in your React app as follows:

  ${code`
  import { ReactionStore, ConnectedReactionsView, State, MemoryReactionsStore, ReactionServiceClient } from '@atlaskit/reactions';
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

  // Define an emoji resource object instance that will be passed as prop to the ConnectedReactionsView component
  const emojiResource = new EmojiResource(config); //See warning below

  /**
   * fetch from all the providers in the config object and cache the results (see EmojiResource for more info).
   * Note: this is a one time fetch, so if you want to fetch from the same providers again, you need to create a new EmojiResource instance. Furhermore, you'll need to handle for a failed fetch and retry requests if your app logic requires this.
   */
  emojiResource.fetchEmojiProvider();

  // Retrieve your ari and containerAri values from the server
  const ari = 'ari:cloud:owner:demo-cloud-id:item/1';
  const containerAri = 'ari:cloud:owner:demo-cloud-id:container/1';


  // Render the component in your React app
  ReactDOM.render(
    <ConnectedReactionsView
      store={store}
      containerAri={containerAri}
      ari={demoAri}
      emojiProvider={Promise.resolve(emojiResource)}
    />
    container,
  };`}

  ${(
		<>
			<br />
			<SectionMessage
				appearance="warning"
				title="There should be only one instance of EmojiResource in your application"
			>
				<Text as="p">
					Make sure EmojiResource is initialised only once to avoid performance issues using
					useMemo.
				</Text>
			</SectionMessage>
			<br />
			<SectionMessage appearance="information">
				<Text as="p">EmojiResource object implements the EmojiProvider interface.</Text>
				<LinkComponent
					href="https://atlaskit.atlassian.com/packages/elements/emoji/docs/emoji-provider"
					target="_blank"
					rel="noopener noreferrer"
				>
					See here for information on EmojiProvider.
				</LinkComponent>
			</SectionMessage>
		</>
	)}

  ### Note:

  Don't forget to add polyfills for fetch, ES6 & ES7 to your product build if you want to target older browsers.
  We recommend the use of [babel-preset-env](https://babeljs.io/docs/plugins/preset-env/) & [babel-polyfill](https://babeljs.io/docs/usage/polyfill/)

  ### Example:

  ${(
		<Example
			packageName="@atlaskit/reactions"
			Component={ReactionsExample}
			title="Picker and Reactions"
			source={require('!!raw-loader!../examples/01-connected-reactions-view')}
		/>
	)}

  ${(
		<Props
			heading="Reactions Props"
			props={require('!!extract-react-types-loader!../extract-react-type/Reactions')}
		/>
	)}


  ${(
		<Props
			heading="Reaction Props"
			props={require('!!extract-react-types-loader!../extract-react-type/Reaction')}
		/>
	)}`;

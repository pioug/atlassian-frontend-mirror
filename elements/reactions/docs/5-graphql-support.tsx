import React from 'react';
import { md, code, Props } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`

  ### How to get reactions support GraphQL?

  The pre-built \`ReactionClient\` is supporting REST APIs, if you want to support GraphQL, please follow best practice below.

  We have a \`ReactionClient\` interface which can be extended to support integrating with Graphql APIs.

  You can simply create your own \`ReactionGraphQLClient\` to extend our \`ReactionClient\` interface, and implement each method from interface by using your own GraphQL queries or mutations. Just ensure the payload is matched with the type defined from interface. You may need the data transformation before return the promise.

  #### 1. Create your own \`ReactionsGraphQLClient\` to support your own GraphQL APIs:

  ${code`
  import type { ReactionClient } from "@atlaskit/reactions"

  /**
  * demo purpose, assume apolloClient has initialized in 'graphqlClient'
  */
  import apolloClient from 'graphqlClient'

  export class ReactionsGraphQLClient implements ReactionClient {
      private clientConfig: ClientConfig;
      // optional, you can set up a clientConfig if you need some extra options that params from methods of ReactionClient doesn't provide.
      constructor(clientConfig: ClientConfig) {
          this.clientConfig = clientConfig;
      }
      getReactions(containerAri: string, aris: string[]) {
          return apolloClient.
              .query({
                  query: GET_REACTIONS_QUERY, // your own query to fetch reactions
                  variables: {
                    containerAri,
                    aris,
                  })
              .then((response) => {
                  // transform data if needed to match return type from interface
                  return response.data; // type needs to be Reactions
              });
      }
      getDetailedReaction(containerAri: string, ari: string, emojiId: string) {
          return apolloClient.
              .query({
                  query: GET_DETAILED_REACTION, // your own query to fetch detailed reaction
                  variables: {
                    containerAri,
                    aris,
                  })
              .then((response) => {
                  // transform data if needed to match return type from interface
                  return response.data; // type needs to be Reactions
              });
      }
      addReaction(containerAri: string, ari: string, emojiId: string) {
          return apolloClient.
              .mutate({
                  mutation: ADD_REACTION, // your own mutation to add reaction
                  variables: {
                    containerAri,
                    ari,
                    emojiId,
                  })
              .then((response) => {
                  // transform data if needed to match return type from interface
                  return response.data; // type needs to be Reactions
              });
      }
      deleteReaction(containerAri: string, ari: string, emojiId: string) {
          return apolloClient.
              .mutate({
                  mutation: REMOVE_REACTION, // your own mutation to delete reaction
                  variables: {
                    containerAri,
                    ari,
                    emojiId,
                  })
              .then((response) => {
                  // transform data if needed to match return type from interface
                  return response.data; // type needs to be Reactions
              });
      }
  }
  `}

  #### 2. Set up ReactionsStore with \`ReactionGraphQLClient\`:

  ${code`
  const intialState: State = {
      reactions: {},
      flash: {}
  };

  const reactionsStore = useMemo(() => {
      return new MemoryReactionsStore(
          new ReactionsGraphQLClient(
              clientConfig, // client config from your own to provie extra options for your GraphQL APIs
          ),
          initialState,
          {
              subproduct: 'atlaskit', // e.g. jira, confluence, etc
          }
      );
  }, [clientConfig]);
  `}

  #### 3. Consume your reactionsStore in your ConnectedReactionsView

  ${code`
  ReactDOM.render(
    <ConnectedReactionsView
      store={reactionsStore}
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
			appearance="information"
			title="There should be only one instance of EmojiResource in your application"
		>
			<p>
				Above examples show the best practice to integrate Graphql APIs. By extending from our
				`ReactionsClient` interface, you are free to use any GrapqhQL client, any queries or
				mutations, as long as they return the same type as defined in the interface.
			</p>
		</SectionMessage>
		<br />
		<SectionMessage appearance="warning">
			Use base UI Components `Reactions` from `@atlaskit/reactions` directly with your own
			implementation around to support GraphQL or custom behavior is at your own risk. Without using
			ReactionsStore, we can't track the operations of reactions, please add your own tracking to
			measure. The custom implementation will lead to limited support from us.
		</SectionMessage>
	</>
)}

${(
	<Props
		heading="ReactionClient type"
		props={require('!!extract-react-types-loader!../extract-react-type/reactionClient')}
	/>
)}
`;

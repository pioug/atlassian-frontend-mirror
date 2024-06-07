import React from 'react';
import { md, code, Props } from '@atlaskit/docs';

export default md`

  The ReactionServiceClient class is another key element used in the Reactions memory state management. It wraps all API calls to the pf-reactions-service required for communicating with the remote API.

  ## Usage

  ${code`
  import { MemoryReactionsStore, State, ReactionServiceClient } from '@atlaskit/reactions';

  const apiConfig = {
    baseUrl: 'http://www.example.org',
    // optional, generate token from asap, check \`pf-emoji-service\` for more info
    authHeader: 'Bearer token',
  };

  // Create a client object fetching the reactions data from the specified url
  const client = new ReactionServiceClient(apiConfig.baseUrl, apiConfig.authHeader) = {};

  // Add the client to the MemoryReactionsStore class

  // Define the initial state object
  const intialState: State = {
    reactions: {},
    flash: {}
  };

  // Define the store object that will handle all the reactions data (get/set/remove) and the API calls to the server
  const store = new MemoryReactionsStore(client, intialState, {
    subproduct: 'atlaskit',
  });
`}

  ${(
		<Props
			heading="ReactionClient type"
			props={require('!!extract-react-types-loader!../extract-react-type/reactionClient')}
		/>
	)}
`;

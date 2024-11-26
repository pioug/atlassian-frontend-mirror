import React from 'react';
import { md, code, Props } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';
import { Text } from '@atlaskit/primitives';

export default md`

  The ReactionsStore is one of the key interfaces that encapsulates all logic needed to maintain internal state of the reaction elements (get latest state and onChange callback events), including different types of Actions required to perform on the store (getReactions, toggleReaction on/off, adding a new reaciton, getting detailed reaction upon hovering the emoji icon).
  It serves as one of the key props passed to the connected HoC used in Reactions: (\`ConnectedReactionPicker\` and \`ConnectedReactions\`).

  ${(
		<>
			<br />
			<SectionMessage appearance="information" title="">
				You can instantiate an instance of the ReactionsStore object using the built in{' '}
				<Text as="strong">MemoryReactionsStore</Text> class object that contains all logic required
				to communicate with the store. It provides all the methods to interact with the store and
				the API calls to the server, including logging
				<a
					target="_blank"
					rel="noopener noreferrer"
					href="https://developer.atlassian.com/platform/ufo/"
				>
					UFO
				</a>
				.
				<br />
			</SectionMessage>
		</>
	)}

  ## Usage

  ${code`
  import { MemoryReactionsStore, State, ReactionServiceClient } from '@atlaskit/reactions';

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
`}

  ${(
		<Props
			heading="Store Type"
			props={require('!!extract-react-types-loader!../extract-react-type/reactionsStore')}
		/>
	)}

  ${(
		<Props
			heading="Actions type"
			props={require('!!extract-react-types-loader!../extract-react-type/actions')}
		/>
	)}
`;

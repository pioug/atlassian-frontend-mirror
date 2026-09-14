import React from 'react';

import { RovoPostMessagePubsubListener } from '@atlaskit/rovo-triggers/post-message-to-pubsub';

export default function PostMessageListenerExample(): React.JSX.Element {
	return (
		<React.Fragment>
			<RovoPostMessagePubsubListener />
		</React.Fragment>
	);
}

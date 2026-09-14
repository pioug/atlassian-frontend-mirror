import React, { useCallback } from 'react';

import { Subscriber } from '@atlaskit/rovo-triggers/main';
import { Topics, type Payload } from '@atlaskit/rovo-triggers/types';

export default function SubscriberExample(): React.JSX.Element {
	const handleEvent = useCallback((payload: Payload) => {
		if (payload.type === 'message-send') {
			window.dispatchEvent(new CustomEvent('rovo-message-send', { detail: payload }));
		}
	}, []);

	return (
		<Subscriber
			topic={Topics.AI_MATE}
			triggerLatest
			consumeOnceKey="chat-host"
			onEvent={handleEvent}
		/>
	);
}

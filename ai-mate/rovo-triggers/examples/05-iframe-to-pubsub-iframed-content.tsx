/* eslint-disable @atlaskit/design-system/no-html-button */
import React from 'react';

import { useRovoPostMessageToPubsub } from '../src';

export default () => {
	const [ackTimeoutHappened, setAckTimeoutHappened] = React.useState(false);

	const { publishWithPostMessage, isWaitingForAck } = useRovoPostMessageToPubsub();

	const frameId = new URLSearchParams(window.location.search).get('frameId');

	return (
		<div>
			<p>This example is meant to be used as an iframed content.</p>
			<p>Frame id: {frameId}</p>
			<button
				data-testid="publish-chat-new-to-parent-window"
				disabled={isWaitingForAck}
				onClick={() => {
					publishWithPostMessage({
						payload: {
							type: 'chat-new',
							source: `FrameId: ${frameId}`,
							data: {
								prompt: `Hello from children. FrameId: ${frameId}`,
								dialogues: [],
								name: `Frame ${frameId} convo title`,
							},
						},
						onAcknowledgeTimeout: () => {
							setAckTimeoutHappened(true);
							window.open('https://www.atlassian.com', '_blank', 'noopener noreferrer');
						},
					});
				}}
			>
				Publish 'chat-new' event to parent. Will open URL in new tab if there is no parent listener.
			</button>
			{ackTimeoutHappened && (
				<p data-testid="onAcknowledgeTimeout-happened">onAcknowledgeTimeout happened</p>
			)}
		</div>
	);
};

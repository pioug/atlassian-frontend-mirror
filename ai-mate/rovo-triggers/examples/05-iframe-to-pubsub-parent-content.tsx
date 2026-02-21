import React from 'react';

import { RovoPostMessagePubsubListener } from '../src/common/utils/post-message-to-pubsub';
import { Subscriber } from '../src/main';

const siblingExampleUrl =
	'/examples.html?groupId=ai-mate&packageId=rovo-triggers&exampleId=iframe-to-pubsub-iframed-content&mode=light';
const embedOneFrameId = 'embed-one';
const embedTwoFrameId = 'embed-two';

export default (): React.JSX.Element => {
	const [eventLog, setEventLog] = React.useState<string[]>([]);

	return (
		<div>
			<RovoPostMessagePubsubListener />
			<Subscriber
				topic="ai-mate"
				onEvent={(payload) => {
					setEventLog((prev) => [...prev, JSON.stringify(payload)]);
				}}
			/>
			<h2>{'<Subscriber />'} event logs below:</h2>
			<ol data-testid="event-log">
				{eventLog.map((event, index) => (
					<li key={index}>
						<pre>{event}</pre>
					</li>
				))}
			</ol>
			<h2>Multiple iframe of the sibling example below:</h2>
			<iframe
				title="Test embed frame 1"
				data-testid="test-embed-frame-1"
				src={siblingExampleUrl + `&frameId=${embedOneFrameId}`}
			/>
			<iframe
				title="Test embed frame 2"
				data-testid="test-embed-frame-2"
				src={siblingExampleUrl + `&frameId=${embedTwoFrameId}`}
			/>
		</div>
	);
};

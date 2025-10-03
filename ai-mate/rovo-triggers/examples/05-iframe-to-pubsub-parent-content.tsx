import React from 'react';

import { RovoPostMessagePubsubListener, Subscriber } from '../src';

const siblingExampleUrl =
	'/examples.html?groupId=ai-mate&packageId=rovo-triggers&exampleId=iframe-to-pubsub-iframed-content&mode=light';
const embedOneFrameId = 'embed-one';
const embedTwoFrameId = 'embed-two';

export default () => {
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
			{/* eslint-disable-next-line @atlassian/a11y/iframe-has-title */}
			<iframe
				data-testid="test-embed-frame-1"
				src={siblingExampleUrl + `&frameId=${embedOneFrameId}`}
			/>
			{/* eslint-disable-next-line @atlassian/a11y/iframe-has-title */}
			<iframe
				data-testid="test-embed-frame-2"
				src={siblingExampleUrl + `&frameId=${embedTwoFrameId}`}
			/>
		</div>
	);
};

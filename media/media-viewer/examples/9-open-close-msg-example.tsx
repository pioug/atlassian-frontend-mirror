import React, { useEffect, useState } from 'react';
import { token } from '@atlaskit/tokens';

const Example = () => {
	const [msg, setMsg] = useState<string>();
	useEffect(() => {
		const handleMsgEvent = (event: MessageEvent<any>) => {
			if (event.data.source === 'media') {
				setMsg(event.data.event);
			}
		};
		window.addEventListener('message', handleMsgEvent);

		return () => {
			window.removeEventListener('message', handleMsgEvent);
		};
	});
	return (
		<div style={{ padding: `${token('space.250', '20px')}` }}>
			<iframe
				name="Basic MediaViewer Example"
				title="Basic MediaViewer Example"
				src="./examples.html?groupId=media&packageId=media-viewer&exampleId=basic-example&mode=none"
				height="50%"
				width="50%"
			/>
			<p>Open and close the MediaViewer in the iframe to receive a message.</p>
			<p>
				<b>Message Received:</b> {msg}
			</p>
		</div>
	);
};

export default Example;

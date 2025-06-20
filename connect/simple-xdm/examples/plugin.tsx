// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react';

import { createPortal } from 'react-dom';
// import { renderToStaticMarkup, renderToString } from 'react-dom/server';

import Host from '../src/host';
import AP from '../src/plugin/ap';

const SampleApp = () => {
	const frames = document.getElementsByTagName('iframe');
	Array.from(frames).forEach((frame) => {
		if (frame.id.includes('my-addon')) {
			frame.contentWindow.AP = new AP();
		}
	});

	return <h1 data-testid="app-title">Sample App</h1>;
};

export default function SimpleXDMExample() {
	const [containerRef, setContainerRef] = useState(null);

	const extension = {
		addon_key: 'my-addon',
		key: 'example-panel',
		options: { globalOptions: {} },
	};
	const iframeParams = Host.create(extension, init);
	const iframeOptions = {
		id: iframeParams.id,
		name: iframeParams.name,
		frameBorder: 0,
	};

	function init(extensionId) {
		console.log('Bridge established:' + extensionId);
	}

	const mountNode = containerRef?.contentWindow?.document?.body;

	return (
		<>
			<iframe
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
				className="simple-xdm-test-iframe"
				title={iframeParams.name}
				{...iframeParams}
				{...iframeOptions}
				ref={setContainerRef}
			>
				{mountNode && createPortal(<SampleApp />, mountNode)}
			</iframe>
		</>
	);
}

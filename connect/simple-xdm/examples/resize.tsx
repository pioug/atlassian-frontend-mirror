import React, { useEffect } from 'react';

import resizeListener from '../src/plugin/resize-listener';

export default function ResizeContainer() {
	useEffect(() => {
		resizeListener.add(() => {
			const element = document.getElementById('content');

			const node = document.createElement('div');
			node.id = 'resize-responder';
			node.append('Appended after resize');

			element?.append(node);
		});
	});

	return (
		<div id="content">
			<p>Resize container</p>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop */}
			<div className="ac-content" />
		</div>
	);
}

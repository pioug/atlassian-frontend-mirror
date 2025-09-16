import React from 'react';

import Portal from '@atlaskit/portal';

export default [
	<Portal>
		<div>This content is rendered in a portal</div>
	</Portal>,
	<Portal zIndex={1000}>
		<div>This content has a custom z-index</div>
	</Portal>,
];

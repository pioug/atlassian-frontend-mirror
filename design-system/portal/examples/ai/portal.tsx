import React from 'react';

import Portal from '@atlaskit/portal';

const Examples = (): React.JSX.Element => (
	<>
		<Portal>
			<div>This content is rendered in a portal</div>
		</Portal>
		<Portal zIndex={1000}>
			<div>This content has a custom z-index</div>
		</Portal>
	</>
);
export default Examples;

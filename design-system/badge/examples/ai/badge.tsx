import React from 'react';

import Badge from '@atlaskit/badge';

const Examples = (): React.JSX.Element => (
	<>
		<Badge appearance="primary">5</Badge>
		<Badge appearance="important" max={99}>
			150
		</Badge>
	</>
);
export default Examples;

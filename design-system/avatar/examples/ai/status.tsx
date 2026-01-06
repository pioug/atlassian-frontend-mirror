import React from 'react';

import { Status } from '@atlaskit/avatar';

const Examples = (): React.JSX.Element => (
	<>
		<Status status="approved" />
		<Status status="declined" />
		<Status status="locked" />
	</>
);
export default Examples;

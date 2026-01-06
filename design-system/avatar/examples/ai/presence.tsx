import React from 'react';

import { Presence } from '@atlaskit/avatar';

const Examples = (): React.JSX.Element => (
	<>
		<Presence presence="online" />
		<Presence presence="busy" />
		<Presence presence="focus" />
		<Presence presence="offline" />
	</>
);
export default Examples;

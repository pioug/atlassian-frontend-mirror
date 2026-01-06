import React from 'react';

import { Skeleton } from '@atlaskit/avatar';

const Examples = (): React.JSX.Element => (
	<>
		<Skeleton size="xxlarge" />
		<Skeleton size="large" appearance="circle" />
		<Skeleton size="small" appearance="hexagon" weight="normal" color="blue" />
	</>
);
export default Examples;

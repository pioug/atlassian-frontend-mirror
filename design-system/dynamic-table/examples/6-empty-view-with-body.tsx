import React from 'react';

import { DynamicTableStateless } from '@atlaskit/dynamic-table';

import { head } from './content/sample-data';

const EmptyViewExample = (): React.JSX.Element => (
	<DynamicTableStateless
		head={head}
		emptyView={<h2>The table is empty and this is the empty view</h2>}
	/>
);

export default EmptyViewExample;

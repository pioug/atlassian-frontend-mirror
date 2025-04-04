import React from 'react';

import { DynamicTableStateless } from '@atlaskit/dynamic-table';

const EmptyViewNoHeaderExample = () => (
	<DynamicTableStateless emptyView={<h2>The table is empty and this is the empty view</h2>} />
);

export default EmptyViewNoHeaderExample;

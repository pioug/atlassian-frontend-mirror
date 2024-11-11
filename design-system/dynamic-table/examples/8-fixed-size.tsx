import React from 'react';

import DynamicTable from '@atlaskit/dynamic-table';

import { caption, head, rows } from './content/sample-data';

const FixedSizeExample = () => (
	<DynamicTable
		caption={caption}
		head={head}
		rows={rows}
		isFixedSize
		rowsPerPage={5}
		defaultPage={1}
		onSetPage={() => console.log('onSetPage')}
	/>
);

export default FixedSizeExample;

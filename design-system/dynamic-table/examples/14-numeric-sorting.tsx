import React from 'react';

import DynamicTable from '@atlaskit/dynamic-table';

import { caption, head, rows } from './content/sample-data-numerical';

const NumericSortingExample = () => (
	<DynamicTable
		caption={caption}
		head={head}
		rows={rows}
		rowsPerPage={5}
		defaultPage={1}
		loadingSpinnerSize="large"
		isLoading={false}
		isFixedSize
		defaultSortKey="numeric"
		defaultSortOrder="ASC"
		onSort={() => console.log('onSort')}
		onSetPage={() => console.log('onSetPage')}
	/>
);

export default NumericSortingExample;

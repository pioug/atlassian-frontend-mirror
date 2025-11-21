import React from 'react';

import DynamicTable from '@atlaskit/dynamic-table';

import { head, rows } from './content/sample-data';

export default (): React.JSX.Element => {
	return (
		<DynamicTable
			caption="List of US Presidents"
			head={head}
			rows={rows}
			rowsPerPage={5}
			defaultPage={1}
			isFixedSize
			defaultSortKey="term"
			defaultSortOrder="ASC"
			onSort={() => console.log('onSort')}
			onSetPage={() => console.log('onSetPage')}
		/>
	);
};

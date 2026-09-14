import React from 'react';

import DynamicTable from '@atlaskit/dynamic-table';

import { head, rows } from './content/sample-data';

export default function TableUncontrolled(): React.JSX.Element {
	return (
		<DynamicTable
			head={head}
			rows={rows}
			rowsPerPage={5}
			defaultPage={1}
			loadingSpinnerSize="large"
			isRankable
			testId="table"
		/>
	);
}

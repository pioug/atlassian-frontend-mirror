import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import { Code } from '@atlaskit/code';
import DynamicTable from '@atlaskit/dynamic-table';

import { caption, head, rows } from './content/sample-data';

// eslint-disable-next-line import/no-anonymous-default-export
export default function TogglePaginationExample(): React.JSX.Element {
	const [showPagination, setShowPagination] = useState(true);

	const togglePagination = () => {
		setShowPagination(!showPagination);
	};

	return (
		<div>
			<p>
				Pagination is enabled or disabled by setting or unsetting the <Code>rowsPerPage</Code>
				prop.
			</p>
			<Button onClick={togglePagination}>Toggle pagination</Button>
			<DynamicTable
				caption={caption}
				head={head}
				rows={rows.slice(0, 10)}
				rowsPerPage={showPagination ? 5 : undefined}
				defaultPage={1}
				isFixedSize
				defaultSortKey="term"
				defaultSortOrder="ASC"
				onSort={() => console.log('onSort')}
				onSetPage={() => console.log('onSetPage')}
			/>
		</div>
	);
}

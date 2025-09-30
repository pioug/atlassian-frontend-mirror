import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import DynamicTable from '@atlaskit/dynamic-table';

import { lorem } from './content/lorem';
import { caption, head, rows } from './content/sample-data';

// eslint-disable-next-line import/no-anonymous-default-export
export default function NoPaginationIfOnlyOnePageExample() {
	const [showMoreData, setShowMoreData] = useState(true);
	const [numRows, setNumRows] = useState(10);

	const toggleData = () => {
		setShowMoreData(!showMoreData);
	};

	const handleNumRowsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNumRows(+e.target.value);
	};

	return (
		<div>
			<Button onClick={toggleData}>Toggle 5 or 15 rows</Button>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<label htmlFor="rows" style={{ display: 'block' }}>
				Number of rows per page
			</label>
			{/* eslint-disable-next-line @atlaskit/design-system/no-html-text-input */}
			<input id="rows" value={numRows} onChange={handleNumRowsChange} />
			<p>We're trying to show {numRows} rows</p>
			<DynamicTable
				caption={caption}
				head={head}
				rows={showMoreData ? rows.slice(0, 15) : rows.slice(0, 5)}
				rowsPerPage={numRows}
				defaultPage={1}
				isFixedSize
				defaultSortKey="term"
				defaultSortOrder="ASC"
				onSort={() => console.log('onSort')}
				onSetPage={() => console.log('onSetPage')}
			/>
			<p>{lorem}</p>
			<p>{lorem}</p>
			<p>{lorem}</p>
		</div>
	);
}

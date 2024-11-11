import React, { useEffect, useRef, useState } from 'react';

import { DynamicTableStateless } from '@atlaskit/dynamic-table';
import { type RowType } from '@atlaskit/dynamic-table/types';
import { token } from '@atlaskit/tokens';

import { head, rows } from './content/sample-data';

const paddingStyle = { padding: `${token('space.100', '8px')} 0` };

const rowsWithTabIndex: Array<RowType> = rows.map((row) => ({
	...row,
	tabIndex: 0,
}));

const FocusRowExample = () => {
	const [autoFocusDone, setAutoFocusDone] = useState(false);
	const firstRowRef = useRef<HTMLTableRowElement>(null);

	rowsWithTabIndex[0].ref = firstRowRef;

	useEffect(() => {
		if (firstRowRef.current && !autoFocusDone) {
			firstRowRef.current.focus();
			setAutoFocusDone(true);
		}
	}, [autoFocusDone]);

	return (
		<>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<h4 style={paddingStyle}>Click on any row to focus on it</h4>
			<DynamicTableStateless head={head} rows={rowsWithTabIndex} rowsPerPage={40} page={1} />
		</>
	);
};

export default FocusRowExample;

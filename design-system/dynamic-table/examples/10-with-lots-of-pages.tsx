/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import DynamicTable from '../src';

import { head, rows } from './content/sample-data';

export default () => {
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

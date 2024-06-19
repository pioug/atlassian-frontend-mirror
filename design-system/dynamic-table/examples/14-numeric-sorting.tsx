/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import DynamicTable from '../src';

import { caption, head, rows } from './content/sample-data-numerical';

// eslint-disable-next-line import/no-anonymous-default-export
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

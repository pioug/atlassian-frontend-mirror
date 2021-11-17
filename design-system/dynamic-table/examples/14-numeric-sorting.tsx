/** @jsx jsx */
import { jsx } from '@emotion/core';

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

import React from 'react';

import DynamicTable from '@atlaskit/dynamic-table';

import { head, rows } from './content/dynamic-table-data';

/**
 * Dynamic table can quickly get out of control with prop based configuration
 */
export default function Basic() {
  return (
    <>
      <DynamicTable
        rows={rows}
        head={head}
        testId="the-table"
        isFixedSize
        isLoading={false}
      />
      {/* <DynamicTable
        caption={caption}
        head={head}
        rows={rows}
        rowsPerPage={10}
        defaultPage={1}
        loadingSpinnerSize="large"
        isLoading={isLoading}
        isFixedSize
        defaultSortKey="term"
        defaultSortOrder="ASC"
        onSort={() => console.log('onSort')}
        onSetPage={() => console.log('onSetPage')}
        testId="the-table"
        highlightedRowIndex={selectedRows}
      /> */}
    </>
  );
}

import React from 'react';

import DynamicTable from '../src';

import { head, rows } from './content/sample-data';

export default function TableUncontrolled() {
  return (
    <DynamicTable
      head={head}
      rows={rows}
      rowsPerPage={10}
      defaultPage={1}
      loadingSpinnerSize="large"
      isLoading={false}
      isFixedSize
      defaultSortKey="term"
      defaultSortOrder="ASC"
      onSort={() => console.log('onSort')}
      onSetPage={() => console.log('onSetPage')}
    />
  );
}

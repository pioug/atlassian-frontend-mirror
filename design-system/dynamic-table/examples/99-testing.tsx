/** @jsx jsx */
import { useState } from 'react';

import { jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';

import DynamicTable from '../src';

import { caption, head, rows } from './content/sample-data';

export default () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  return (
    <div>
      <Button onClick={() => setIsLoading((loading) => !loading)}>
        Toggle loading state {isLoading ? 'off' : 'on'}
      </Button>
      <Button
        onClick={() => setSelectedRows([1, 3])}
        testId={'button-toggle-selected-rows'}
      >
        Toggle selected rows
      </Button>
      <DynamicTable
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
      />
    </div>
  );
};

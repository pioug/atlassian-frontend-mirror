import React, { useState } from 'react';

import styled from 'styled-components';

import Button from '@atlaskit/button/standard-button';

import DynamicTable from '../src';

import { caption, head, rows } from './content/sample-data';

const Wrapper = styled.div`
  min-width: 600px;
`;

export default () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  return (
    <Wrapper>
      <Button onClick={() => setIsLoading(!isLoading)}>
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
    </Wrapper>
  );
};

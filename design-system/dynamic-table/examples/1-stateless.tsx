import React, { useState } from 'react';

import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/standard-button';

import { DynamicTableStateless } from '../src';

import { head, rows } from './content/sample-data';

export default function TableControlled() {
  const [pageNumber, setPageNumber] = useState(3);
  const navigateTo = (pageNumber: number) => {
    setPageNumber(pageNumber);
  };

  return (
    <>
      <ButtonGroup>
        <Button
          isDisabled={pageNumber === 1}
          onClick={() => navigateTo(pageNumber - 1)}
        >
          Previous Page
        </Button>
        <Button
          isDisabled={pageNumber === 5}
          onClick={() => navigateTo(pageNumber + 1)}
        >
          Next Page
        </Button>
      </ButtonGroup>
      <DynamicTableStateless
        head={head}
        rows={rows}
        rowsPerPage={10}
        page={pageNumber}
        loadingSpinnerSize="large"
        isLoading={false}
        isFixedSize
        sortKey="term"
        sortOrder="DESC"
        onSort={() => console.log('onSort')}
        onSetPage={() => console.log('onSetPage')}
      />
    </>
  );
}

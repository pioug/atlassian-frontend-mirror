import React, { useState } from 'react';

import styled from 'styled-components';

import Button from '@atlaskit/button';

import DynamicTable from '../src';

import { caption, head, rows } from './content/sample-data';

const Wrapper = styled.div`
  min-width: 600px;
`;

export default () => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Wrapper>
      <Button onClick={() => setIsLoading(!isLoading)}>
        Toggle loading state {isLoading ? 'off' : 'on'}
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
      />
    </Wrapper>
  );
};

import React from 'react';
import styled from 'styled-components';
import DynamicTable from '../src';
import { caption, head, rows } from './content/sample-data-numerical';

const Wrapper = styled.div`
  min-width: 600px;
`;

export default class extends React.Component<{}, {}> {
  render() {
    return (
      <Wrapper>
        <DynamicTable
          caption={caption}
          head={head}
          rows={rows}
          rowsPerPage={10}
          defaultPage={1}
          loadingSpinnerSize="large"
          isLoading={false}
          isFixedSize
          defaultSortKey="numeric"
          defaultSortOrder="ASC"
          onSort={() => console.log('onSort')}
          onSetPage={() => console.log('onSetPage')}
        />
      </Wrapper>
    );
  }
}

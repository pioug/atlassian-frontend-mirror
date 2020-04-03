import React from 'react';
import styled from 'styled-components';
import Button, { ButtonGroup } from '@atlaskit/button';
import { DynamicTableStateless } from '../src';
import { caption, head, rows } from './content/sample-data';

const Wrapper = styled.div`
  min-width: 600px;
`;

interface StateType {
  pageNumber: number;
}

export default class extends React.Component<{}, StateType> {
  state = {
    pageNumber: 3,
  };

  navigateTo = (pageNumber: number) => {
    this.setState({
      pageNumber,
    });
  };

  render() {
    const { pageNumber } = this.state;
    return (
      <Wrapper>
        <ButtonGroup>
          <Button
            isDisabled={pageNumber === 1}
            onClick={() => this.navigateTo(pageNumber - 1)}
          >
            Previous Page
          </Button>
          <Button
            isDisabled={pageNumber === 5}
            onClick={() => this.navigateTo(pageNumber + 1)}
          >
            Next Page
          </Button>
        </ButtonGroup>
        <DynamicTableStateless
          caption={caption}
          head={head}
          rows={rows}
          rowsPerPage={10}
          page={this.state.pageNumber}
          loadingSpinnerSize="large"
          isLoading={false}
          isFixedSize
          sortKey="term"
          sortOrder="DESC"
          onSort={() => console.log('onSort')}
          onSetPage={() => console.log('onSetPage')}
        />
      </Wrapper>
    );
  }
}

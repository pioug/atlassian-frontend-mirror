import React from 'react';
import styled from 'styled-components';
import Button from '@atlaskit/button';
import DynamicTable from '../src';
import { caption, head, rows } from './content/sample-data';

const Wrapper = styled.div`
  min-width: 600px;
`;

interface State {
  showPagination: boolean;
}

export default class extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      showPagination: true,
    };
  }

  togglePagination = () => {
    this.setState({
      showPagination: !this.state.showPagination,
    });
  };

  render() {
    return (
      <Wrapper>
        <p>
          Pagination is enabled or disabled by setting or unsetting the{' '}
          <code>rowsPerPage</code>
          prop.
        </p>
        <Button onClick={this.togglePagination}>Toggle pagination</Button>
        <DynamicTable
          caption={caption}
          head={head}
          rows={rows.slice(0, 5)}
          rowsPerPage={this.state.showPagination ? 10 : undefined}
          defaultPage={1}
          isFixedSize
          defaultSortKey="term"
          defaultSortOrder="ASC"
          onSort={() => console.log('onSort')}
          onSetPage={() => console.log('onSetPage')}
        />
      </Wrapper>
    );
  }
}

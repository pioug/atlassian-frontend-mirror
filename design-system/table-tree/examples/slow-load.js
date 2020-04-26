import React, { Component } from 'react';

import TableTree, { Cell, Header, Headers, Row, Rows } from '../src';

import staticData from './data-freeform-nodes.json';

export default class SlowLoad extends Component {
  state = {
    tableData: null,
  };

  dataTimeoutId = undefined;

  componentDidMount() {
    this.dataTimeoutId = setTimeout(() => {
      this.setState({
        tableData: staticData.children,
      });
    }, 3000);
  }

  componentWillUnmount() {
    clearTimeout(this.dataTimeoutId);
  }

  render() {
    return (
      <TableTree>
        <Headers>
          <Header width={200}>Title</Header>
          <Header width={100}>Numbering</Header>
        </Headers>
        <Rows
          items={this.state.tableData}
          render={({ id, title, numbering, children }) => (
            <Row itemId={id} items={children} hasChildren={children.length > 0}>
              <Cell>{title}</Cell>
              <Cell>{numbering}</Cell>
            </Row>
          )}
        />
      </TableTree>
    );
  }
}

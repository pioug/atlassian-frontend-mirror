import React, { Component } from 'react';

import TableTree, { Cell, Header, Headers, Row, Rows } from '../src';

import staticData from './data-cleancode-toc.json';

// eslint-disable-next-line import/no-anonymous-default-export
export default class extends Component {
  state = {
    roots: null,
  };

  render() {
    return (
      <TableTree>
        <Headers>
          <Header width={300}>Chapter title</Header>
          <Header width={100}>Numbering</Header>
          <Header width={100}>Page</Header>
        </Headers>
        <Rows
          items={staticData.children}
          render={({ title, numbering, page, children }) => (
            <Row
              expandLabel="Expand"
              collapseLabel="Collapse"
              itemId={numbering}
              items={children}
              hasChildren={children.length > 0}
            >
              <Cell singleLine>{title}</Cell>
              <Cell singleLine>{numbering}</Cell>
              <Cell singleLine>{page}</Cell>
            </Row>
          )}
        />
      </TableTree>
    );
  }
}

import React from 'react';

import TableTree, { Cell, Header, Headers, Row, Rows } from '../src';

import staticData from './data-cleancode-toc.json';

export default () => (
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

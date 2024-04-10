import React from 'react';

import TableTree, { Cell, Header, Headers, Row, Rows } from '../../src';

import items from './data';

type Item = {
  title: string;
  numbering: string;
  page: number;
  children?: Item[];
};

export default () => (
  <TableTree label="Nested loading state">
    <Headers>
      <Header width={200}>Chapter title</Header>
      <Header width={120}>Numbering</Header>
      <Header width={100}>Page</Header>
    </Headers>
    <Rows
      items={items}
      render={({ title, numbering, page, children = [] }: Item) => (
        <Row
          itemId={numbering}
          items={undefined}
          hasChildren={children.length > 0}
          isDefaultExpanded
        >
          <Cell singleLine>{title}</Cell>
          <Cell>{numbering}</Cell>
          <Cell>{page}</Cell>
        </Row>
      )}
    />
  </TableTree>
);

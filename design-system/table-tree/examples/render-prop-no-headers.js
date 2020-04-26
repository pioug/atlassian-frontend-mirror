import React from 'react';

import TableTree, { Cell, Row, Rows } from '../src';

import staticData from './data-cleancode-toc.json';

export default () => (
  <TableTree>
    <Rows
      items={staticData.children}
      render={({ title, numbering, page, children }) => (
        <Row
          items={children}
          itemId={numbering}
          hasChildren={children.length > 0}
        >
          <Cell width={300} singleLine>
            {title}
          </Cell>
          <Cell width={50}>{page}</Cell>
        </Row>
      )}
    />
  </TableTree>
);

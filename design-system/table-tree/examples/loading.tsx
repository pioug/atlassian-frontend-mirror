import React from 'react';

import TableTree, { Header, Headers, Rows } from '../src';

export default () => (
  <TableTree>
    <Headers>
      <Header width={200}>Title</Header>
      <Header width={120}>Numbering</Header>
    </Headers>
    <Rows items={undefined} render={() => null} />
  </TableTree>
);

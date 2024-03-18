import React from 'react';

import TableTree, { Header, Headers, Rows } from '../../src';

export default () => (
  <TableTree>
    <Headers>
      <Header width={200}>Chapter title</Header>
      <Header width={120}>Numbering</Header>
      <Header width={100}>Page</Header>
    </Headers>
    <Rows items={undefined} render={() => null} />
  </TableTree>
);

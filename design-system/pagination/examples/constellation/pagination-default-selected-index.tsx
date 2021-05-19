import React from 'react';

import Pagination from '../../src';

export default function PaginationDefaultSelectedIndexExample() {
  return (
    <Pagination
      defaultSelectedIndex={5}
      pages={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
    />
  );
}

import React from 'react';
import Pagination from '../../src';

const DefaultSelectedIndexPagination = () => {
  return (
    <Pagination
      defaultSelectedIndex={5}
      pages={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
    />
  );
};

export default DefaultSelectedIndexPagination;

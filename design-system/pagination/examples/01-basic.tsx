import React, { SyntheticEvent, useState } from 'react';

import Pagination from '../src';

const Pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function BasicExample() {
  const [onChangeEvent, setOnChangeEvent] = useState(1);

  const handleChange = (event: SyntheticEvent, newPage: any) =>
    setOnChangeEvent(newPage);

  return (
    <>
      <Pagination testId="pagination" pages={Pages} onChange={handleChange} />
      <p>selected page from onChange hook: {onChangeEvent}</p>
    </>
  );
}

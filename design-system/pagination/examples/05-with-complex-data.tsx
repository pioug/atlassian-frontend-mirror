import React, { SyntheticEvent, useState } from 'react';

import Pagination from '../src';

const PAGES = [...Array(10)].map((_, i) => ({
  label: i + 1,
  href: `page-${i + 1}`,
}));

export default function ComplexDataExample() {
  const [onChangeEvent, setOnChangeEvent] = useState({
    label: 1,
    href: 'page-1',
  });

  const handleChange = (event: SyntheticEvent, newPage: any) =>
    setOnChangeEvent(newPage);

  const getLabel = ({ label }: any) => label;

  return (
    <>
      <Pagination
        testId="pagination"
        pages={PAGES}
        onChange={handleChange}
        getPageLabel={getLabel}
      />
      <p>Received onChange event:</p>
      <pre>
        label: {onChangeEvent.label}
        <br />
        href: {onChangeEvent.href}
      </pre>
    </>
  );
}

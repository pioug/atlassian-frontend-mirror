/** @jsx jsx */
import { useEffect, useState } from 'react';

import { jsx } from '@emotion/core';

import DynamicTable from '../src';

import Wrapper from './components/wrapper';

const caption = 'Hello';
const head = {
  cells: [
    {
      content: 'Status',
      key: 'status',
      isSortable: true,
      width: 15,
    },
    {
      content: 'Plan name',
      key: 'name',
      isSortable: true,
      width: 35,
    },
    {
      content: 'Other column',
      key: 'Other',
      isSortable: true,
      width: 35,
    },
  ],
};

const createRow = (rowId: number, suffix: string) => ({
  cells: [
    { content: `R${rowId} C1 - ${suffix}`, key: `R${rowId} C1` },
    { content: `R${rowId} C2 - ${suffix}`, key: `R${rowId} C2` },
    { content: `R${rowId} C3 - ${suffix}`, key: `R${rowId} C3` },
  ],
});

export default () => {
  const [suffix, setSuffix] = useState(Date.now());

  useEffect(() => {
    setInterval(() => {
      setSuffix(Date.now());
    }, 3000);
  }, []);

  const rows = Array.from({ length: 20 }, (_, id) =>
    createRow(id, suffix.toString()),
  );

  return (
    <Wrapper>
      <DynamicTable
        caption={caption}
        head={head}
        rows={rows}
        rowsPerPage={10}
        defaultPage={1}
        loadingSpinnerSize="large"
        isLoading={false}
        isFixedSize
        defaultSortKey="status"
        defaultSortOrder="ASC"
        onSort={() => console.log('onSort')}
        onSetPage={() => console.log('onSetPage')}
      />
    </Wrapper>
  );
};

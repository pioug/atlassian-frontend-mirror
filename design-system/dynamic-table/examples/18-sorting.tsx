import React, { FC } from 'react';

import { v4 as uuid } from 'uuid';

import DynamicTable from '../src';

const caption = 'Example issue with DynamicTable';

const head = {
  cells: [
    {
      key: 'number',
      content: 'Number',
      isSortable: true,
    },
    {
      key: 'string',
      content: 'String',
      isSortable: true,
    },
  ],
};

const rows = [
  [1, 'd'],
  [2, 'c'],
  [3, 'a'],
  [4, 'b'],
].map(([number, letter]) => ({
  key: uuid(),
  cells: [
    {
      key: number,
      content: number,
    },
    {
      key: letter,
      content: letter,
    },
  ],
}));

const SortingExample: FC = () => (
  <div style={{ maxWidth: 800 }}>
    <DynamicTable
      caption={caption}
      head={head}
      rows={rows}
      isFixedSize
      defaultSortKey="number"
      defaultSortOrder="ASC"
    />
  </div>
);

export default SortingExample;

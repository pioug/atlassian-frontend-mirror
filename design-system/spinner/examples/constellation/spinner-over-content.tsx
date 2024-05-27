import React, { useState } from 'react';

import Button from '@atlaskit/button/new';
import { DynamicTableStateless } from '@atlaskit/dynamic-table';
import { type HeadType, type RowType } from '@atlaskit/dynamic-table/types';

const head: HeadType = {
  cells: [
    {
      key: 'name',
      content: 'Name',
    },
    {
      key: 'size',
      content: 'Size',
    },
    {
      key: 'last-commit',
      content: 'Last commit',
    },
    {
      key: 'message',
      content: 'Message',
    },
  ],
};

const rows: RowType[] = [
  {
    cells: [
      { content: '.editorconfig' },
      { content: '189 B' },
      { content: '2018-02-97' },
      {
        content:
          'Add .editorconfig to easily configure standard editor settings',
      },
    ],
  },
  {
    cells: [
      { content: '.eslintignore' },
      { content: '1.21 KB' },
      { content: '2022-08-17' },
      {
        content: 'DSP-3204 chore: deleted icon-priority',
      },
    ],
  },
  {
    cells: [
      { content: '.eslintrc.js' },
      { content: '28.62 KB' },
      { content: '2022-08-17' },
      {
        content: 'DSP-3204 chore: deleted icon-priority',
      },
    ],
  },
  {
    cells: [
      { content: '.gitattributes' },
      { content: '951 B' },
      { content: '2022-09-05' },
      {
        content: 'DSP-6586 add correct docs delta',
      },
    ],
  },
  {
    cells: [
      { content: '.gitignore' },
      { content: '2.67 KB' },
      { content: '2022-09-12' },
      {
        content: 'NO-ISSUE scope gitignore reports to contact folder',
      },
    ],
  },
];

const SpinnerOverContentExample = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Button onClick={() => setIsLoading((loading) => !loading)}>
        Toggle loading
      </Button>
      <DynamicTableStateless
        head={head}
        rows={rows}
        rowsPerPage={5}
        page={1}
        isLoading={isLoading}
      />
    </>
  );
};

export default SpinnerOverContentExample;

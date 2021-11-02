import React, { FC, ReactNode, useEffect, useState } from 'react';

import { v4 as uuid } from 'uuid';

import { token } from '@atlaskit/tokens';

import DynamicTable from '../src';

const caption = 'Example issue with DynamicTable';

interface StateIndicatorProps {
  children?: ReactNode;
}

const StateIndicator: FC<StateIndicatorProps> = (props) => {
  const [color, setColor] = useState('red');

  useEffect(() => {
    const timer = setTimeout(() => {
      setColor('green');
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        backgroundColor: color,
        color: token('color.text.onBold', 'f5f5dc'),
      }}
    >
      {props.children}
    </div>
  );
};

const head = {
  cells: [
    {
      key: 'number',
      content: 'Number',
      isSortable: true,
    },
  ],
};

const rows = [1, 2, 3, 4].map((number) => ({
  key: uuid(),
  cells: [
    {
      key: number,
      content: <StateIndicator>{number}</StateIndicator>,
    },
  ],
}));

const SortingExample: FC = () => (
  <div style={{ maxWidth: 800 }}>
    <DynamicTable
      caption={caption}
      head={head}
      rows={rows}
      rowsPerPage={10}
      defaultPage={1}
      isFixedSize
      defaultSortKey="number"
      defaultSortOrder="ASC"
    />
  </div>
);

export default SortingExample;

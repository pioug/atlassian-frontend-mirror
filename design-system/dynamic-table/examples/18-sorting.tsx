import React, { ReactNode, SFC, useEffect, useState } from 'react';

import { v4 as uuid } from 'uuid';

import DynamicTable from '../src';

const caption = 'Example issue with DynamicTable';

interface StateIndicatorProps {
  children?: ReactNode;
}

const StateIndicator: SFC<StateIndicatorProps> = (props) => {
  const [color, setColor] = useState('red');

  useEffect(() => {
    const timer = setTimeout(() => {
      setColor('green');
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ backgroundColor: color, color: '#f5f5dc' }}>
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

const rows = [1, 2, 3, 4].map((number: number, index: number) => ({
  key: uuid(),
  cells: [
    {
      key: number,
      content: <StateIndicator>{number}</StateIndicator>,
    },
  ],
}));

// eslint-disable-next-line import/no-anonymous-default-export
export default class extends React.Component<{}, {}> {
  render() {
    return (
      <div style={{ width: 800 }}>
        <DynamicTable
          caption={caption}
          head={head}
          rows={rows}
          rowsPerPage={10}
          defaultPage={1}
          loadingSpinnerSize="large"
          isLoading={false}
          isFixedSize
          defaultSortKey="number"
          defaultSortOrder="ASC"
        />
      </div>
    );
  }
}

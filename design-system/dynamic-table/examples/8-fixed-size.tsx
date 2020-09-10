import React from 'react';

import DynamicTable from '../src';

import { caption, head, rows } from './content/sample-data';

// eslint-disable-next-line import/no-anonymous-default-export
export default class extends React.Component<{}, {}> {
  render() {
    return (
      <DynamicTable
        caption={caption}
        head={head}
        rows={rows}
        isFixedSize
        rowsPerPage={10}
        defaultPage={1}
        onSetPage={() => console.log('onSetPage')}
      />
    );
  }
}

import React from 'react';

import { DynamicTableStateless } from '../src';

import { head } from './content/sample-data';

// eslint-disable-next-line import/no-anonymous-default-export
export default class extends React.Component<{}, {}> {
  render() {
    return (
      <DynamicTableStateless
        head={head}
        emptyView={<h2>The table is empty and this is the empty view</h2>}
      />
    );
  }
}

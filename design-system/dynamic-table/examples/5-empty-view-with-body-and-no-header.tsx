import React from 'react';
import { DynamicTableStateless } from '../src';

export default class extends React.Component<{}, {}> {
  render() {
    return (
      <DynamicTableStateless
        emptyView={<h2>The table is empty and this is the empty view</h2>}
      />
    );
  }
}

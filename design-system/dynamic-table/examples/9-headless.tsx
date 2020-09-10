import React from 'react';

import DynamicTable from '../src';

import { rows } from './content/sample-data';

// eslint-disable-next-line import/no-anonymous-default-export
export default class extends React.Component<{}, {}> {
  render() {
    return <DynamicTable rows={rows} />;
  }
}

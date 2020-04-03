import React from 'react';
import DynamicTable from '../src';
import { rows } from './content/sample-data';

export default class extends React.Component<{}, {}> {
  render() {
    return <DynamicTable rows={rows} />;
  }
}

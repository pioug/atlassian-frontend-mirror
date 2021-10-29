/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/core';

import DynamicTable from '../src';

import Wrapper from './components/wrapper';
import { caption, head, rows } from './content/sample-data';

// eslint-disable-next-line import/no-anonymous-default-export
export default class extends React.Component<{}, {}> {
  render() {
    return (
      <Wrapper>
        <DynamicTable
          caption={caption}
          head={head}
          rows={rows}
          rowsPerPage={5}
          defaultPage={1}
          isFixedSize
          defaultSortKey="term"
          defaultSortOrder="ASC"
          onSort={() => console.log('onSort')}
          onSetPage={() => console.log('onSetPage')}
        />
      </Wrapper>
    );
  }
}

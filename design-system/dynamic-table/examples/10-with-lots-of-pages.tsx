/** @jsx jsx */
import { jsx } from '@emotion/core';

import DynamicTable from '../src';

import Wrapper from './components/wrapper';
import { head, rows } from './content/sample-data';

export default () => {
  return (
    <Wrapper>
      <DynamicTable
        caption="List of US Presidents"
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
};

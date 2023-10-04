/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import DynamicTable from '../src';

import { head, rows } from './content/sample-data';

const wrapperStyles = css({
  overflowX: 'auto',
});

const overflowStyles = css({
  width: 1000,
});

const HeadlessExample = () => (
  <div css={wrapperStyles}>
    <div css={overflowStyles}>
      <DynamicTable head={head} rows={rows.slice(0, 10)} />
    </div>
  </div>
);

export default HeadlessExample;

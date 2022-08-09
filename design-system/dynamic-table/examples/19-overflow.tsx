/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { token } from '@atlaskit/tokens';

import DynamicTable from '../src';

import { head, rows } from './content/sample-data';

const wrapperStyles = css({
  position: 'relative',
  table: {
    width: 1000,
  },
});

const overflow = css({
  overflowX: 'auto',
  '::after': {
    width: 8,
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 'calc(100% - 8px)',
    background: `linear-gradient(to right, ${token(
      'color.blanket',
      'rgba(99, 114, 130, 0)',
    )} 0px, ${token('color.blanket', 'rgba(9, 30, 66, 0.13)')} 100%)`,
    content: "''",
  },
});

const HeadlessExample = () => (
  <div css={wrapperStyles}>
    <div css={overflow}>
      <DynamicTable head={head} rows={rows.slice(0, 10)} />
    </div>
  </div>
);

export default HeadlessExample;

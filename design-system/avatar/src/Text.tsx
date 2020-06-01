/** @jsx jsx */
import { FC, ReactNode } from 'react';

import { css, jsx } from '@emotion/core';

import { N200, N900 } from '@atlaskit/theme/colors';

const Text: FC<{
  secondary?: boolean;
  children: ReactNode;
  truncate: boolean;
}> = ({ secondary, children, truncate }) => (
  <span
    css={css`
      display: block;
      margin: 0;
      color: ${N900};

      ${truncate &&
        `
        overflow-x: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      `}

      ${secondary &&
        `
          color: ${N200};
          font-size: 0.85em;
      `}
    `}
  >
    {children}
  </span>
);

export default Text;

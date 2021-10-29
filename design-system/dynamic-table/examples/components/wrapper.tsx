/** @jsx jsx */
import { FC } from 'react';

import { css, jsx } from '@emotion/core';

const wrapperStyles = css({
  minWidth: '600px',
});

const Wrapper: FC = ({ children }) => <div css={wrapperStyles}>{children}</div>;

export default Wrapper;

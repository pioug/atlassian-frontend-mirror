/** @jsx jsx */
import type { FC, ReactElement } from 'react';

import { css, jsx } from '@emotion/react';

const wrapperStyle = css({
  display: 'inline-block',
});

type Prop = {
  children: ReactElement;
};

export const InlineImageWrapper: FC<Prop> = ({ children }) => {
  return <div css={wrapperStyle}>{children}</div>;
};

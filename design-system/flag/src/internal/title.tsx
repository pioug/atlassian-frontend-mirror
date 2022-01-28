/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { FC } from 'react';

interface TitleProps {
  color: string;
}

const titleStyles = css({
  padding: `0 0 0 16px`,
  flex: 1,
  fontWeight: 600,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

const Title: FC<TitleProps> = ({ color, children }) => (
  <span style={{ color }} css={titleStyles}>
    {children}
  </span>
);

export default Title;

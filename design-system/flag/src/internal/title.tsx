/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { FC } from 'react';

interface TitleProps {
  color: string;
}

const titleStyles = css({
  padding: `2px 0 6px 16px`,
  flex: 1,
  fontWeight: 600,
});

const Title: FC<TitleProps> = ({ color, children }) => (
  <span style={{ color }} css={titleStyles}>
    {children}
  </span>
);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Title;

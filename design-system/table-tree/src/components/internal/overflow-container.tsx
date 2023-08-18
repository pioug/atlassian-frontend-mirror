/** @jsx jsx */
import { FC, HTMLAttributes, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

interface OverflowContainerProps {
  isSingleLine?: boolean;
  chilren?: ReactNode;
}

const overflowContainerStyles = css({
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  // Use "clip" overflow to allow ellipses on x-axis without clipping descenders
  '@supports not (overflow-x: clip)': {
    overflow: 'hidden',
  },
  '@supports (overflow-x: clip)': {
    overflowX: 'clip',
  },
});

/**
 * __Overflow container__
 */
const OverflowContainer: FC<
  OverflowContainerProps & HTMLAttributes<HTMLSpanElement>
> = ({ isSingleLine, ...props }) => (
  // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
  <span css={isSingleLine && overflowContainerStyles} {...props} />
);

export default OverflowContainer;

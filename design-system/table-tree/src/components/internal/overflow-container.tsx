/** @jsx jsx */
import { FC, HTMLAttributes } from 'react';

import { css, jsx } from '@emotion/core';

interface OverflowContainerProps {
  isSingleLine?: boolean;
}

const overflowContainerStyles = css({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
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

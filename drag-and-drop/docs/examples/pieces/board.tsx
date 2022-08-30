/** @jsx jsx */

import { forwardRef, memo, ReactNode } from 'react';

import { css, jsx } from '@emotion/react';

import { columnGap, gridSize } from '../util/constants';

type BoardProps = {
  children: ReactNode;
};

const boardStyles = css({
  display: 'flex',
  padding: columnGap,
  justifyContent: 'center',
  gap: columnGap,
  flexDirection: 'row',
  '--grid': `${gridSize}px`,
});

const Board = forwardRef<HTMLDivElement, BoardProps>(
  ({ children }: BoardProps, ref) => {
    return (
      <div css={boardStyles} ref={ref}>
        {children}
      </div>
    );
  },
);

export default memo(Board);

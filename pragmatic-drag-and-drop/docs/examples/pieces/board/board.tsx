/** @jsx jsx */

import { forwardRef, memo, ReactNode, useEffect } from 'react';

import { css, jsx } from '@emotion/react';

import { autoScrollWindowForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';

import { columnGap, gridSize } from '../../util/constants';

import { useBoardContext } from './board-context';

type BoardProps = {
  children: ReactNode;
};

const boardStyles = css({
  display: 'flex',
  justifyContent: 'center',
  gap: columnGap,
  flexDirection: 'row',
  '--grid': `${gridSize}px`,
  height: 480,
});

const Board = forwardRef<HTMLDivElement, BoardProps>(
  ({ children }: BoardProps, ref) => {
    const { instanceId } = useBoardContext();

    useEffect(() => {
      return autoScrollWindowForElements({
        canScroll: ({ source }) => source.data.instanceId === instanceId,
      });
    }, [instanceId]);

    return (
      <div css={boardStyles} ref={ref}>
        {children}
      </div>
    );
  },
);

export default memo(Board);

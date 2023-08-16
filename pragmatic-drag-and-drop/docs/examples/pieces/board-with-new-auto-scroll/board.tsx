/** @jsx jsx */

import { Fragment, memo, ReactNode, useEffect, useRef } from 'react';

import { css, jsx } from '@emotion/react';
import invariant from 'tiny-invariant';

import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { autoScrollForFiles } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/file';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/util/combine';
import { token } from '@atlaskit/tokens';

import { columnGap, gridSize } from '../../util/constants';
import { GlobalStyles } from '../../util/global-styles';

const boardStyles = css({
  '--grid': `${gridSize}px`,
  display: 'flex',
  gap: columnGap,
  flexDirection: 'row',
  height: '100%',
  padding: columnGap,
  boxSizing: 'border-box',
  width: 'min-content', // doing this so that we get the correct padding around the element
});

const scrollContainerStyles = css({
  border: `${token('border.width', '2px')} solid ${token(
    'color.chart.purple.bold',
    'purple',
  )}`,
  maxWidth: 600,
  overflowY: 'auto',
  // TODO: remove margin before shipping
  margin: 'calc(var(--grid) * 4) auto 0 auto',
  height: 480,
});

function Board({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    invariant(ref.current);
    return combine(
      autoScrollForElements({
        element: ref.current,
      }),
      autoScrollForFiles({ element: ref.current }),
    );
  }, []);
  return (
    <Fragment>
      <div ref={ref} css={scrollContainerStyles}>
        <div css={boardStyles}>{children}</div>
      </div>
      <GlobalStyles />
    </Fragment>
  );
}

export default memo(Board);

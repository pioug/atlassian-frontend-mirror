import React, { ReactNode } from 'react';

import { ClassNames, css, SerializedStyles } from '@emotion/core';

import { line } from './internal/constants';

type Edge = 'top' | 'right' | 'bottom' | 'left';

export type DropIndicatorProps = {
  children: (props: { className?: string }) => ReactNode;
  /**
   * The edge of the child to draw the drop indicator on. Use `null` to hide the indicator.
   */
  edge: Edge | null;
  /**
   * The distance between draggable items.
   */
  gap?: number;
};

const lineStyles = css({
  // side effect: adding 'position:relative' to element
  // this is needed to support drawing the line with `position:absolute`
  position: 'relative',
  '::after': {
    display: 'block',
    position: 'absolute',
    zIndex: 1,
    background: line.backgroundColor,
    content: '""',
    opacity: 0,
    pointerEvents: 'none',
  },
});

const edgeStyles: Record<Edge, SerializedStyles> = {
  top: css({
    '::after': {
      height: line.thickness,
      top: 'var(--local-line-offset)',
      right: 0,
      left: 0,
      opacity: 1,
    },
  }),
  right: css({
    '::after': {
      width: line.thickness,
      top: 0,
      right: 'var(--local-line-offset)',
      bottom: 0,
      opacity: 1,
    },
  }),
  bottom: css({
    '::after': {
      height: line.thickness,
      right: 0,
      bottom: 'var(--local-line-offset)',
      left: 0,
      opacity: 1,
    },
  }),
  left: css({
    '::after': {
      width: line.thickness,
      top: 0,
      bottom: 0,
      left: 'var(--local-line-offset)',
      opacity: 1,
    },
  }),
};

/**
 * __Drop indicator__
 *
 * A drop indicator is used to communicate the intended resting place of the draggable item. The orientation of the drop indicator should always match the direction of the content flow.
 */
const DropIndicator = ({ children, edge, gap = 0 }: DropIndicatorProps) => {
  /**
   * To clearly communicate the resting place of a draggable item during a drag operation,
   * the drop indicator should be positioned half way between draggable items.
   */
  const lineOffset = -0.5 * (gap + line.thickness);

  return (
    <ClassNames>
      {({ css }) => {
        const lineOffsetStyles = css({
          '--local-line-offset': `${lineOffset}px`,
        });

        return children({
          className: css([
            lineStyles,
            lineOffsetStyles,
            edge && edgeStyles[edge],
          ]),
        });
      }}
    </ClassNames>
  );
};

export default DropIndicator;

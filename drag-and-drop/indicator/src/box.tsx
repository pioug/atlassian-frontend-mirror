/** @jsx jsx */

import type { CSSProperties } from 'react';

import { css, jsx, SerializedStyles } from '@emotion/core';

import { line } from './internal/constants';

type Edge = 'top' | 'right' | 'bottom' | 'left';

export type DropIndicatorProps = {
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
  display: 'block',
  position: 'absolute',
  zIndex: 1,
  background: line.backgroundColor,
  content: '""',
  opacity: 0,
  pointerEvents: 'none',
});

const edgeStyles: Record<Edge, SerializedStyles> = {
  top: css({
    height: line.thickness,
    top: 'var(--local-line-offset)',
    right: 0,
    left: 0,
    opacity: 1,
  }),
  right: css({
    width: line.thickness,
    top: 0,
    right: 'var(--local-line-offset)',
    bottom: 0,
    opacity: 1,
  }),
  bottom: css({
    height: line.thickness,
    right: 0,
    bottom: 'var(--local-line-offset)',
    left: 0,
    opacity: 1,
  }),
  left: css({
    width: line.thickness,
    top: 0,
    bottom: 0,
    left: 'var(--local-line-offset)',
    opacity: 1,
  }),
};

/**
 * __Drop indicator__
 *
 * A drop indicator is used to communicate the intended resting place of the draggable item. The orientation of the drop indicator should always match the direction of the content flow.
 */
export function DropIndicator({ edge, gap = 0 }: DropIndicatorProps) {
  /**
   * To clearly communicate the resting place of a draggable item during a drag operation,
   * the drop indicator should be positioned half way between draggable items.
   */
  const lineOffset = -0.5 * (gap + line.thickness);

  return (
    <div
      css={[lineStyles, edge && edgeStyles[edge]]}
      style={{ '--local-line-offset': `${lineOffset}px` } as CSSProperties}
    />
  );
}

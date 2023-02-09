/** @jsx jsx */

import { CSSProperties } from 'react';

import { css, jsx, SerializedStyles } from '@emotion/react';

import type { Edge } from '@atlaskit/drag-and-drop-hitbox/types';

import { line } from '../constants';

export type DropIndicatorProps = {
  /**
   * The `edge` to draw a drop indicator on.
   *
   * `edge` is required as for the best possible performance
   * outcome you should only render this component when it needs to do something
   *
   * @example {closestEdge && <DropIndicator edge={closestEdge} />}
   */
  edge: Edge;
  /**
   * `gap` allows you to position the drop indicator further away from the drop target.
   * `gap` should be the distance between your drop targets
   * a drop indicator will be rendered halfway between the drop targets
   * (the drop indicator will be offset by half of the `gap`)
   *
   * `gap` should be a valid CSS length.
   * @example "8px"
   * @example "var(--gap)"
   */
  gap?: string;
  /** How far to horizontally shift a line to the left by
   *
   *
   * `inset` should be a valid CSS length.
   * @example "8px"
   * @example "var(--inset)"
   */
  inset?: string;
};

const indicatorStyles = css({
  '--terminal-size': '8px',

  // To make things a bit clearer we are making the box that the indicator in as
  // big as the whole tree item
  position: 'absolute',
  top: 0,
  right: 0,
  left: 'var(--local-horizontal-offset)',
  bottom: 0,

  // We don't want to cause any additional 'dragenter' events
  pointerEvents: 'none',

  // Terminal
  '::before': {
    display: 'block',
    content: '""',
    position: 'absolute',
    zIndex: 2,

    boxSizing: 'border-box',
    width: 'var(--terminal-size)',
    height: 'var(--terminal-size)',
    left: 0,
    background: 'transparent',
    borderColor: line.backgroundColor,
    borderWidth: line.thickness,
    borderRadius: '50%',
    borderStyle: 'solid',
  },

  // Line
  '::after': {
    display: 'block',
    content: '""',
    position: 'absolute',
    zIndex: 1,
    background: line.backgroundColor,
    left: 'calc(var(--terminal-size) / 2)', // putting the line to the right of the terminal
    height: line.thickness,
    right: 0,
  },
});

const edgeStyles: Record<Edge, SerializedStyles> = {
  top: css({
    // terminal
    '::before': {
      top: 0,
      // move to position to be a 'cap' on the line
      transform: `translate(calc(-0.5 * var(--terminal-size)), calc(-0.5 * var(--terminal-size)))`,
    },
    // line
    '::after': {
      top: 'var(--local-vertical-offset)',
    },
  }),
  bottom: css({
    // terminal
    '::before': {
      bottom: 0,
      // move to position to be a 'cap' on the line
      transform: `translate(calc(-0.5 * var(--terminal-size)), calc(0.5 * var(--terminal-size)))`,
    },
    // line
    '::after': {
      bottom: 'var(--local-vertical-offset)',
    },
  }),
  // no horizontal actions available
  left: css({ opacity: 0 }),
  right: css({ opacity: 0 }),
};

export function DropIndicator({
  edge,
  gap = '0px',
  inset = '0px',
}: DropIndicatorProps) {
  const style = {
    // pushing the line so it sits on the edge of an item, or half way between items
    // which have been separated with a `gap`
    '--local-vertical-offset': `calc(-0.5 * (${gap} + ${line.thickness}px))`,
    '--local-horizontal-offset': inset,
  } as CSSProperties;

  return <div css={[indicatorStyles, edgeStyles[edge]]} style={style} />;
}

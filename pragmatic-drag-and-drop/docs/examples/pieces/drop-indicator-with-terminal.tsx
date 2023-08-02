/* eslint-disable @atlaskit/design-system/no-unsafe-design-token-usage */
/** @jsx jsx */

import { css, jsx } from '@emotion/react';

import { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/addon/closest-edge';
import { token } from '@atlaskit/tokens';

const terminalRadius = 4;
const lineThickness = 2;

const dropIndicatorStyles = css({
  position: 'absolute',
  left: `calc(${terminalRadius * 2}px - var(--terminal-offset))`,
  width: `calc(100% - ${terminalRadius * 2}px + var(--terminal-offset))`,
  height: lineThickness,
  background: token('color.border.selected'),

  '::before': {
    content: '""',
    width: terminalRadius * 2,
    height: terminalRadius * 2,
    border: `${lineThickness}px solid ${token('color.border.selected')}`,
    boxSizing: 'border-box',
    position: 'absolute',
    left: -terminalRadius * 2,
    top: -(terminalRadius / 2) - lineThickness / 2,
    borderRadius: '50%',
    zIndex: 999,
  },
});

const dropIndicatorEdgeStyles = {
  top: css({
    top: `calc(-1 * (var(--gap) / 2 + ${lineThickness}px / 2))`,
  }),
  bottom: css({
    bottom: `calc(-1 * (var(--gap) / 2 + ${lineThickness}px / 2))`,
  }),
  left: {},
  right: {},
};

export function DropIndicatorWithTerminal({
  edge,
  gap,
  terminalOffset = '0px',
}: {
  edge: Edge;
  gap: string;
  /**
   * How far the terminal sticks out
   */
  terminalOffset?: string;
}) {
  return (
    <div
      style={
        {
          '--gap': gap,
          '--terminal-offset': terminalOffset,
        } as React.CSSProperties
      }
      css={[dropIndicatorStyles, dropIndicatorEdgeStyles[edge]]}
    />
  );
}

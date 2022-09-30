/** @jsx jsx */

import { ReactNode } from 'react';

import { ClassNames, css, jsx, SerializedStyles } from '@emotion/react';

import type { Edge } from '@atlaskit/drag-and-drop-hitbox/types';

import { cssVar, line, terminal } from './constants';

type TerminalProps = {
  children: (props: { className?: string }) => ReactNode;
  edge: Edge | null;
};

const terminalStyles = css({
  '::before': {
    display: 'block',
    boxSizing: 'border-box',
    width: terminal.size,
    height: terminal.size,
    position: 'absolute',
    zIndex: 1,
    background: terminal.backgroundColor,
    borderColor: terminal.borderColor,
    borderRadius: terminal.borderRadius,
    borderStyle: 'solid',
    borderWidth: terminal.borderWidth,
    content: '""',
    opacity: 0,
    pointerEvents: 'none',
  },
  /**
   * Clips the part of the line which is inside of the transparent
   * fill of the terminal.
   */
  '::after': {
    clipPath: `inset(0px 0px 0px ${terminal.size / 4}px)`,
  },
});

const horizontalAdjustment = -terminal.size / 2;
const verticalAdjustment = (terminal.size - line.thickness) / 2;

const edgeStyles: Record<Edge, SerializedStyles> = {
  top: css({
    '::before': {
      top: `var(${cssVar.offset})`,
      right: 0,
      left: `var(${cssVar.inset})`,
      opacity: 1,
      transform: `translate(${horizontalAdjustment}px, ${-verticalAdjustment}px)`,
    },
  }),
  bottom: css({
    '::before': {
      right: 0,
      bottom: `var(${cssVar.offset})`,
      left: `var(${cssVar.inset})`,
      opacity: 1,
      transform: `translate(${horizontalAdjustment}px, ${verticalAdjustment}px)`,
    },
  }),
  left: css({ opacity: 0 }),
  right: css({ opacity: 0 }),
};

const Terminal = ({ children, edge }: TerminalProps) => {
  return (
    <ClassNames>
      {({ css }) => {
        return children({
          className: css([terminalStyles, edge && edgeStyles[edge]]),
        });
      }}
    </ClassNames>
  );
};

export default Terminal;

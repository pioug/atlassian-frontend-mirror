import React, { ReactNode } from 'react';

import { ClassNames, css, SerializedStyles } from '@emotion/react';

import type { Edge } from '@atlaskit/drag-and-drop-hitbox/types';

import { cssVar, line } from './constants';

export type LineProps = {
  children: (props: { className?: string }) => ReactNode;
  edge: Edge | null;
};

const lineStyles = css({
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
      top: `var(${cssVar.offset})`,
      right: 0,
      left: `var(${cssVar.inset})`,
      opacity: 1,
    },
  }),
  right: css({
    '::after': {
      width: line.thickness,
      top: 0,
      right: `var(${cssVar.offset})`,
      bottom: 0,
      opacity: 1,
    },
  }),
  bottom: css({
    '::after': {
      height: line.thickness,
      right: 0,
      bottom: `var(${cssVar.offset})`,
      left: `var(${cssVar.inset})`,
      opacity: 1,
    },
  }),
  left: css({
    '::after': {
      width: line.thickness,
      top: 0,
      bottom: 0,
      left: `var(${cssVar.offset})`,
      opacity: 1,
    },
  }),
};

const Line = ({ children, edge }: LineProps) => {
  return (
    <ClassNames>
      {({ css }) => {
        return children({
          className: css([lineStyles, edge && edgeStyles[edge]]),
        });
      }}
    </ClassNames>
  );
};

export default Line;

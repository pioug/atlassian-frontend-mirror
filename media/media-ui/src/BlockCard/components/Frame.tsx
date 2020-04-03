/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { N20A, N30A, B200, N50A, N60A } from '@atlaskit/theme/colors';

import { gs, br } from '../utils';

export interface FrameProps {
  children?: React.ReactNode;
  /* Set spacing and what elements are rendered. Compact is for loading and error views */
  compact?: boolean;
  /* Set whether it is selected. NB: The card is only selectable in the `editor` view, and will be provided by the editor */
  isSelected?: boolean;
  /* Set whether the frame has a hover state. Note that this should only be true in the `editor` view */
  isHoverable?: boolean;
  testId?: string;
}

export const Frame = (
  props: FrameProps = {
    isSelected: false,
    isHoverable: false,
  },
) =>
  props.compact ? <CompactFrame {...props} /> : <ExpandedFrame {...props} />;

const sharedFrameStyles = {
  maxWidth: gs(85),
  width: '100%',
  display: 'flex',
} as const;

export const ExpandedFrame = ({
  children,
  isSelected,
  isHoverable,
  testId,
}: FrameProps) => {
  return (
    <div
      css={{
        ...sharedFrameStyles,
        '&:hover': isHoverable
          ? {
              backgroundColor: N20A,
              cursor: 'pointer',
            }
          : undefined,
        minHeight: gs(15),
        borderRadius: isSelected ? br() : br(0.5),
        border: isSelected ? `2px solid ${B200}` : '',
        justifyContent: 'space-between',
        overflow: 'hidden',
        boxShadow: `0 1px 1px ${N50A}, 0 0 1px 0 ${N60A};`,
      }}
      data-testid={testId}
    >
      {children}
    </div>
  );
};

export const CompactFrame = ({
  children,
  isHoverable,
  isSelected,
  testId,
}: FrameProps) => {
  return (
    <div
      css={{
        ...sharedFrameStyles,
        '&:hover': isHoverable
          ? {
              backgroundColor: N30A,
            }
          : undefined,
        borderRadius: isSelected ? br() : br(0.5),
        border: isSelected ? `2px solid ${B200}` : '',
        justifyContent: 'center',
        alignItems: 'center',
        height: gs(5),
        backgroundColor: N20A,
      }}
      data-testid={testId}
    >
      {children}
    </div>
  );
};

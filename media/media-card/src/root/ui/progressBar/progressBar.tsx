import React from 'react';
import { StyledBar } from './styled';
import { Breakpoint } from '../Breakpoint';

export type ProgressBarProps = {
  progress?: number;
  breakpoint?: Breakpoint;
  positionBottom?: boolean;
};

export const ProgressBar = ({
  progress,
  breakpoint = Breakpoint.SMALL,
  positionBottom = false,
}: ProgressBarProps) => {
  const normalizedProgress = Math.min(1, Math.max(0, progress || 0)) * 100;
  return (
    <StyledBar
      progress={normalizedProgress}
      breakpoint={breakpoint}
      positionBottom={positionBottom}
    />
  );
};

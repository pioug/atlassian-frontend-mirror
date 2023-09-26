/**@jsx jsx */
import { jsx } from '@emotion/react';
import { StyledBarProps } from './types';
import { styledBarStyles } from './styles';

export const StyledBar = (props: StyledBarProps) => {
  const { progress, breakpoint, positionBottom, showOnTop } = props;

  return (
    <div
      id="styledBar"
      role="progressbar"
      aria-valuenow={progress}
      css={styledBarStyles({
        progress,
        breakpoint,
        positionBottom,
        showOnTop,
      })}
    />
  );
};

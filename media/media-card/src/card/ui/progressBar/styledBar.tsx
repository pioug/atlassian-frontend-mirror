/**@jsx jsx */
import { jsx } from '@emotion/react';
import { StyledBarProps } from './types';
import { styledBarStyles } from './styles';

export const StyledBar = (props: StyledBarProps) => {
  const { progress, breakpoint, positionBottom, showOnTop } = props;

  return (
    <div
      id="styledBar"
      data-testid="media-progress-bar"
      css={styledBarStyles({
        progress,
        breakpoint,
        positionBottom,
        showOnTop,
      })}
    />
  );
};

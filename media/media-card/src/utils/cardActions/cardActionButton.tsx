/**@jsx jsx */
import { forwardRef } from 'react';
import { jsx } from '@emotion/react';
import { CardActionButtonOwnProps, cardActionButtonStyles } from './styles';

export const CardActionButton = forwardRef<
  HTMLDivElement,
  CardActionButtonOwnProps
>((props, ref) => {
  return (
    <div
      id="cardActionButton"
      data-testid="media-card-primary-action"
      css={cardActionButtonStyles(props)}
      style={props.style}
      onClick={props.onClick}
      onMouseDown={props.onMouseDown}
      ref={ref}
    >
      {props.children}
    </div>
  );
});

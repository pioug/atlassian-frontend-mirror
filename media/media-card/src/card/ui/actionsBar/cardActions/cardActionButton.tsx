/**@jsx jsx */
import { forwardRef } from 'react';
import { jsx } from '@emotion/react';
import { type CardActionButtonOwnProps, cardActionButtonStyles } from './styles';

export const CardActionButton = forwardRef<
  HTMLButtonElement,
  CardActionButtonOwnProps
>((props, ref) => {
  return (
    <button
      {...props}
      id="cardActionButton"
      data-testid="media-card-primary-action"
      aria-label={props.label}
      css={cardActionButtonStyles(props)}
      style={props.style}
      onClick={props.onClick}
      onMouseDown={props.onMouseDown}
      ref={ref}
    >
      {props.children}
    </button>
  );
});

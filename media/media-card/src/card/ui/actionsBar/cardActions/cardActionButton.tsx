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
// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
      style={props.style}
      onClick={props.onClick}
      onMouseDown={props.onMouseDown}
      ref={ref}
    >
      {props.children}
    </button>
  );
});

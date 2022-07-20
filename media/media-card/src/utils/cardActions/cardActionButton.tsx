/**@jsx jsx */
import { jsx } from '@emotion/react';
import { CardActionButtonOwnProps, cardActionButtonStyles } from './styles';

export const CardActionButton = (props: CardActionButtonOwnProps) => {
  return (
    <div
      id="cardActionButton"
      data-testid="media-card-primary-action"
      css={cardActionButtonStyles(props)}
      style={props.style}
      onClick={props.onClick}
      onMouseDown={props.onMouseDown}
    >
      {props.children}
    </div>
  );
};

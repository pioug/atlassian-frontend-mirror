import React from 'react';
import { Component, ReactNode, MouseEvent } from 'react';

import { CardActionButton, CardActionIconButtonVariant } from './styled';

export type CardActionIconButtonProps = {
  readonly icon: ReactNode;

  readonly variant?: CardActionIconButtonVariant;
  readonly triggerColor?: string;
  readonly onClick?: (event: MouseEvent<HTMLDivElement>) => void;
};

export class CardActionIconButton extends Component<CardActionIconButtonProps> {
  render(): JSX.Element {
    const { icon, triggerColor, onClick, variant } = this.props;
    return (
      <CardActionButton
        data-testid="media-card-primary-action"
        onClick={onClick}
        onMouseDown={this.onMouseDown}
        style={{ color: triggerColor }}
        variant={variant}
      >
        {icon}
      </CardActionButton>
    );
  }

  // this is to prevent currently focused text to loose cursor on clicking card action
  // this does not prevent onclick behavior
  private onMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
  };
}

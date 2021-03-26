import React from 'react';
import { ColorCardButton, ColorCardContent } from '../styled/ColorCard';

export interface Props {
  value: string;
  label?: string;
  onClick?: () => void;
  expanded?: boolean;
}

export default class ColorCard extends React.PureComponent<Props> {
  onMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { onClick } = this.props;

    event.currentTarget.focus();

    if (onClick) {
      event.preventDefault();
      onClick();
    }
  };

  render() {
    const { value, label, expanded } = this.props;

    return (
      <ColorCardButton
        title={label}
        onClick={this.onClick}
        onMouseDown={this.onMouseDown}
        focused={expanded}
        aria-label={label}
        aria-expanded={expanded}
        aria-haspopup
        type="button"
      >
        <ColorCardContent color={value || 'transparent'} />
      </ColorCardButton>
    );
  }
}

import React, { PureComponent } from 'react';
import TagCrossIcon from './TagCrossIcon';
import { Button } from './styled';

export interface Props {
  removeText?: string;
  isRounded: boolean;
  onHoverChange?: (hovering: boolean) => void;
  onRemoveAction?: () => void;
}

export default class RemoveButton extends PureComponent<Props> {
  onKeyPress = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const spacebarOrEnter = e.key === ' ' || e.key === 'Enter';

    if (spacebarOrEnter) {
      e.stopPropagation();

      if (this.props.onRemoveAction) {
        this.props.onRemoveAction();
      }
    }
  };

  onMouseOver = () => {
    if (this.props.onHoverChange) this.props.onHoverChange(true);
  };

  onMouseOut = () => {
    if (this.props.onHoverChange) this.props.onHoverChange(false);
  };

  render() {
    const { isRounded, onRemoveAction, removeText } = this.props;

    return (
      <Button
        aria-label={removeText}
        isRounded={isRounded}
        onClick={onRemoveAction}
        onKeyPress={this.onKeyPress}
        onMouseOut={this.onMouseOut}
        onMouseOver={this.onMouseOver}
        type="button"
      >
        <TagCrossIcon />
      </Button>
    );
  }
}

import React from 'react';
import Tooltip from '@atlaskit/tooltip';
import { ToolTipContent, findKeymapByDescription } from '../../../keymaps';
import Button from '@atlaskit/button/standard-button';

interface Props {
  title: string;
  icon: JSX.Element;
  keymapDescription: string;
  onClick: (ref: React.RefObject<HTMLButtonElement>) => void;
  disabled?: boolean;
  isPressed?: boolean;
}

export class FindReplaceTooltipButton extends React.PureComponent<Props> {
  private buttonRef = React.createRef<HTMLButtonElement>();

  static defaultProps = {
    keymapDescription: 'no-keymap',
  };

  handleClick = () => {
    this.props.onClick(this.buttonRef);
  };

  render() {
    const { title, icon, keymapDescription, disabled, isPressed } = this.props;
    const pressedProps = {
      ...(typeof isPressed === 'boolean' && { 'aria-pressed': isPressed }),
    };
    return (
      <Tooltip
        content={
          <ToolTipContent
            description={title}
            keymap={findKeymapByDescription(keymapDescription)}
          />
        }
        hideTooltipOnClick={true}
        position={'top'}
      >
        <Button
          label={title}
          appearance="subtle"
          testId={title}
          ref={this.buttonRef}
          iconBefore={icon}
          isDisabled={disabled}
          onClick={this.handleClick}
          isSelected={isPressed}
          shouldFitContainer={true}
          {...pressedProps}
        />
      </Tooltip>
    );
  }
}

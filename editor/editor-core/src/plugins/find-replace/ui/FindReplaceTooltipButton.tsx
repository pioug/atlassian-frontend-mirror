import React from 'react';
import Button from '@atlaskit/button';
import Tooltip from '@atlaskit/tooltip';
import { ToolTipContent, findKeymapByDescription } from '../../../keymaps';

interface Props {
  title: string;
  icon: JSX.Element;
  keymapDescription: string;
  onClick: (ref: React.RefObject<HTMLElement>) => void;
  disabled?: boolean;
}

export class FindReplaceTooltipButton extends React.PureComponent<Props> {
  private buttonRef = React.createRef<HTMLElement>();

  handleClick = () => {
    this.props.onClick(this.buttonRef);
  };

  render() {
    const { title, icon, keymapDescription, disabled } = this.props;
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
          testId={title}
          ref={this.buttonRef}
          appearance="subtle"
          iconBefore={icon}
          spacing="none"
          isDisabled={disabled}
          onClick={this.handleClick}
        />
      </Tooltip>
    );
  }
}

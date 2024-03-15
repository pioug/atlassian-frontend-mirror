import React from 'react';

import { IconButton } from '@atlaskit/button/new';
import LegacyButton from '@atlaskit/button/standard-button';
import {
  findKeymapByDescription,
  ToolTipContent,
} from '@atlaskit/editor-common/keymaps';
import type { IconProps } from '@atlaskit/icon/types';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import Tooltip from '@atlaskit/tooltip';
interface Props {
  title: string;
  icon: JSX.Element;
  newIcon: React.ComponentType<React.PropsWithChildren<IconProps>>;
  iconLabel: string;
  iconSize?: 'small' | undefined;
  keymapDescription: string;
  onClick: (ref: React.RefObject<HTMLButtonElement>) => void;
  disabled?: boolean;
  isPressed?: boolean;
  appearance?: 'default' | 'primary' | 'subtle';
}

// eslint-disable-next-line @repo/internal/react/no-class-components
export class FindReplaceTooltipButton extends React.PureComponent<Props> {
  private buttonRef = React.createRef<HTMLButtonElement>();

  static defaultProps = {
    keymapDescription: 'no-keymap',
    appearance: 'subtle',
  };

  handleClick = () => {
    this.props.onClick(this.buttonRef);
  };

  render() {
    const {
      title,
      icon,
      newIcon,
      iconSize,
      keymapDescription,
      disabled,
      isPressed,
      appearance,
    } = this.props;
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
        {getBooleanFF('platform.design-system-team.editor-new-button_jjjdo') ? (
          <IconButton
            id="afterInputSection"
            label={title}
            appearance={appearance}
            testId={title}
            ref={this.buttonRef}
            icon={newIcon}
            UNSAFE_size={iconSize}
            isDisabled={disabled}
            onClick={this.handleClick}
            isSelected={isPressed}
            {...pressedProps}
          />
        ) : (
          <LegacyButton
            id="afterInputSection"
            label={title}
            appearance={appearance}
            testId={title}
            ref={this.buttonRef}
            iconBefore={icon}
            isDisabled={disabled}
            onClick={this.handleClick}
            isSelected={isPressed}
            shouldFitContainer={true}
            {...pressedProps}
          />
        )}
      </Tooltip>
    );
  }
}

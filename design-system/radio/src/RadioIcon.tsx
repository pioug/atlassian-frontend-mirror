import React, { Component } from 'react';
import Icon from '@atlaskit/icon/glyph/radio';
import { IconWrapper } from './styled/Radio';
import { RadioIconProps } from './types';

export default class RadioIcon extends Component<RadioIconProps> {
  render() {
    const {
      isActive,
      isChecked,
      isDisabled,
      isFocused,
      isHovered,
      isInvalid,
    } = this.props;
    return (
      <IconWrapper
        isActive={isActive}
        isChecked={isChecked}
        isDisabled={isDisabled}
        isFocused={isFocused}
        isHovered={isHovered}
        isInvalid={isInvalid}
      >
        <Icon label="" primaryColor="inherit" secondaryColor="inherit" />
      </IconWrapper>
    );
  }
}

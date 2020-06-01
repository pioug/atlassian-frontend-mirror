import React, { Component } from 'react';

import Avatar, { AvatarClickType, AvatarPropTypes } from '@atlaskit/avatar';
import { DropdownItem } from '@atlaskit/dropdown-menu';

export interface AvatarGroupItemProps {
  avatar: AvatarPropTypes;
  isActive?: boolean;
  isHover?: boolean;
  index?: number;
  onAvatarClick?: AvatarClickType;
  testId?: string;
}

class AvatarGroupItem extends Component<AvatarGroupItemProps> {
  render() {
    const { avatar, onAvatarClick, testId } = this.props;
    const { href, ...rest } = avatar;
    const enhancedProps = this.props;
    return (
      <DropdownItem
        isInteractive
        {...enhancedProps}
        elemBefore={
          <Avatar
            {...rest}
            testId={testId && `${testId}--avatar`}
            borderColor="transparent"
            size="small"
          />
        }
        href={href}
        onClick={(event: React.MouseEvent) => {
          if (typeof onAvatarClick === 'function') {
            onAvatarClick(event);
          }
        }}
        rel={avatar.target ? 'noopener noreferrer' : null}
        target={avatar.target}
      >
        {avatar.name}
      </DropdownItem>
    );
  }
}

export default AvatarGroupItem;

import React, { Component } from 'react';
import { DropdownItem } from '@atlaskit/dropdown-menu';
import Avatar, {
  withPseudoState,
  getProps,
  AvatarClickType,
  AvatarPropTypes,
} from '@atlaskit/avatar';

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
    const enhancedProps = getProps(this);
    return (
      <DropdownItem
        isInteractive
        {...enhancedProps}
        elemBefore={
          <Avatar
            {...rest}
            testId={testId && `${testId}--avatar`}
            borderColor="transparent"
            enableTooltip={false}
            size="small"
          />
        }
        href={href}
        onClick={(event: React.MouseEvent) => {
          if (typeof onAvatarClick === 'function') {
            onAvatarClick({ event, item: avatar });
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

export default withPseudoState(AvatarGroupItem);

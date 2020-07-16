import React, { FC } from 'react';

import Avatar from '@atlaskit/avatar';
import { ButtonItem, LinkItem } from '@atlaskit/menu';

import { AvatarProps, onAvatarClickHandler } from './types';

export interface AvatarGroupItemProps {
  avatar: AvatarProps;
  isActive?: boolean;
  isHover?: boolean;
  index: number;
  onAvatarClick?: onAvatarClickHandler;
  testId?: string;
}

const AvatarGroupItem: FC<AvatarGroupItemProps> = ({
  avatar,
  onAvatarClick,
  testId,
  index,
}) => {
  const { href, onClick, ...rest } = avatar;

  const AvatarIcon = (
    <Avatar
      {...rest}
      testId={testId && `${testId}--avatar`}
      borderColor="transparent"
      size="small"
    />
  );

  return href ? (
    <LinkItem
      href={href}
      target={avatar.target}
      rel={avatar.target === '_blank' ? 'noopener noreferrer' : undefined}
      iconBefore={AvatarIcon}
      testId={testId}
    >
      {avatar.name}
    </LinkItem>
  ) : (
    <ButtonItem
      onClick={
        typeof onAvatarClick === 'function'
          ? event =>
              onAvatarClick(
                event as React.MouseEvent<Element>,
                undefined,
                index,
              )
          : undefined
      }
      iconBefore={AvatarIcon}
      testId={testId}
    >
      {avatar.name}
    </ButtonItem>
  );
};

export default AvatarGroupItem;

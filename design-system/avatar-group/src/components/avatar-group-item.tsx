import React, { forwardRef } from 'react';

import Avatar from '@atlaskit/avatar';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import {
  ButtonItem,
  CustomItem,
  CustomItemComponentProps,
  LinkItem,
} from '@atlaskit/menu';

import useRegisterItemWithFocusManager from './internal/hooks/use-register-item-with-focus-manager';
import { AvatarProps, onAvatarClickHandler } from './types';

export interface AvatarGroupItemProps {
  avatar: AvatarProps;
  isActive?: boolean;
  isHover?: boolean;
  index: number;
  onAvatarClick?: onAvatarClickHandler;
  testId?: string;
}

const AvatarGroupItem = forwardRef<HTMLElement, AvatarGroupItemProps>(
  (props, ref) => {
    const { avatar, onAvatarClick, testId, index } = props;
    const { href, onClick, ...rest } = avatar;
    const itemRef = useRegisterItemWithFocusManager();

    const CustomComponent = ({
      children,
      ...props
    }: CustomItemComponentProps) => {
      return (
        // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
        <button type="button" {...props}>
          {children}
        </button>
      );
    };

    const AvatarIcon = (
      <Avatar
        {...rest}
        testId={testId && `${testId}--avatar`}
        borderColor="transparent"
        size="small"
        name=""
      />
    );

    // onClick handler provided with avatar data takes precedence, same as with the normal avatar item
    const callback = onClick || onAvatarClick;

    if (href) {
      return (
        <LinkItem
          ref={mergeRefs([ref, itemRef])}
          href={href}
          target={avatar.target}
          rel={avatar.target === '_blank' ? 'noopener noreferrer' : undefined}
          iconBefore={AvatarIcon}
          testId={testId}
          onClick={(event) =>
            callback &&
            callback(event as React.MouseEvent<Element>, undefined, index)
          }
        >
          {avatar.name}
        </LinkItem>
      );
    }
    if (typeof callback === 'function') {
      return (
        <ButtonItem
          ref={mergeRefs([ref, itemRef])}
          onClick={(event) =>
            callback &&
            callback(event as React.MouseEvent<Element>, undefined, index)
          }
          iconBefore={AvatarIcon}
          testId={testId}
        >
          {avatar.name}
        </ButtonItem>
      );
    }
    return (
      <CustomItem
        iconBefore={AvatarIcon}
        component={CustomComponent}
        testId={testId}
      >
        {avatar.name}
      </CustomItem>
    );
  },
);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default AvatarGroupItem;

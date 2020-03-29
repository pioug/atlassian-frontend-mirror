import React from 'react';
import Item from '@atlaskit/item';
import { ItemProps } from './types';

export const DrawerItem = (props: ItemProps) => {
  const {
    autoFocus,
    children,
    description,
    dnd,
    elemAfter,
    elemBefore,
    href,
    isCompact,
    isDisabled,
    isDragging,
    isHidden,
    isSelected,
    onClick,
    onKeyDown,
    onMouseEnter,
    onMouseLeave,
    target,
    title,
  } = props;

  return (
    <Item
      autoFocus={autoFocus}
      description={description}
      elemAfter={elemAfter}
      elemBefore={elemBefore}
      href={href}
      isCompact={isCompact}
      isDisabled={isDisabled}
      isDragging={isDragging}
      isHidden={isHidden}
      isSelected={isSelected}
      onClick={onClick}
      onKeyDown={onKeyDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      target={target}
      title={title}
      {...dnd}
    >
      {children}
    </Item>
  );
};

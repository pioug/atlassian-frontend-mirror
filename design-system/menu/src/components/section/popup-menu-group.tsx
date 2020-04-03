/** @jsx jsx */
import { jsx } from '@emotion/core';
import MenuGroup from './menu-group';
import { MenuGroupProps } from '../types';

const PopupMenuGroup = ({
  maxWidth = 800,
  minWidth = 320,
  ...rest
}: MenuGroupProps) => (
  <MenuGroup maxWidth={maxWidth} minWidth={minWidth} {...rest} />
);

export default PopupMenuGroup;

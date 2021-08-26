/** @jsx jsx */
import { jsx } from '@emotion/core';

import type { MenuGroupProps } from '../types';

import MenuGroup from './menu-group';

/**
 * @deprecated
 */
const PopupMenuGroup = ({
  maxWidth = 800,
  minWidth = 320,
  ...rest
}: MenuGroupProps) => (
  <MenuGroup maxWidth={maxWidth} minWidth={minWidth} {...rest} />
);

export default PopupMenuGroup;

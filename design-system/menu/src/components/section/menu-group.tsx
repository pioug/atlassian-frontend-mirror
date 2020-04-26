/** @jsx jsx */
import { jsx } from '@emotion/core';

import { MenuGroupProps } from '../types';

import { menuGroupCSS } from './styles';

const MenuGroup = ({
  maxWidth,
  minWidth,
  minHeight,
  maxHeight,
  testId,
  ...rest
}: MenuGroupProps) => (
  <div
    css={menuGroupCSS({ maxHeight, maxWidth, minHeight, minWidth })}
    data-testid={testId}
    {...rest}
  />
);

export default MenuGroup;

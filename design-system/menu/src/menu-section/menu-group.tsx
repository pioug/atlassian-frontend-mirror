/** @jsx jsx */
import { jsx } from '@emotion/core';

import { menuGroupCSS } from '../internal/styles/menu-section/menu-group';
import type { MenuGroupProps } from '../types';

/**
 * __Menu group__
 *
 * A menu group includes all the actions or items in a menu.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/menu/docs/menu-group)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/menu)
 */
const MenuGroup = ({
  maxWidth,
  minWidth,
  minHeight,
  maxHeight,
  testId,
  ...rest
}: MenuGroupProps) => (
  <div
    // eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
    css={menuGroupCSS({ maxHeight, maxWidth, minHeight, minWidth })}
    data-testid={testId}
    {...rest}
  />
);

export default MenuGroup;

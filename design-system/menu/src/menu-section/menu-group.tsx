/** @jsx jsx */
import { jsx } from '@emotion/react';

import { UNSAFE_Box as Box } from '@atlaskit/ds-explorations';

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
  role,
  ...rest
}: MenuGroupProps) => (
  // @ts-ignore type of rest/children needs to be made stricter to fit in Box -- string shouldn't be allowed
  <Box
    UNSAFE_style={{
      minWidth,
      maxWidth,
      minHeight,
      maxHeight,
    }}
    display="flex"
    flexDirection="column"
    overflow="auto"
    testId={testId}
    role={role}
    position="static"
    // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
    {...rest}
  />
);

export default MenuGroup;

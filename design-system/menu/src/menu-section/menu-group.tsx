/** @jsx jsx */
import { jsx } from '@emotion/react';

import { UNSAFE_Box as Box } from '@atlaskit/ds-explorations';

import { SpacingContext } from '../internal/components/menu-context';
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
  spacing = 'cozy',
  ...rest
}: MenuGroupProps) => (
  <SpacingContext.Provider value={spacing}>
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
  </SpacingContext.Provider>
);

export default MenuGroup;

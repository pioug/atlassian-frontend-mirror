/** @jsx jsx */
import { jsx } from '@emotion/react';

import { UNSAFE_Box as Box } from '@atlaskit/ds-explorations';

import {
  SELECTION_STYLE_CONTEXT_DO_NOT_USE,
  SpacingContext,
} from '../internal/components/menu-context';
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
    <SELECTION_STYLE_CONTEXT_DO_NOT_USE.Provider value="border">
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
    </SELECTION_STYLE_CONTEXT_DO_NOT_USE.Provider>
  </SpacingContext.Provider>
);

export default MenuGroup;

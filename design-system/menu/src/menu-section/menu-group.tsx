/** @jsx jsx */
import { jsx } from '@emotion/react';

import { UNSAFE_Box as Box } from '@atlaskit/ds-explorations';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

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
  // Although this isn't defined on props it is available because we've used
  // Spread props below and on the jsx element. To forcibly block usage I've
  // picked it out and supressed the expected type error.
  // @ts-expect-error
  className: UNSAFE_className,
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
        className={
          getBooleanFF(
            'platform.design-system-team.unsafe-overrides-killswitch_c8j9m',
          )
            ? undefined
            : UNSAFE_className
        }
        // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
        {...rest}
      />
    </SELECTION_STYLE_CONTEXT_DO_NOT_USE.Provider>
  </SpacingContext.Provider>
);

export default MenuGroup;

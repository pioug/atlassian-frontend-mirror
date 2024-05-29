/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import {
  SELECTION_STYLE_CONTEXT_DO_NOT_USE,
  SpacingContext,
} from '../internal/components/menu-context';
import type { MenuGroupProps } from '../types';

const baseStyles = css({
  display: 'flex',
  position: 'static',
  flexDirection: 'column',
  overflow: 'auto',
});

/**
 * __Menu group__
 *
 * A menu group includes all the actions or items in a menu.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/menu/docs/menu-group)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/menu)
 */
const MenuGroup = ({
  isLoading,
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
      <div
        aria-busy={isLoading}
        style={{
          minWidth,
          maxWidth,
          minHeight,
          maxHeight,
        }}
        css={baseStyles}
        data-testid={testId}
        role={role}
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
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

import React, { forwardRef } from 'react';

import { ButtonItem as Button, ButtonItemProps } from '@atlaskit/menu';

import {
  baseSideNavItemStyle,
  overrideStyleFunction,
} from '../../common/styles';
import { useShouldNestedElementRender } from '../NestableNavigationContent/context';

export type { ButtonItemProps } from '@atlaskit/menu';

/**
 * __Button item__
 *
 * A button item renders an item wrapped in a button tag, used primarily when an
 * action does something other than changing routes.
 *
 * - [Examples](https://atlassian.design/components/side-navigation/examples#button-item)
 * - [Code](https://atlassian.design/components/side-navigation/code)
 */
const ButtonItem = forwardRef<HTMLElement, ButtonItemProps>(
  // Type needed on props to extract types with extract react types.
  ({ cssFn, ...rest }: ButtonItemProps, ref) => {
    const { shouldRender } = useShouldNestedElementRender();
    if (!shouldRender) {
      return null;
    }
    const cssOverride = overrideStyleFunction(baseSideNavItemStyle, cssFn);
    // eslint-disable-next-line @atlaskit/design-system/no-deprecated-apis, @repo/internal/react/no-unsafe-overrides
    return <Button ref={ref} cssFn={cssOverride} {...rest} />;
  },
);

export default ButtonItem;

import React, { forwardRef } from 'react';

import { ButtonItem as Button, ButtonItemProps } from '@atlaskit/menu';

import {
  baseSideNavItemStyle,
  overrideStyleFunction,
} from '../../common/styles';
import { useShouldNestedElementRender } from '../NestableNavigationContent/context';

export type { ButtonItemProps } from '@atlaskit/menu';

const ButtonItem = forwardRef<HTMLElement, ButtonItemProps>(
  // Type needed on props to extract types with extract react types.
  ({ cssFn, ...rest }: ButtonItemProps, ref) => {
    const { shouldRender } = useShouldNestedElementRender();
    if (!shouldRender) {
      return null;
    }
    const cssOverride = overrideStyleFunction(baseSideNavItemStyle, cssFn);
    return <Button ref={ref} cssFn={cssOverride} {...rest} />;
  },
);

export default ButtonItem;

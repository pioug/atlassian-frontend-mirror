import React, { forwardRef } from 'react';

import { LinkItem as Link, LinkItemProps } from '@atlaskit/menu';

import {
  baseSideNavItemStyle,
  overrideStyleFunction,
} from '../../common/styles';
import { useShouldNestedElementRender } from '../NestableNavigationContent/context';

export type { LinkItemProps } from '@atlaskit/menu';

const LinkItem = forwardRef<HTMLElement, LinkItemProps>(
  // Type needed on props to extract types with extract react types.
  ({ cssFn, ...rest }: LinkItemProps, ref) => {
    const { shouldRender } = useShouldNestedElementRender();
    if (!shouldRender) {
      return null;
    }

    const cssOverride = overrideStyleFunction(baseSideNavItemStyle, cssFn);
    return <Link ref={ref} cssFn={cssOverride} {...rest} />;
  },
);

export default LinkItem;

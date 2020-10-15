import React, { forwardRef } from 'react';

import {
  CustomItem as Custom,
  CustomItemComponentProps,
  CustomItemProps,
} from '@atlaskit/menu';

import {
  baseSideNavItemStyle,
  overrideStyleFunction,
} from '../../common/styles';
import { useShouldNestedElementRender } from '../NestableNavigationContent/context';

export type { CustomItemComponentProps, CustomItemProps } from '@atlaskit/menu';

// Dirty hack to get generics working with forward ref [1/2]
interface CustomItemType {
  <TComponentProps extends {}>(
    props: CustomItemProps<TComponentProps> & { ref?: any } & Omit<
        TComponentProps,
        keyof CustomItemComponentProps
      >,
  ): JSX.Element | null;
}

/**
 * Used to support any custom items needed by products alongside the Header and Footer patterns.
 * Specific implementation of headers and footers are provided in the examples folder.
 */
const CustomItem: CustomItemType = forwardRef<HTMLElement, CustomItemProps>(
  // Type needed on props to extract types with extract react types.
  ({ cssFn, ...rest }: CustomItemProps, ref) => {
    const { shouldRender } = useShouldNestedElementRender();
    if (!shouldRender) {
      return null;
    }
    const cssOverride = overrideStyleFunction(baseSideNavItemStyle, cssFn);
    return <Custom ref={ref} cssFn={cssOverride} {...rest} />;
  },
  // Dirty hack to get generics working with forward ref [2/2]
) as any;

export default CustomItem;

import React from 'react';

import {
  HeadingItemProps,
  HeadingItem as MenuHeadingItem,
} from '@atlaskit/menu';

import {
  overrideStyleFunction,
  sectionHeaderSpacingStyles,
} from '../../common/styles';
import { useShouldNestedElementRender } from '../NestableNavigationContent/context';

export type { HeadingItemProps } from '@atlaskit/menu';

/**
 * __Heading item__
 *
 * Available for advanced use cases, for most situations providing a `title` to `section` should be enough.
 *
 */
const HeadingItem = (props: HeadingItemProps) => {
  const { shouldRender } = useShouldNestedElementRender();
  if (!shouldRender) {
    return null;
  }

  const cssFn = overrideStyleFunction(sectionHeaderSpacingStyles, props.cssFn);

  // eslint-disable-next-line @atlaskit/design-system/no-deprecated-apis, @repo/internal/react/no-unsafe-overrides, @repo/internal/react/no-unsafe-spread-props
  return <MenuHeadingItem {...props} cssFn={cssFn} />;
};

export default HeadingItem;

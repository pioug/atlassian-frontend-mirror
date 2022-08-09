import React from 'react';

import {
  SkeletonHeadingItem as MenuSkeletonHeadingItem,
  SkeletonHeadingItemProps,
} from '@atlaskit/menu';

import { ITEM_SIDE_PADDING } from '../../common/styles';
import { useShouldNestedElementRender } from '../NestableNavigationContent/context';

export type { SkeletonHeadingItemProps } from '@atlaskit/menu';

/**
 * __Skeleton heading item__
 *
 * A skeleton heading item for use in managing loading states.
 *
 * - [Examples](https://atlassian.design/components/side-navigation/examples#loading)
 */
const SkeletonHeadingItem = (props: SkeletonHeadingItemProps) => {
  const { shouldRender } = useShouldNestedElementRender();
  if (!shouldRender) {
    return null;
  }

  return (
    <MenuSkeletonHeadingItem
      // eslint-disable-next-line @atlaskit/design-system/no-deprecated-apis, @repo/internal/react/no-unsafe-overrides
      cssFn={() => ({
        paddingLeft: ITEM_SIDE_PADDING,
        paddingRight: ITEM_SIDE_PADDING,
      })}
      // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
      {...props}
    />
  );
};

export default SkeletonHeadingItem;

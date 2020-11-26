import React from 'react';

import {
  SkeletonHeadingItem as MenuSkeletonHeadingItem,
  SkeletonHeadingItemProps,
} from '@atlaskit/menu';

import { ITEM_SIDE_PADDING } from '../../common/styles';
import { useShouldNestedElementRender } from '../NestableNavigationContent/context';

export type { SkeletonHeadingItemProps } from '@atlaskit/menu';

const SkeletonHeadingItem = (props: SkeletonHeadingItemProps) => {
  const { shouldRender } = useShouldNestedElementRender();
  if (!shouldRender) {
    return null;
  }

  return (
    <MenuSkeletonHeadingItem
      cssFn={() => ({
        paddingLeft: ITEM_SIDE_PADDING,
        paddingRight: ITEM_SIDE_PADDING,
      })}
      {...props}
    />
  );
};

export default SkeletonHeadingItem;

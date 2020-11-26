import React from 'react';

import { SkeletonItemProps, SkeletonItem as SkelItem } from '@atlaskit/menu';

import { ITEM_SIDE_PADDING } from '../../common/styles';
import { useShouldNestedElementRender } from '../NestableNavigationContent/context';

export type { SkeletonItemProps } from '@atlaskit/menu';

const SkeletonItem = (props: SkeletonItemProps) => {
  const { shouldRender } = useShouldNestedElementRender();
  if (!shouldRender) {
    return null;
  }

  return (
    <SkelItem
      cssFn={() => ({
        paddingLeft: ITEM_SIDE_PADDING,
        paddingRight: ITEM_SIDE_PADDING,
        '&&::before': {
          // This doubles up & to get a higher specificity as well as to not overwite the base styles.
          marginRight: 18,
        },
      })}
      {...props}
    />
  );
};

export default SkeletonItem;

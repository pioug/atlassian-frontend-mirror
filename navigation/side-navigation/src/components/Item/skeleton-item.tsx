import React from 'react';

import { SkeletonItemProps, SkeletonItem as SkelItem } from '@atlaskit/menu';

import { ITEM_SIDE_PADDING } from '../../common/styles';
import { useShouldNestedElementRender } from '../NestableNavigationContent/context';

export type { SkeletonItemProps } from '@atlaskit/menu';

/**
 * __Skeleton item__
 *
 * A skeleton item can be used to reduce the perceived laoding time.
 *
 * - [Examples](https://atlassian.design/components/side-navigation/examples#loading)
 * - [Code](https://atlassian.design/components/side-navigation/code)
 */
const SkeletonItem = (props: SkeletonItemProps) => {
  const { shouldRender } = useShouldNestedElementRender();
  if (!shouldRender) {
    return null;
  }

  return (
    <SkelItem
      // eslint-disable-next-line @atlaskit/design-system/no-deprecated-apis, @repo/internal/react/no-unsafe-overrides
      cssFn={() => ({
        paddingLeft: ITEM_SIDE_PADDING,
        paddingRight: ITEM_SIDE_PADDING,
        '&&::before': {
          // This doubles up & to get a higher specificity as well as to not overwite the base styles.
          marginRight: 18,
        },
      })}
      // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
      {...props}
    />
  );
};

export default SkeletonItem;

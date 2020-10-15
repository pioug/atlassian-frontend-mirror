import React from 'react';

import {
  HeadingItemProps,
  HeadingItem as MenuHeadingItem,
} from '@atlaskit/menu';

import { overrideStyleFunction, sectionHeaderStyle } from '../../common/styles';
import { useShouldNestedElementRender } from '../NestableNavigationContent/context';

export type { HeadingItemProps } from '@atlaskit/menu';

const HeadingItem = (props: HeadingItemProps) => {
  const { shouldRender } = useShouldNestedElementRender();
  if (!shouldRender) {
    return null;
  }

  const cssFn = overrideStyleFunction(sectionHeaderStyle, props.cssFn);

  return <MenuHeadingItem {...props} cssFn={cssFn} />;
};

export default HeadingItem;

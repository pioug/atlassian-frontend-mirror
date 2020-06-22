/** @jsx jsx */
import { useEffect } from 'react';

import { jsx } from '@emotion/core';

import {
  DEFAULT_TOP_NAVIGATION_HEIGHT,
  TOP_NAVIGATION_HEIGHT,
} from '../../common/constants';
import { SlotHeightProps } from '../../common/types';
import { resolveDimension } from '../../common/utils';
import { publishGridState } from '../../controllers';

import SlotDimensions from './slot-dimensions';
import { topNavigationStyles } from './styles';

const TopNavigation = (props: SlotHeightProps) => {
  const {
    children,
    height = DEFAULT_TOP_NAVIGATION_HEIGHT,
    isFixed = true,
    shouldPersistHeight,
    testId,
  } = props;

  const topNavigationHeight = resolveDimension(
    TOP_NAVIGATION_HEIGHT,
    height,
    shouldPersistHeight,
  );

  useEffect(() => {
    publishGridState({ [TOP_NAVIGATION_HEIGHT]: topNavigationHeight });
    return () => {
      publishGridState({ [TOP_NAVIGATION_HEIGHT]: 0 });
    };
  }, [topNavigationHeight]);

  return (
    <div css={topNavigationStyles(isFixed)} data-testid={testId}>
      <SlotDimensions
        variableName={TOP_NAVIGATION_HEIGHT}
        value={topNavigationHeight}
      />
      {children}
    </div>
  );
};

export default TopNavigation;

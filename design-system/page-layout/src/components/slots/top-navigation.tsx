/** @jsx jsx */
import { useEffect } from 'react';

import { jsx } from '@emotion/core';

import { TOP_NAVIGATION_HEIGHT } from '../../common/constants';
import { SlotHeightProps } from '../../common/types';
import {
  removeFromGridStateInStorage,
  resolveDimension,
} from '../../common/utils';
import { usePageLayoutGrid } from '../../controllers';

import SlotDimensions from './slot-dimensions';
import { topNavigationStyles } from './styles';

export default (props: SlotHeightProps) => {
  const {
    children,
    height,
    isFixed = true,
    shouldPersistHeight,
    testId,
  } = props;

  const topNavigationHeight = resolveDimension(
    TOP_NAVIGATION_HEIGHT,
    height,
    shouldPersistHeight,
  );

  usePageLayoutGrid({ [TOP_NAVIGATION_HEIGHT]: topNavigationHeight });
  useEffect(() => {
    return () => {
      removeFromGridStateInStorage('gridState', TOP_NAVIGATION_HEIGHT);
      document.documentElement.style.removeProperty(
        `--${TOP_NAVIGATION_HEIGHT}`,
      );
    };
  }, []);

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

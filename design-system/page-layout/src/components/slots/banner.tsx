/** @jsx jsx */
import { useEffect } from 'react';

import { jsx } from '@emotion/core';

import { BANNER_HEIGHT } from '../../common/constants';
import { SlotHeightProps } from '../../common/types';
import {
  removeFromGridStateInStorage,
  resolveDimension,
} from '../../common/utils';
import { usePageLayoutGrid } from '../../controllers';

import SlotDimensions from './slot-dimensions';
import { bannerStyles } from './styles';

export default (props: SlotHeightProps) => {
  const {
    children,
    height,
    isFixed = true,
    shouldPersistHeight,
    testId,
  } = props;

  const bannerHeight = resolveDimension(
    BANNER_HEIGHT,
    height,
    shouldPersistHeight,
  );

  usePageLayoutGrid({ [BANNER_HEIGHT]: bannerHeight });
  useEffect(() => {
    return () => {
      removeFromGridStateInStorage('gridState', BANNER_HEIGHT);
      document.documentElement.style.removeProperty(`--${BANNER_HEIGHT}`);
    };
  }, []);

  return (
    <div css={bannerStyles(isFixed)} data-testid={testId}>
      <SlotDimensions variableName={BANNER_HEIGHT} value={bannerHeight} />
      {children}
    </div>
  );
};

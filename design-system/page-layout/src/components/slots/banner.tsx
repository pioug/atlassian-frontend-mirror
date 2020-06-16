/** @jsx jsx */
import { useEffect } from 'react';

import { jsx } from '@emotion/core';

import { BANNER_HEIGHT } from '../../common/constants';
import { SlotHeightProps } from '../../common/types';
import { resolveDimension } from '../../common/utils';
import { publishGridState } from '../../controllers';

import SlotDimensions from './slot-dimensions';
import { bannerStyles } from './styles';

const Banner = (props: SlotHeightProps) => {
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

  useEffect(() => {
    publishGridState({ [BANNER_HEIGHT]: bannerHeight });
    return () => {
      publishGridState({ [BANNER_HEIGHT]: 0 });
    };
  }, [bannerHeight]);

  return (
    <div css={bannerStyles(isFixed)} data-testid={testId}>
      <SlotDimensions variableName={BANNER_HEIGHT} value={bannerHeight} />
      {children}
    </div>
  );
};

export default Banner;

/** @jsx jsx */
import { useEffect } from 'react';

import { jsx } from '@emotion/core';

import { BANNER_HEIGHT, DEFAULT_BANNER_HEIGHT } from '../../common/constants';
import { SlotHeightProps } from '../../common/types';
import { resolveDimension } from '../../common/utils';
import { publishGridState, useSkipLinks } from '../../controllers';

import SlotDimensions from './slot-dimensions';
import { bannerStyles } from './styles';

const Banner = (props: SlotHeightProps) => {
  const {
    children,
    height = DEFAULT_BANNER_HEIGHT,
    isFixed = true,
    shouldPersistHeight,
    testId,
    skipLinkTitle,
    id,
  } = props;

  const bannerHeight = resolveDimension(
    BANNER_HEIGHT,
    height,
    shouldPersistHeight,
  );

  const { registerSkipLink, unregisterSkipLink } = useSkipLinks();

  useEffect(() => {
    publishGridState({ [BANNER_HEIGHT]: bannerHeight });
    return () => {
      publishGridState({ [BANNER_HEIGHT]: 0 });
      unregisterSkipLink(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bannerHeight, id]);

  if (id && skipLinkTitle) {
    registerSkipLink({ id, skipLinkTitle });
  }

  return (
    <div css={bannerStyles(isFixed)} data-testid={testId} id={id}>
      <SlotDimensions variableName={BANNER_HEIGHT} value={bannerHeight} />
      {children}
    </div>
  );
};

export default Banner;

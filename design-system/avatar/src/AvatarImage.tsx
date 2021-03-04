/** @jsx jsx */
import { FC, useEffect, useMemo, useState } from 'react';

import { jsx } from '@emotion/core';

import PersonIcon from '@atlaskit/icon/glyph/person';
import ShipIcon from '@atlaskit/icon/glyph/ship';
import { background, N90 } from '@atlaskit/theme/colors';

import { AVATAR_RADIUS, AVATAR_SIZES } from './constants';
import { AppearanceType, SizeType } from './types';

interface Props {
  appearance: AppearanceType;
  size: SizeType;
  alt?: string;
  src?: string;
  testId?: string;
}

export const ICON_BACKGROUND = background();
export const ICON_COLOR = N90;

const AvatarImage: FC<Props> = ({
  alt = '',
  src,
  appearance,
  size,
  testId,
}) => {
  const [phase, setPhase] = useState<
    'initial' | 'loading' | 'error' | 'loaded'
  >('initial');
  const borderRadius =
    appearance === 'circle' ? '50%' : `${AVATAR_RADIUS[size]}px`;
  const image: HTMLImageElement | null = useMemo(() => {
    if (src) {
      setPhase('loading');
      const img = new Image();
      img.onload = () => setPhase('loaded');
      img.onerror = () => setPhase('error');
      img.src = src;
      return img;
    }
    return null;
  }, [src]);

  useEffect(() => {
    return () => {
      if (image) {
        image.onload = () => {};
        image.onerror = () => {};
      }
    };
  }, [image]);

  const imageHasLoadedAsync = src && phase !== 'loading' && phase !== 'error';
  const imageHasLoadedSync = src && phase === 'loading' && image?.complete;
  const imageHasLoaded = imageHasLoadedAsync || imageHasLoadedSync;

  if (!imageHasLoaded) {
    return (
      <span
        css={{
          backgroundColor: ICON_COLOR,
          width: '100%',
          height: '100%',
          display: 'block',
          '& svg': {
            height: `${AVATAR_SIZES[size]}px`,
            width: `${AVATAR_SIZES[size]}px`,
          },
        }}
      >
        {appearance === 'circle' ? (
          <PersonIcon
            label={alt}
            primaryColor={background()}
            secondaryColor={ICON_COLOR}
            testId={testId && `${testId}--person`}
          />
        ) : (
          <ShipIcon
            label={alt}
            primaryColor={background()}
            secondaryColor={ICON_COLOR}
            testId={testId && `${testId}--ship`}
          />
        )}
      </span>
    );
  }

  return (
    <span
      css={{
        backgroundColor: 'transparent',
        backgroundImage: `url(${src})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        borderRadius,
        display: 'flex',
        flex: '1 1 100%',
        height: '100%',
        width: '100%',
      }}
      role="img"
      aria-label={alt}
      data-testid={testId && `${testId}--image`}
    />
  );
};

export default AvatarImage;

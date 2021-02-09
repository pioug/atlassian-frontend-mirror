/** @jsx jsx */
import { FC, useEffect, useState } from 'react';

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

  useEffect(() => {
    // check whether there was a problem loading the image
    // if handleLoadError is called we show the default avatar
    let img: HTMLImageElement;

    if (src) {
      setPhase('loading');
      img = new Image();
      img.onload = () => setPhase('loaded');
      img.onerror = () => setPhase('error');
      img.src = src;
    }

    return () => {
      if (img) {
        img.onload = () => {};
        img.onerror = () => {};
      }
    };
  }, [src]);

  if (phase === 'loading' || phase === 'error' || !src) {
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

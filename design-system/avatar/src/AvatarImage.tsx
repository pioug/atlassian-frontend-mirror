/** @jsx jsx */
// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import { FC, useEffect, useMemo, useState } from 'react';

import { css, jsx } from '@emotion/core';

import PersonIcon from '@atlaskit/icon/glyph/person';
import ShipIcon from '@atlaskit/icon/glyph/ship';
import { background, N90 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import { AVATAR_RADIUS, AVATAR_SIZES } from './constants';
import { AppearanceType, SizeType } from './types';

interface AvatarImageProps {
  appearance: AppearanceType;
  size: SizeType;
  alt?: string;
  src?: string;
  testId?: string;
}

export const ICON_BACKGROUND = token('color.text.onBold', background());
export const ICON_COLOR = token('color.text.lowEmphasis', N90);

const avatarImageStyles = css({
  display: 'block',
  width: '100%',
  height: '100%',
  backgroundColor: ICON_COLOR,
});

const loadingImageStyles = css({
  display: 'flex',
  width: '100%',
  height: '100%',
  flex: '1 1 100%',
  backgroundColor: 'transparent',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
});

/**
 * __Avatar image__
 *
 * An avatar image is an internal component used to control the rendering phases of an image.
 */
const AvatarImage: FC<AvatarImageProps> = ({
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
        css={[
          avatarImageStyles,
          // TODO: These dynamic SVG styles can't be set in 'style'. On a refactor, use a css custom property to pass down the size
          // eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
          {
            '& svg': {
              width: `${AVATAR_SIZES[size]}px`,
              height: `${AVATAR_SIZES[size]}px`,
            },
          },
        ]}
      >
        {appearance === 'circle' ? (
          <PersonIcon
            label={alt}
            primaryColor={ICON_BACKGROUND}
            secondaryColor={ICON_COLOR}
            testId={testId && `${testId}--person`}
          />
        ) : (
          <ShipIcon
            label={alt}
            primaryColor={ICON_BACKGROUND}
            secondaryColor={ICON_COLOR}
            testId={testId && `${testId}--ship`}
          />
        )}
      </span>
    );
  }

  return (
    <span
      css={loadingImageStyles}
      style={{
        backgroundImage: `url("${src}")`,
        borderRadius: borderRadius,
      }}
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
      data-testid={testId && `${testId}--image`}
    />
  );
};

export default AvatarImage;

/** @jsx jsx */
// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import { FC, useEffect, useState } from 'react';

import { css, jsx, SerializedStyles } from '@emotion/react';

import PersonIcon from '@atlaskit/icon/glyph/person';
import ShipIcon from '@atlaskit/icon/glyph/ship';
import { N0, N90 } from '@atlaskit/theme/colors';
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

export const ICON_BACKGROUND = token('color.icon.inverse', N0);
export const ICON_COLOR = token('color.icon.subtle', N90);

const avatarDefaultIconStyles = css({
  display: 'block',
  width: '100%',
  height: '100%',
  backgroundColor: ICON_COLOR,
});

const nestedAvatarStyles = Object.entries(AVATAR_SIZES).reduce(
  (styles, [key, size]) => {
    return {
      ...styles,
      [key]: css({
        // eslint-disable-next-line @repo/internal/styles/no-nested-styles
        '& svg': {
          width: `${size}px`,
          height: `${size}px`,
        },
      }),
    };
  },
  {} as Record<SizeType, SerializedStyles>,
);

const avatarImageStyles = css({
  display: 'flex',
  width: '100%',
  height: '100%',
  flex: '1 1 100%',
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
  const [hasImageErrored, setHasImageErrored] = useState(false);
  const borderRadius =
    appearance === 'circle' ? '50%' : `${AVATAR_RADIUS[size]}px`;

  // If src changes, reset state
  useEffect(() => {
    setHasImageErrored(false);
  }, [src]);

  if (!src || hasImageErrored) {
    return (
      <span css={[avatarDefaultIconStyles, nestedAvatarStyles[size]]}>
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
    <img
      src={src}
      alt={alt}
      data-testid={testId && `${testId}--image`}
      css={avatarImageStyles}
      style={{
        borderRadius: borderRadius,
      }}
      onError={() => setHasImageErrored(true)}
    />
  );
};

export default AvatarImage;

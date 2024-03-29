/** @jsx jsx */
import { useEffect, useState } from 'react';

import { css, jsx, SerializedStyles } from '@emotion/react';

import { AVATAR_SIZES, CustomAvatarProps, SizeType } from '@atlaskit/avatar';
import TeamIcon from '@atlaskit/icon/glyph/people';
import { N0, N90 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

type AvatarImageProps = {
  size: SizeType;
  alt?: string;
  src?: string;
  testId?: string;
} & CustomAvatarProps;

const ICON_BACKGROUND = token('color.icon.inverse', N0);
const ICON_COLOR = token('color.icon.subtle', N90);
// used in a size calculation so can't be a token. Without this the avatar looks very squished
const ICON_PADDING = 4;

const avatarDefaultIconStyles = css({
  display: 'flex',
  backgroundColor: ICON_COLOR,
  borderRadius: '50%',
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
});

const nestedAvatarStyles = Object.entries(AVATAR_SIZES).reduce(
  (styles, [key, size]) => {
    return {
      ...styles,

      [key]: css({
        width: `${size}px`,
        height: `${size}px`,

        // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
        '& svg': {
          width: `${size - ICON_PADDING}px`,
          height: `${size - ICON_PADDING}px`,
        },
      }),
    };
  },
  {} as Record<SizeType, SerializedStyles>,
);

const avatarImageStyles = css({
  display: 'flex',
  flex: '1 1 100%',
  width: '100%',
  height: '100%',
});

/**
 * __Avatar image__
 *
 * An avatar image is an internal component used to control the rendering phases of an image.
 */
export const TeamAvatarImage = ({
  alt = '',
  src,
  size,
  testId,
  ...rest
}: AvatarImageProps) => {
  const [hasImageErrored, setHasImageErrored] = useState(false);

  // If src changes, reset state
  useEffect(() => {
    setHasImageErrored(false);
  }, [src]);

  if (!src || hasImageErrored) {
    return (
      <span css={[avatarDefaultIconStyles, nestedAvatarStyles[size]]}>
        <TeamIcon
          label={alt}
          primaryColor={ICON_BACKGROUND}
          secondaryColor={ICON_COLOR}
          testId={testId && `${testId}--team`}
        />
      </span>
    );
  }

  return (
    <span {...rest}>
      <img
        src={src}
        alt={alt}
        data-testid={testId && `${testId}--image`}
        css={avatarImageStyles}
        onError={() => setHasImageErrored(true)}
      />
    </span>
  );
};

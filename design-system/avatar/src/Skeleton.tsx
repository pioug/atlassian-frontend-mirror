/** @jsx jsx */
// eslint-disable-next-line @repo/internal/fs/filename-pattern-match
import { CSSProperties, FC } from 'react';

import { css, jsx, SerializedStyles } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import {
  AVATAR_RADIUS,
  AVATAR_SIZES,
  BORDER_WIDTH,
  CSS_VAR_AVATAR_BGCOLOR,
} from './constants';
import { AppearanceType, SizeType } from './types';

export interface SkeletonProps {
  /**
   * Indicates the shape of the avatar skeleton. Most avatars are circular, but square avatars can be used for container objects.
   */
  appearance?: AppearanceType;
  /**
   * Color of the skeleton. By default, it will inherit the current text color.
   */
  color?: string;
  /**
   * Defines the size of the avatar skeleton.
   */
  size?: SizeType;
  /**
   * Defines the opacity of the avatar skeleton. Use `weight="normal"` for the default opacity, or `weight="strong"` for a bolder opacity.
   */
  weight?: 'normal' | 'strong';
}

const skeletonStyles = css({
  display: 'inline-block',
  backgroundColor: `var(${CSS_VAR_AVATAR_BGCOLOR})`,
  border: `${BORDER_WIDTH}px solid transparent`,
});

const sizeStyles = Object.entries(AVATAR_SIZES).reduce(
  (styles, [key, size]) => {
    return {
      ...styles,
      [key]: css({
        width: `${size}px`,
        height: `${size}px`,
      }),
    };
  },
  {} as Record<SizeType, SerializedStyles>,
);

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
const radiusStyles = Object.entries(AVATAR_RADIUS).reduce(
  (styles, [key, size]) => {
    return {
      ...styles,
      [key]: css({
        // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
        borderRadius: `${size}px`,
      }),
    };
  },
  {} as Record<SizeType, SerializedStyles>,
);
const defaultRadiusStyles = css({
  borderRadius: token('border.radius.circle', '50%'),
});

const strongOpacityStyles = css({
  opacity: 0.3,
});
const defaultOpacityStyles = css({
  opacity: 0.15,
});

/**
 * __Skeleton__
 *
 * A skeleton is the loading state for the avatar component.
 *
 * - [Examples](https://atlassian.design/components/avatar/avatar-skeleton/examples)
 * - [Code](https://atlassian.design/components/avatar/avatar-skeleton/code)
 */
const Skeleton: FC<SkeletonProps> = ({
  size,
  appearance,
  color,
  weight,
}: SkeletonProps) => (
  <div
    css={[
      skeletonStyles,
      sizeStyles[size ?? 'medium'],
      appearance === 'square'
        ? radiusStyles[size ?? 'medium']
        : defaultRadiusStyles,
      weight === 'strong' ? strongOpacityStyles : defaultOpacityStyles,
    ]}
    style={
      {
        [CSS_VAR_AVATAR_BGCOLOR]: color ?? 'currentColor',
      } as CSSProperties
    }
  />
);

export default Skeleton;

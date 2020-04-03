import React, { FC } from 'react';
import styled from 'styled-components';
import { background } from '@atlaskit/theme/colors';

export type Sizes = 'small' | 'medium' | 'large' | 'xlarge';

const sizes = {
  small: '16px',
  medium: '24px',
  large: '32px',
  xlarge: '48px',
};

export const size = Object.keys(sizes).reduce(
  (p, c) => Object.assign(p, { [c]: c }),
  {},
);

export interface IconProps {
  /** This is for internal use only in this package. If you want to use prop please consider using the
   * @atlaskit/icon package  */
  dangerouslySetGlyph?: string;
  /** String to use as the aria-label for the icon. Set to an empty string if you are rendering the icon with visible text to prevent accessibility label duplication. */
  label: string;
  /** Control the size of the icon */
  size?: Sizes;
}

interface IconWrapperProps {
  size: Sizes;
  primaryColor?: string;
  secondaryColor?: string;
}

const getSize = (props: IconWrapperProps) =>
  props.size
    ? `height: ${sizes[props.size]}; width: ${sizes[props.size]};`
    : null;

export const IconWrapper = styled.span<IconWrapperProps>`
  ${getSize} color: ${p => p.primaryColor || 'currentColor'};
  display: inline-block;
  fill: ${p => p.secondaryColor || background};
  flex-shrink: 0;
  line-height: 1;

  > svg {
    ${getSize} max-height: 100%;
    max-width: 100%;
    overflow: hidden;
    pointer-events: none;
    vertical-align: bottom;
  }
  /* Stop-color doesn't properly apply in chrome when the inherited/current color changes.
   * We have to initially set stop-color to inherit (either via DOM attribute or an initial CSS
   * rule) and then override it with currentColor for the color changes to be picked up.
   */
  stop {
    stop-color: currentColor;
  }
`;

const Icon: FC<IconProps> = ({
  dangerouslySetGlyph,
  size = 'medium',
  label,
}) => (
  <IconWrapper
    size={size}
    aria-label={label ? label : undefined}
    role={label ? 'img' : 'presentation'}
    dangerouslySetInnerHTML={
      dangerouslySetGlyph
        ? {
            __html: dangerouslySetGlyph,
          }
        : undefined
    }
  />
);

export default Icon;

/** @jsx jsx */
import { HTMLProps, ReactElement, memo } from 'react';
import { css, jsx } from '@emotion/core';
import GlobalTheme from '@atlaskit/theme/components';
import type { Theme, ThemeModes } from '@atlaskit/theme/types';

import type { sizeOpts } from '../types';
import { sizes } from '../constants';
import { getBackground } from './utils';

type WrapperProps = {
  primaryColor?: string;
  secondaryColor?: string;
  size?: sizeOpts;
  mode: ThemeModes;
} & Omit<HTMLProps<HTMLSpanElement>, 'size'>;

export const IconWrapper = memo<WrapperProps>(function IconWrapper({
  primaryColor,
  secondaryColor,
  size,
  mode,
  ...rest
}) {
  return (
    <span
      css={css`
        ${size && `height: ${sizes[size]}`};
        ${size && `width: ${sizes[size]}`};
        color: ${primaryColor || 'currentColor'};
        display: inline-block;
        fill: ${secondaryColor || getBackground(mode)};
        flex-shrink: 0;
        line-height: 1;

        > svg {
          ${size && `height: ${sizes[size]}`};
          ${size && `width: ${sizes[size]}`};
          max-height: 100%;
          max-width: 100%;
          overflow: hidden;
          pointer-events: none;
          vertical-align: bottom;
        }

        /**
        * Stop-color doesn't properly apply in chrome when the inherited/current color changes.
        * We have to initially set stop-color to inherit (either via DOM attribute or an initial CSS
        * rule) and then override it with currentColor for the color changes to be picked up.
        */
        stop {
          stop-color: currentColor;
        }
      `}
      {...rest}
    />
  );
});

export interface IconProps {
  /**
   * String to use as the aria-label for the icon.
   * **Use an empty string when you already have readable text around the icon,
   * like text inside a button**!
   */
  label: string;

  /**
   * Glyph to show by Icon component (not required when you import a glyph directly).
   * Please ensure you have a stable reference.
   */
  glyph?: (props: { role: string }) => ReactElement;

  /**
   * More performant than the glyph prop,
   * but potentially dangerous if the SVG string hasn't been "sanitised"
   */
  dangerouslySetGlyph?: string;

  /**
   * For primary colour for icons.
   */
  primaryColor?: string;

  /**
   * For secondary colour for 2-color icons.
   * Set to inherit to control this via "fill" in CSS
   */
  secondaryColor?: string;

  /**
   * Control the size of the icon.
   */
  size?: sizeOpts;

  /**
   * A `testId` prop is provided for specified elements,
   * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests.
   */
  testId?: string;
}

const Icon = memo(function Icon(props: IconProps) {
  const {
    glyph: Glyph,
    dangerouslySetGlyph,
    primaryColor,
    secondaryColor,
    size,
    testId,
    label,
  } = props;
  const glyphProps = dangerouslySetGlyph
    ? {
        dangerouslySetInnerHTML: {
          __html: dangerouslySetGlyph,
        },
      }
    : { children: Glyph ? <Glyph role="presentation" /> : null };

  return (
    <GlobalTheme.Consumer>
      {({ mode }: Theme) => (
        <IconWrapper
          mode={mode}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          size={size}
          data-testid={testId}
          role={label ? 'img' : 'presentation'}
          aria-label={label ? label : undefined}
          {...glyphProps}
        />
      )}
    </GlobalTheme.Consumer>
  );
});

export default Icon;

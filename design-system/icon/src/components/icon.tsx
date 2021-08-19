/** @jsx jsx */
import { memo, CSSProperties } from 'react';
import { css, jsx } from '@emotion/core';
import { useGlobalTheme } from '@atlaskit/theme/components';

import type { IconProps } from '../types';
import { getBackground } from './utils';
import { commonSVGStyles, getIconSize } from './styles';

/**
 * We are hiding these props from consumers as they're used to
 * hack around icon sizing specifically for icon-file-type.
 */
interface InternalIconProps extends IconProps {
  /**
   * @internal NOT FOR PUBLIC USE.
   * Fixes the width of the icon.
   * This is used only for the custom sized icons in `@atlaskit/icon-file-type`.
   */
  width?: number;

  /**
   * @internal NOT FOR PUBLIC USE.
   * Fixes the height of the icon.
   * This is used only for the custom sized icons in `@atlaskit/icon-file-type`.
   */
  height?: number;
}

const iconStyles = css({
  display: 'inline-block',
  flexShrink: 0,
  lineHeight: 1,
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  '> svg': {
    ...commonSVGStyles,
    maxWidth: '100%',
    maxHeight: '100%',
    color: 'var(--icon-primary-color)',
    fill: 'var(--icon-secondary-color)',
    verticalAlign: 'bottom',
  },
});
/**
 * For windows high contrast mode
 */
const baseHcmStyles = css({
  '@media screen and (forced-colors: active)': {
    // eslint-disable-next-line @repo/internal/styles/no-nested-styles
    '> svg': {
      filter: 'grayscale(1)',
      '--icon-primary-color': 'CanvasText', // foreground
      '--icon-secondary-color': 'Canvas', // background
    },
  },
});
const primaryEqualsSecondaryHcmStyles = css({
  '@media screen and (forced-colors: active)': {
    // eslint-disable-next-line @repo/internal/styles/no-nested-styles
    '> svg': {
      // if the primaryColor is the same as the secondaryColor we
      // set the --icon-primary-color to Canvas
      // this is usually to convey state i.e. Checkbox checked -> not checked
      '--icon-primary-color': 'Canvas', // foreground
    },
  },
});
const secondaryTransparentHcmStyles = css({
  '@media screen and (forced-colors: active)': {
    // eslint-disable-next-line @repo/internal/styles/no-nested-styles
    '> svg': {
      '--icon-secondary-color': 'transparent', // background
    },
  },
});

/**
 * __Icon__
 *
 * An icon is used as a visual representation of common actions and commands to provide context.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/icon)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/icon/docs/custom-icons)
 */
export const Icon = memo(function Icon(props: IconProps) {
  const {
    glyph: Glyph,
    dangerouslySetGlyph,
    primaryColor = 'currentColor',
    secondaryColor,
    size,
    testId,
    label,
    width,
    height,
  } = props as InternalIconProps;

  const glyphProps = dangerouslySetGlyph
    ? {
        dangerouslySetInnerHTML: {
          __html: dangerouslySetGlyph,
        },
      }
    : { children: Glyph ? <Glyph role="presentation" /> : null };
  const dimensions = getIconSize({ width, height, size });
  const { mode } = useGlobalTheme();

  return (
    <span
      data-testid={testId}
      role={label ? 'img' : 'presentation'}
      aria-label={label ? label : undefined}
      aria-hidden={label ? undefined : true}
      style={
        {
          '--icon-primary-color': primaryColor,
          '--icon-secondary-color': secondaryColor || getBackground(mode),
        } as CSSProperties
      }
      {...glyphProps}
      css={[
        iconStyles,
        baseHcmStyles,
        primaryColor === secondaryColor && primaryEqualsSecondaryHcmStyles,
        secondaryColor === 'transparent' && secondaryTransparentHcmStyles,
        // NB: This can be resolved if this component, composes base SVG / and/or skeleton
        // We could then simplify how common styles are dealt with simply by encapsualting them
        // at their appropriate level and/or having a singular approach to css variables in the package
        dimensions &&
          // eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
          css({
            width: dimensions.width,
            height: dimensions.height,
            '> svg': dimensions,
          }),
      ]}
    />
  );
});

export default Icon;

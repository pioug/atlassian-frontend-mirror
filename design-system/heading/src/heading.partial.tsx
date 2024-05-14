/** @jsx jsx */
import { css, jsx, type SerializedStyles } from '@emotion/react';

import {
  UNSAFE_inverseColorMap,
  UNSAFE_useSurface,
} from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import { useHeading } from './heading-context';
import type { HeadingColor, NewHeadingProps } from './types';

const sizeTagMap = {
  xxlarge: 'h1',
  xlarge: 'h1',
  large: 'h2',
  medium: 'h3',
  small: 'h4',
  xsmall: 'h5',
  xxsmall: 'h6',
} as const;

const headingResetStyles = css({
  letterSpacing: 'normal',
  marginBlock: 0,
  textTransform: 'none',
});

const useColor = (colorProp?: HeadingColor): HeadingColor => {
  const surface = UNSAFE_useSurface();

  /**
   * Where the color of the surface is inverted we always override the color
   * as there is no valid choice that is not covered by the override.
   */
  if (UNSAFE_inverseColorMap.hasOwnProperty(surface)) {
    return UNSAFE_inverseColorMap[
      surface as keyof typeof UNSAFE_inverseColorMap
    ];
  }

  return colorProp || 'color.text';
};

/**
 * __Heading__
 *
 * Heading is a typography component used to display text in defined sizes and styles.
 *
 * @example
 *
 * ```jsx
 * <Heading size="xxlarge">Page title</Heading>
 * ```
 */
const Heading = ({
  children,
  size,
  id,
  testId,
  as,
  color: colorProp,
}: NewHeadingProps) => {
  if (
    typeof process !== 'undefined' &&
    process.env.NODE_ENV !== 'production' &&
    as &&
    typeof as !== 'string'
  ) {
    throw new Error('`as` prop should be a string.');
  }

  // Technically size can be undefined here due to how the types work.
  // Once removing the level prop this assertion can be removed since size will be a required prop.
  const [hLevel, inferredElement] = useHeading(sizeTagMap[size!]);
  const Component = as || inferredElement;
  const needsAriaRole = Component === 'div' && hLevel;
  const color = useColor(colorProp);

  return (
    <Component
      id={id}
      data-testid={testId}
      role={needsAriaRole ? 'heading' : undefined}
      aria-level={needsAriaRole ? hLevel : undefined}
      css={[
        headingResetStyles,
        size && headingSizeStylesMap[size],
        headingColorStylesMap[color],
      ]}
    >
      {children}
    </Component>
  );
};

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css
export const headingColorStylesMap: Record<HeadingColor, SerializedStyles> = {
  'color.text': css({
    color: token('color.text'),
  }),
  'color.text.inverse': css({
    color: token('color.text.inverse'),
  }),
  'color.text.warning.inverse': css({
    color: token('color.text.warning.inverse'),
  }),
};

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::d7d7bb136aa9b7935c15f8e85d0916d7>>
 * @codegenId typography
 * @codegenCommand yarn workspace @atlaskit/heading codegen
 */
const headingSizeStylesMap = {
    xxlarge: css({ font: token('font.heading.xxlarge') }),
    xlarge: css({ font: token('font.heading.xlarge') }),
    large: css({ font: token('font.heading.large') }),
    medium: css({ font: token('font.heading.medium') }),
    small: css({ font: token('font.heading.small') }),
    xsmall: css({ font: token('font.heading.xsmall') }),
    xxsmall: css({ font: token('font.heading.xxsmall') }),
};

export type HeadingSize = keyof typeof headingSizeStylesMap;

/**
 * @codegenEnd
 */

export default Heading;

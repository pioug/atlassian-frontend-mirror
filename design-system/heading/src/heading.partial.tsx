/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { useHeading } from './heading-context';
import type { HeadingProps } from './types';

// https://atlassian.design/foundations/typography
const variantTagMap = {
  xxlarge: 'h1',
  xlarge: 'h1',
  large: 'h2',
  medium: 'h3',
  small: 'h4',
  xsmall: 'h5',
  xxsmall: 'h6',
} as const;

const headingResetStyles = css({
  color: token('color.text', '#172B4D'),
  letterSpacing: 'normal',
  marginBlock: 0,
  textTransform: 'none',
});

const inverseStyles = css({
  color: token('color.text.inverse', '#FFF'),
});

/**
 * __Heading__
 *
 * Heading is a typography component used to display text in defined sizes and styles.
 *
 * @example
 *
 * ```jsx
 * <Heading variant="xxlarge">Page title</Heading>
 * ```
 */
const Heading = ({
  children,
  variant,
  id,
  testId,
  as,
  color = 'default',
}: HeadingProps) => {
  if (
    typeof process !== 'undefined' &&
    process.env.NODE_ENV !== 'production' &&
    as &&
    typeof as !== 'string'
  ) {
    throw new Error('`as` prop should be a string.');
  }

  // Technically variant can be undefined here due to how the types work.
  // Once removing the level prop this assertion can be removed since variant will be a required prop.
  const [hLevel, inferredElement] = useHeading(variantTagMap[variant!]);
  const Component = as || inferredElement;
  const needsAriaRole = Component === 'div' && hLevel;

  return (
    <Component
      id={id}
      data-testid={testId}
      role={needsAriaRole ? 'heading' : undefined}
      aria-level={needsAriaRole ? hLevel : undefined}
      css={[
        headingResetStyles,
        variant && headingVariantStylesMap[variant],
        color === 'inverse' && inverseStyles,
      ]}
    >
      {children}
    </Component>
  );
};

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::e846dd958c335ee435433cfe1a6ffe77>>
 * @codegenId typography
 * @codegenCommand yarn workspace @atlaskit/heading codegen
 */
const headingVariantStylesMap = {
  xxlarge: css({
    font: token(
      'font.heading.xxlarge',
      'normal 500 35px/40px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif',
    ),
  }),
  xlarge: css({
    font: token(
      'font.heading.xlarge',
      'normal 600 29px/32px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif',
    ),
  }),
  large: css({
    font: token(
      'font.heading.large',
      'normal 500 24px/28px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif',
    ),
  }),
  medium: css({
    font: token(
      'font.heading.medium',
      'normal 500 20px/24px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif',
    ),
  }),
  small: css({
    font: token(
      'font.heading.small',
      'normal 600 16px/20px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif',
    ),
  }),
  xsmall: css({
    font: token(
      'font.heading.xsmall',
      'normal 600 14px/16px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif',
    ),
  }),
  xxsmall: css({
    font: token(
      'font.heading.xxsmall',
      'normal 600 12px/16px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Ubuntu, system-ui, "Helvetica Neue", sans-serif',
    ),
  }),
};

export type HeadingVariant = keyof typeof headingVariantStylesMap;

/**
 * @codegenEnd
 */

export default Heading;

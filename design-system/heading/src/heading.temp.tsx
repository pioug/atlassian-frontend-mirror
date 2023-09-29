/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { useHeadingElement } from './heading-context';
import type { HeadingProps } from './types';

// https://atlassian.design/foundations/typography
const levelMap = {
  xxlarge: 'h1',
  xlarge: 'h2',
  large: 'h3',
  medium: 'h4',
  small: 'h5',
  xsmall: 'h6',
  xxsmall: 'div',
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
 * A heading is a typography component used to display text in different sizes and formats.
 *
 * @example
 *
 * ```jsx
 * import Heading from '@atlaskit/heading';
 *
 * const HeadingXXL = () => (
 *   <Heading level="xxlarge">XXL</Heading>
 * );
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

  const hLevel = useHeadingElement();
  /**
   * Order here is important, we for now apply
   * 1. user choice
   * 2. inferred a11y level
   * 3. default final fallback
   */
  const Markup =
    as ||
    (hLevel && (hLevel > 6 ? 'div' : `h${hLevel as 1 | 2 | 3 | 4 | 5 | 6}`)) ||
    levelMap[variant!];

  return (
    <Markup
      id={id}
      data-testid={testId}
      role={Markup === 'div' ? 'heading' : undefined}
      css={[
        headingResetStyles,
        variant && headingVariantStylesMap[variant],
        color === 'inverse' && inverseStyles,
      ]}
    >
      {children}
    </Markup>
  );
};

/**
 * @codegenStart
 * @codegenId typography
 * @codegenCommand yarn workspace @atlaskit/heading codegen
 */
const headingVariantStylesMap = {
  large: css({
    font: token(
      'font.heading.lg',
      'normal 500 24px/28px var(--ds-font-family-heading)',
    ),
  }),
  medium: css({
    font: token(
      'font.heading.md',
      'normal 500 20px/24px var(--ds-font-family-heading)',
    ),
  }),
  small: css({
    font: token(
      'font.heading.sm',
      'normal 600 16px/20px var(--ds-font-family-heading)',
    ),
  }),
  xlarge: css({
    font: token(
      'font.heading.xl',
      'normal 600 29px/32px var(--ds-font-family-heading)',
    ),
  }),
  xsmall: css({
    font: token(
      'font.heading.xs',
      'normal 600 14px/16px var(--ds-font-family-heading)',
    ),
  }),
  xxlarge: css({
    font: token(
      'font.heading.xxl',
      'normal 500 35px/40px var(--ds-font-family-heading)',
    ),
  }),
  xxsmall: css({
    font: token(
      'font.heading.xxs',
      'normal 600 12px/16px var(--ds-font-family-heading)',
    ),
  }),
};

export type HeadingVariant = keyof typeof headingVariantStylesMap;

/**
 * @codegenEnd
 */

export default Heading;

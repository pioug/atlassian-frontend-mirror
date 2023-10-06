/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { useHeading } from './heading-context';
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

  const [hLevel, inferredElement] = useHeading(levelMap[variant!]);
  const Markup = as || inferredElement;
  const needsAriaRole = Markup === 'div' && hLevel;

  return (
    <Markup
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
    </Markup>
  );
};

/**
 * THIS SECTION WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 * @codegen <<SignedSource::cabcd4e0313e10dd81733a6ffcdbc90f>>
 * @codegenId typography
 * @codegenCommand yarn workspace @atlaskit/heading codegen
 */
const headingVariantStylesMap = {
  large: css({
    font: token(
      'font.heading.large',
      'normal 500 24px/28px var(--ds-font-family-heading)',
    ),
  }),
  medium: css({
    font: token(
      'font.heading.medium',
      'normal 500 20px/24px var(--ds-font-family-heading)',
    ),
  }),
  small: css({
    font: token(
      'font.heading.small',
      'normal 600 16px/20px var(--ds-font-family-heading)',
    ),
  }),
  xlarge: css({
    font: token(
      'font.heading.xlarge',
      'normal 600 29px/32px var(--ds-font-family-heading)',
    ),
  }),
  xsmall: css({
    font: token(
      'font.heading.xsmall',
      'normal 600 14px/16px var(--ds-font-family-heading)',
    ),
  }),
  xxlarge: css({
    font: token(
      'font.heading.xxlarge',
      'normal 500 35px/40px var(--ds-font-family-heading)',
    ),
  }),
  xxsmall: css({
    font: token(
      'font.heading.xxsmall',
      'normal 600 12px/16px var(--ds-font-family-heading)',
    ),
  }),
};

export type HeadingVariant = keyof typeof headingVariantStylesMap;

/**
 * @codegenEnd
 */

export default Heading;

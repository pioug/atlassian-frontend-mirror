/** @jsx jsx */
import { FC } from 'react';

import { css, jsx } from '@emotion/react';

import { N0, N200, N800 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import type { HeadingProps } from './types';
import { lh } from './utils';

// https://atlassian.design/foundations/typography
const levelMap = {
  h900: 'h1',
  h800: 'h1',
  h700: 'h2',
  h600: 'h3',
  h500: 'h4',
  h400: 'h5',
  h300: 'h6',
  // NB: These two levels are not covered at all by the existing @atlaskit/css-reset
  h200: 'div',
  h100: 'div',
} as const;

const headingResetStyles = css({
  // TODO Delete this comment after verifying spacing token -> previous value `0`
  margin: token('spacing.scale.0', '0px'),
});

const h900Styles = css({
  fontSize: 35,
  fontWeight: 500,
  letterSpacing: '-0.01em',
  lineHeight: lh(35, 40),
});

const h800Styles = css({
  fontSize: 29,
  fontWeight: 600,
  letterSpacing: '-0.01em',
  lineHeight: lh(29, 32),
});

const h700Styles = css({
  fontSize: 24,
  fontWeight: 500,
  letterSpacing: '-0.01em',
  lineHeight: lh(24, 28),
});

const h600Styles = css({
  fontSize: 20,
  fontWeight: 500,
  letterSpacing: '-0.008em',
  lineHeight: lh(20, 24),
});

const h500Styles = css({
  fontSize: 16,
  fontWeight: 600,
  letterSpacing: '-0.006em',
  lineHeight: lh(16, 20),
});

const h400Styles = css({
  fontSize: 14,
  fontWeight: 600,
  letterSpacing: '-0.003em',
  lineHeight: lh(14, 16),
});

const h300Styles = css({
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 0,
  lineHeight: lh(12, 16),
  textTransform: 'uppercase',
});

const h200Styles = css({
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 0,
  lineHeight: lh(12, 16),
});

const h100Styles = css({
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: 0,
  lineHeight: lh(11, 16),
});

const styleMap = {
  h900: h900Styles,
  h800: h800Styles,
  h700: h700Styles,
  h600: h600Styles,
  h500: h500Styles,
  h400: h400Styles,
  h300: h300Styles,
  h200: h200Styles,
  h100: h100Styles,
} as const;

const colorStyleMap = {
  default: css({
    color: token('color.text', N800),
  }),
  inverse: css({
    color: token('color.text.inverse', N0),
  }),
  subtlest: css({
    color: token('color.text.subtlest', N200),
  }),
};

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
 * const H100 = () => (
 *   <Heading level="h100">h100</Heading>
 * );
 * ```
 */
const Heading: FC<HeadingProps> = ({
  children,
  level,
  id,
  testId,
  as,
  color = 'default',
}) => {
  if (process.env.NODE_ENV !== 'production' && as && typeof as !== 'string') {
    throw new Error('`as` prop should be a string.');
  }

  const Markup = as || levelMap[level];
  const isSubtleHeading = level === 'h200' || level === 'h100';

  return (
    <Markup
      id={id}
      data-testid={testId}
      css={[
        headingResetStyles,
        styleMap[level],
        color === 'inverse' && colorStyleMap.inverse,
        color === 'default' && isSubtleHeading && colorStyleMap.subtlest,
        color === 'default' && !isSubtleHeading && colorStyleMap.default,
      ]}
    >
      {children}
    </Markup>
  );
};

export default Heading;

/** @jsx jsx */
import { FC } from 'react';

import { css, jsx } from '@emotion/core';

import { N200, N800 } from '@atlaskit/theme/colors';
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
  margin: 0,
});

const h900Styles = css({
  color: token('color.text.highEmphasis', N800),
  fontSize: `${35 / 14}rem`,
  fontWeight: 500,
  letterSpacing: '-0.01em',
  lineHeight: lh(35, 40),
});

const h800Styles = css({
  color: token('color.text.highEmphasis', N800),
  fontSize: `${29 / 14}rem`,
  fontWeight: 600,
  letterSpacing: '-0.01em',
  lineHeight: lh(29, 32),
});

const h700Styles = css({
  color: token('color.text.highEmphasis', N800),
  fontSize: `${24 / 14}rem`,
  fontWeight: 500,
  letterSpacing: '-0.01em',
  lineHeight: lh(24, 28),
});

const h600Styles = css({
  color: token('color.text.highEmphasis', N800),
  fontSize: `${20 / 14}rem`,
  fontWeight: 500,
  letterSpacing: '-0.008em',
  lineHeight: lh(20, 24),
});

const h500Styles = css({
  color: token('color.text.highEmphasis', N800),
  fontSize: `${16 / 14}rem`,
  fontWeight: 600,
  letterSpacing: '-0.006em',
  lineHeight: lh(16, 20),
});

const h400Styles = css({
  color: token('color.text.highEmphasis', N800),
  fontSize: '1rem',
  fontWeight: 600,
  letterSpacing: '-0.003em',
  lineHeight: lh(14, 16),
});

const h300Styles = css({
  color: token('color.text.highEmphasis', N800),
  fontSize: `${12 / 14}rem`,
  fontWeight: 600,
  letterSpacing: 0,
  lineHeight: lh(12, 16),
  textTransform: 'uppercase',
});

const h200Styles = css({
  color: token('color.text.lowEmphasis', N200),
  fontSize: `${12 / 14}rem`,
  fontWeight: 600,
  letterSpacing: 0,
  lineHeight: lh(12, 16),
});

const h100Styles = css({
  color: token('color.text.lowEmphasis', N200),
  fontSize: `${11 / 14}rem`,
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
const Heading: FC<HeadingProps> = ({ children, level, id, testId, as }) => {
  if (process.env.NODE_ENV !== 'production' && as && typeof as !== 'string') {
    throw new Error('`as` prop should be a string.');
  }

  const Markup = as || levelMap[level];

  return (
    <Markup
      id={id}
      data-testid={testId}
      css={[headingResetStyles, styleMap[level]]}
    >
      {children}
    </Markup>
  );
};

export default Heading;

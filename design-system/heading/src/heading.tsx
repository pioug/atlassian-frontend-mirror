/** @jsx jsx */
import { FC } from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import { useHeadingElement } from './heading-context';
import type { HeadingProps } from './types';

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
  marginTop: token('spacing.scale.0', '0px'),
  marginBottom: token('spacing.scale.0', '0px'),
  color: token('color.text', '#172B4D'),
});

const h900Styles = css({
  fontSize: '35px',
  fontWeight: 500,
  letterSpacing: '-0.01em',
  lineHeight: '40px',
});

const h800Styles = css({
  fontSize: '29px',
  fontWeight: 600,
  letterSpacing: '-0.01em',
  lineHeight: '32px',
});

const h700Styles = css({
  fontSize: 24,
  fontWeight: 500,
  letterSpacing: '-0.01em',
  lineHeight: '28px',
});

const h600Styles = css({
  fontSize: 20,
  fontWeight: 500,
  letterSpacing: '-0.008em',
  lineHeight: '24px',
});

const h500Styles = css({
  fontSize: 16,
  fontWeight: 600,
  letterSpacing: '-0.006em',
  lineHeight: '20px',
});

const h400Styles = css({
  fontSize: 14,
  fontWeight: 600,
  letterSpacing: '-0.003em',
  lineHeight: '16px',
});

const h300Styles = css({
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 0,
  lineHeight: '16px',
  textTransform: 'uppercase',
});

const h200Styles = css({
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 0,
  lineHeight: '16px',
});

const h100Styles = css({
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: 0,
  lineHeight: '16px',
});

const inverseStyles = css({
  color: token('color.text.inverse', '#FFF'),
});

const subtlestStyles = css({
  color: token('color.text.subtlest', '#6B778C'),
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

  const hLevel = useHeadingElement();
  /**
   * Order here is important, we for now apply
   * 1. user choice
   * 2. inferred a11y level
   * 3. default final fallback
   */
  const Markup = as || (hLevel && `h${hLevel}`) || levelMap[level];
  const isSubtleHeading = level === 'h200' || level === 'h100';

  return (
    <Markup
      id={id}
      data-testid={testId}
      // @ts-ignore
      // Resolved by https://github.com/atlassian-labs/compiled/pull/1321
      css={[
        headingResetStyles,
        // This can be refactored when @compiled supports style maps
        level === 'h100' && h100Styles,
        level === 'h200' && h200Styles,
        level === 'h300' && h300Styles,
        level === 'h400' && h400Styles,
        level === 'h500' && h500Styles,
        level === 'h600' && h600Styles,
        level === 'h700' && h700Styles,
        level === 'h800' && h800Styles,
        level === 'h900' && h900Styles,
        color === 'inverse' && inverseStyles,
        color === 'default' && isSubtleHeading && subtlestStyles,
      ]}
    >
      {children}
    </Markup>
  );
};

export default Heading;

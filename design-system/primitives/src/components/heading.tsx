/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { useHeadingElement } from './heading-context';
import { BasePrimitiveProps } from './types';

export type TypographyLevel = 'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs' | 'xxs';
type HeadingElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';

// https://atlassian.design/foundations/typography
const levelMap = {
  xxl: 'h1',
  xl: 'h2',
  lg: 'h3',
  md: 'h4',
  sm: 'h5',
  xs: 'h6',
  xxs: 'div',
} satisfies Record<TypographyLevel, HeadingElement>;

const headingResetStyles = css({
  color: token('color.text', '#172B4D'),
  letterSpacing: 'normal',
  marginBlock: 0,
  textTransform: 'none',
});

const headingStylesMap = {
  xxl: css({ font: token('font.heading.xxl', 'inherit') }),
  xl: css({ font: token('font.heading.xl', 'inherit') }),
  lg: css({ font: token('font.heading.lg', 'inherit') }),
  md: css({ font: token('font.heading.md', 'inherit') }),
  sm: css({ font: token('font.heading.sm', 'inherit') }),
  xs: css({ font: token('font.heading.xs', 'inherit') }),
  xxs: css({ font: token('font.heading.xxs', 'inherit') }),
} satisfies Record<TypographyLevel, ReturnType<typeof css>>;

const inverseStyles = css({
  color: token('color.text.inverse', '#FFF'),
});

export type HeadingProps = {
  /**
   * The heading text for the element.
   */
  children: React.ReactNode;
  /**
   * The HTML element to render.
   */
  as?: HeadingElement;
  /**
   * The HTML id attribute.
   */
  id?: string;
  /**
   * The level of the heading element.
   */
  level: TypographyLevel;
  /**
   * The color of the heading text.
   */
  color?: 'default' | 'inverse';
} & Pick<BasePrimitiveProps, 'testId'>;

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
 *   <Heading level="xxl">XXL</Heading>
 * );
 * ```
 */
const Heading = ({
  children,
  level,
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
    levelMap[level];

  return (
    <Markup
      id={id}
      data-testid={testId}
      role={Markup === 'div' ? 'heading' : undefined}
      css={[
        headingResetStyles,
        level && headingStylesMap[level],
        color === 'inverse' && inverseStyles,
      ]}
    >
      {children}
    </Markup>
  );
};

export default Heading;

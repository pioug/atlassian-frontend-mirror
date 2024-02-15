/** @jsx jsx */
import {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  forwardRef,
  ReactElement,
  ReactNode,
} from 'react';

import { css, jsx } from '@emotion/react';

import {
  BackgroundColor,
  backgroundColorStylesMap,
  isSurfaceColorToken,
  paddingStylesMap,
  type Space,
  surfaceColorStylesMap,
} from '../xcss/style-maps.partial';
import { parseXcss } from '../xcss/xcss';

import { SurfaceContext } from './internal/surface-provider';
import { SVGElements } from './internal/types';
import type { BasePrimitiveProps, StyleProp } from './types';

// Can either Exclude or Extract - here we're excluding all SVG-related elements
type AllowedElements = Exclude<keyof JSX.IntrinsicElements, SVGElements>;

// Basically just ElementType but without ComponentType, it makes sense to keep the "Type" suffix
// eslint-disable-next-line @repo/internal/react/consistent-types-definitions
type CustomElementType<P = any> = {
  [K in AllowedElements]: P extends JSX.IntrinsicElements[K] ? K : never;
}[AllowedElements];

export type BoxProps<T extends CustomElementType> = Omit<
  ComponentPropsWithoutRef<T>,
  'as' | 'className'
> &
  BasePrimitiveProps &
  StyleProp &
  BaseBoxProps<T>;

type BaseBoxProps<T extends CustomElementType> = {
  /**
   * The DOM element to render as the Box. Defaults to `div`.
   */
  as?: T;
  /**
   * Elements to be rendered inside the Box.
   */
  children?: ReactNode;
  /**
   * Token representing background color with a built-in fallback value.
   */
  backgroundColor?: BackgroundColor;
  /**
   * Tokens representing CSS shorthand for `paddingBlock` and `paddingInline` together.
   *
   * @see paddingBlock
   * @see paddingInline
   */
  padding?: Space;
  /**
   * Tokens representing CSS shorthand `paddingBlock`.
   *
   * @see paddingBlockStart
   * @see paddingBlockEnd
   */
  paddingBlock?: Space;
  /**
   * Tokens representing CSS `paddingBlockStart`.
   */
  paddingBlockStart?: Space;
  /**
   * Tokens representing CSS `paddingBlockEnd`.
   */
  paddingBlockEnd?: Space;
  /**
   * Tokens representing CSS shorthand `paddingInline`.
   *
   * @see paddingInlineStart
   * @see paddingInlineEnd
   */
  paddingInline?: Space;
  /**
   * Tokens representing CSS `paddingInlineStart`.
   */
  paddingInlineStart?: Space;
  /**
   * Tokens representing CSS `paddingInlineEnd`.
   */
  paddingInlineEnd?: Space;
  /**
   * Forwarded ref.
   */
  ref?: ComponentPropsWithRef<T>['ref'];
};

type BoxComponent = <T extends CustomElementType>(
  props: BoxProps<T>,
) => ReactElement | null;

/**
 * __Box__
 *
 * A Box is a primitive component that has the design decisions of the Atlassian Design System baked in.
 * Renders a `div` by default.
 *
 * - [Examples](https://atlassian.design/components/primitives/box/examples)
 * - [Code](https://atlassian.design/components/primitives/box/code)
 * - [Usage](https://atlassian.design/components/primitives/box/usage)
 */
export const Box: BoxComponent = forwardRef(
  <T extends CustomElementType>(
    {
      as = 'div' as T,
      children,
      backgroundColor,
      padding,
      paddingBlock,
      paddingBlockStart,
      paddingBlockEnd,
      paddingInline,
      paddingInlineStart,
      paddingInlineEnd,
      style,
      testId,
      xcss,
      ...htmlAttributes
    }: BoxProps<T>,
    ref: BoxProps<T>['ref'],
  ) => {
    const Component = as;
    // This is to remove className from safeHtmlAttributes
    // @ts-expect-error className doesn't exist in the prop definition but we want to ensure it cannot be applied even if types are bypassed
    const { className: _spreadClass, ...safeHtmlAttributes } = htmlAttributes;
    const className = xcss && parseXcss(xcss);

    const node = (
      // @ts-expect-error Expression produces a union type that is too complex to represent. I think this is unavoidable
      <Component
        style={style}
        // @ts-expect-error Expression produces a union type that is too complex to represent. We may be able to narrow the type here but unsure.
        ref={ref}
        // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
        {...safeHtmlAttributes}
        css={[
          baseStyles,
          backgroundColor && backgroundColorStylesMap[backgroundColor],
          isSurfaceColorToken(backgroundColor) &&
            surfaceColorStylesMap[backgroundColor],
          padding && paddingStylesMap.padding[padding],
          paddingBlock && paddingStylesMap.paddingBlock[paddingBlock],
          paddingBlockStart &&
            paddingStylesMap.paddingBlockStart[paddingBlockStart],
          paddingBlockEnd && paddingStylesMap.paddingBlockEnd[paddingBlockEnd],
          paddingInline && paddingStylesMap.paddingInline[paddingInline],
          paddingInlineStart &&
            paddingStylesMap.paddingInlineStart[paddingInlineStart],
          paddingInlineEnd &&
            paddingStylesMap.paddingInlineEnd[paddingInlineEnd],
          // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
          className,
        ]}
        data-testid={testId}
      >
        {children}
      </Component>
    );

    return backgroundColor ? (
      <SurfaceContext.Provider value={backgroundColor}>
        {node}
      </SurfaceContext.Provider>
    ) : (
      node
    );
  },
);

export default Box;

const baseStyles = css({
  boxSizing: 'border-box',
  appearance: 'none',
  border: 'none',
});

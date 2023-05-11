/* eslint-disable @repo/internal/styles/no-exported-styles */
/** @jsx jsx */
import {
  ComponentPropsWithoutRef,
  ElementType,
  FC,
  forwardRef,
  ReactElement,
  ReactNode,
} from 'react';

import { css, jsx } from '@emotion/react';

import {
  BackgroundColor,
  backgroundColorStylesMap,
  paddingStylesMap,
  type Space,
} from '../../xcss/style-maps.partial';
import type { BasePrimitiveProps } from '../types';

export type BaseBoxProps<T extends ElementType = 'div'> = Omit<
  ComponentPropsWithoutRef<T>,
  'as' | 'className'
> &
  BasePrimitiveProps &
  BaseBoxPropsFoundation<T>;

export type As =
  | 'article'
  | 'aside'
  | 'dialog'
  | 'div'
  | 'footer'
  | 'header'
  | 'li'
  | 'main'
  | 'nav'
  | 'ol'
  | 'section'
  | 'span'
  | 'ul';

type BaseBoxPropsFoundation<T extends ElementType = 'div'> = {
  /**
   * The DOM element to render as the Box. Defaults to `div`.
   */
  as?: As;
  /**
   * The HTML className attribute.
   *
   * Before using this prop please ensure:
   * - The styles cannot otherwise be achieved through `Box` directly.
   * - The use case needs custom styles that cannot be designed or implemented differently
   *
   * Ensure you're using the `@atlaskit/eslint-plugin-design-system` with this prop to prevent unbounded usage.
   *
   * @see `@atlaskit/eslint-plugin-design-system`
   */
  className?: string;
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
   * Forwarded ref element
   */
  ref?: React.ComponentPropsWithRef<T>['ref'];
};

// Without this type annotation on Box we don't get autocomplete for props due to forwardRef types
export type BaseBoxComponent<T extends ElementType = 'div'> = (<
  T extends ElementType = 'div',
>(
  props: BaseBoxProps<T>,
) => ReactElement | null) &
  FC<BaseBoxProps<T>>;

/**
 * __Box__
 *
 * Box is a primitive component that has the design decisions of the Atlassian Design System baked in.
 * Renders a `div` by default.
 *
 * @internal
 */
export const BaseBox: BaseBoxComponent = forwardRef(
  <T extends ElementType = 'div'>(
    {
      as,
      className,
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
      ...htmlAttributes
    }: BaseBoxProps<T>,
    ref?: React.ComponentPropsWithRef<T>['ref'],
  ) => {
    const Component = as || 'div';

    const node = (
      <Component
        style={style}
        ref={ref}
        // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
        {...htmlAttributes}
        className={className}
        css={[
          baseStyles,
          backgroundColor && backgroundColorStylesMap[backgroundColor],
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
        ]}
        data-testid={testId}
      >
        {children}
      </Component>
    );

    return node;
  },
);

BaseBox.displayName = 'BaseBox';

export default BaseBox;

const baseStyles = css({
  boxSizing: 'border-box',
  appearance: 'none',
  border: 'none',
});

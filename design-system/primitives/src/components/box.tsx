/** @jsx jsx */
import {
  ComponentPropsWithRef,
  ElementType,
  FC,
  forwardRef,
  ReactElement,
} from 'react';

import { jsx } from '@emotion/react';

import { parseXcss } from '../internal/xcss';

import { BaseBox, BaseBoxProps } from './internal/base-box.partial';
import type { BoxResponsiveProp } from './internal/types';
import type { PublicBoxPropsBase } from './types';

export type BoxProps<T extends ElementType = 'div'> = Omit<
  BaseBoxProps<T>,
  | 'className'
  // Omit all responsive props until they are ready for prime time
  | BoxResponsiveProp
> &
  PublicBoxPropsBase;

type BoxComponent<T extends ElementType = 'div'> = (<
  T extends ElementType = 'div',
>(
  props: BoxProps<T>,
) => ReactElement | null) &
  FC<BoxProps<T>>;

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
const Box: BoxComponent = forwardRef(
  <T extends ElementType = 'div'>(
    {
      as,
      children,
      color,
      backgroundColor,
      shadow,
      borderStyle,
      borderWidth,
      borderRadius,
      borderColor,
      layer,
      flex,
      flexGrow,
      flexShrink,
      alignSelf,
      overflow,
      overflowInline,
      overflowBlock,
      padding,
      paddingBlock,
      paddingBlockStart,
      paddingBlockEnd,
      paddingInline,
      paddingInlineStart,
      paddingInlineEnd,
      height,
      width,
      display = 'block',
      position = 'static',
      style,
      testId,
      xcss,
      ...htmlAttributes
    }: BoxProps<T>,
    ref?: ComponentPropsWithRef<T>['ref'],
  ) => {
    const { className: spreadClass, ...safeHtmlAttributes } = htmlAttributes;
    const className = xcss && parseXcss(xcss);
    return (
      <BaseBox
        as={as}
        color={color}
        backgroundColor={backgroundColor}
        shadow={shadow}
        borderStyle={borderStyle}
        borderWidth={borderWidth}
        borderRadius={borderRadius}
        borderColor={borderColor}
        layer={layer}
        flex={flex}
        flexGrow={flexGrow}
        flexShrink={flexShrink}
        alignSelf={alignSelf}
        overflow={overflow}
        overflowInline={overflowInline}
        overflowBlock={overflowBlock}
        padding={padding}
        paddingBlock={paddingBlock}
        paddingBlockStart={paddingBlockStart}
        paddingBlockEnd={paddingBlockEnd}
        paddingInline={paddingInline}
        paddingInlineStart={paddingInlineStart}
        paddingInlineEnd={paddingInlineEnd}
        height={height}
        width={width}
        display={display}
        position={position}
        style={style}
        testId={testId}
        ref={ref}
        // eslint-disable-next-line @repo/internal/react/consistent-css-prop-usage
        css={className}
        {...safeHtmlAttributes}
      >
        {children}
      </BaseBox>
    );
  },
);

Box.displayName = 'Box';

export default Box;

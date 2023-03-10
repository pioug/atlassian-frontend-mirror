import React, {
  ComponentPropsWithRef,
  ElementType,
  FC,
  forwardRef,
  ReactElement,
} from 'react';

import { BaseBox, BaseBoxProps } from './internal/base-box.partial';
import { BoxResponsiveProp } from './internal/types';
import { PublicBoxPropsBase } from './types';

export type BoxProps<T extends ElementType = 'div'> = Omit<
  BaseBoxProps<T>,
  | 'className'
  | 'UNSAFE_style'
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

// TODO: Fill in the component {description} and ensure links point to the correct {packageName} location.
// Remove links that the component does not have (such as usage). If there are no links remove them all.
/**
 * __Box__
 *
 * A box {description}.
 *
 * - [Examples](https://atlassian.design/components/{packageName}/examples)
 * - [Code](https://atlassian.design/components/{packageName}/code)
 * - [Usage](https://atlassian.design/components/{packageName}/usage)
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
      customStyles,
      testId,
      ...htmlAttributes
    }: BoxProps<T>,
    ref?: ComponentPropsWithRef<T>['ref'],
  ) => {
    const { style, className, ...safeHtmlAttributes } = htmlAttributes;
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
        UNSAFE_style={customStyles}
        testId={testId}
        ref={ref}
        {...safeHtmlAttributes}
      >
        {children}
      </BaseBox>
    );
  },
);

export default Box;

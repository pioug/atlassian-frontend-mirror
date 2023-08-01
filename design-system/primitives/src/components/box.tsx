/** @jsx jsx */
import {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ElementType,
  FC,
  forwardRef,
  ReactElement,
} from 'react';

import { jsx } from '@emotion/react';

import { parseXcss } from '../xcss/xcss';

import { BaseBox, BaseBoxPropsFoundation } from './internal/base-box';
import { BasePrimitiveProps } from './types';

// Ideally we'd just Omit className from BaseBoxProps however that isn't working as expected
// So, we're reconstructing the type: this should be the same as BaseBoxProps minus className
// TODO: Merge Box and BaseBox so there is only one component. There's probably no need for BaseBox anymore.
export type BoxProps<T extends ElementType> = Omit<
  ComponentPropsWithoutRef<T>,
  'as' | 'className'
> &
  BasePrimitiveProps &
  BaseBoxPropsFoundation<T>;

type BoxComponent<T extends ElementType = 'div'> = (<T extends ElementType>(
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
    ref?: ComponentPropsWithRef<T>['ref'],
  ) => {
    // This is to remove className from safeHtmlAttributes
    const { className: _spreadClass, ...safeHtmlAttributes } = htmlAttributes;
    const className = xcss && parseXcss(xcss);
    return (
      <BaseBox
        as={as}
        backgroundColor={backgroundColor}
        padding={padding}
        paddingBlock={paddingBlock}
        paddingBlockStart={paddingBlockStart}
        paddingBlockEnd={paddingBlockEnd}
        paddingInline={paddingInline}
        paddingInlineStart={paddingInlineStart}
        paddingInlineEnd={paddingInlineEnd}
        style={style}
        testId={testId}
        ref={ref}
        // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
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

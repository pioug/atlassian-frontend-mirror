import React, {
  type ComponentPropsWithRef,
  forwardRef,
  type ReactElement,
  type ReactNode,
} from 'react';

import { type XCSS, xcss } from '../xcss/xcss';

import Box, { type BoxProps } from './box';

export type PressableProps = Omit<
  BoxProps<'button'>,
  // Handled by `isDisabled`
  | 'disabled'
  // Should not allow custom elements
  | 'as'
  | 'children'
  // There is no reason the default role of `button` should
  // be overwritten.
  | 'role'
  | 'style'
> & {
  /**
   * `children` should be defined to ensure buttons are not empty,
   * because they should have labels.
   */
  children: ReactNode;
  isDisabled?: boolean;
};

type PressableComponent = (
  props: PressableProps,
  displayName: string,
) => ReactElement | null;

// TODO: Duplicated FocusRing styles due to lack of `xcss` support
// and to prevent additional dependency
const baseFocusRingStyles = {
  outlineColor: 'color.border.focused',
  outlineWidth: 'border.width.outline',
  outlineStyle: 'solid',
  outlineOffset: 'space.025',
} as const;

const focusRingStyles = xcss({
  ':focus-visible': baseFocusRingStyles,

  '@supports not selector(*:focus-visible)': {
    ':focus': baseFocusRingStyles,
  },

  '@media screen and (forced-colors: active), screen and (-ms-high-contrast: active)':
    {
      ':focus-visible': {
        outline: '1px solid',
      },
    },
});

/**
 * __UNSAFE_PRESSABLE__
 *
 * @internal Still under development. Do not use.
 *
 * A Pressable is a primitive component that renders a `<button>`.
 *
 * - [Examples](https://atlassian.design/components/primitives/pressable/examples)
 * - [Code](https://atlassian.design/components/primitives/pressable/code)
 * - [Usage](https://atlassian.design/components/primitives/pressable/usage)
 */
const UNSAFE_PRESSABLE: PressableComponent = forwardRef(
  (
    {
      children,
      backgroundColor,
      padding,
      paddingBlock,
      paddingBlockStart,
      paddingBlockEnd,
      paddingInline,
      paddingInlineStart,
      paddingInlineEnd,
      isDisabled,
      type = 'button',
      testId,
      xcss: xcssStyles,
      ...htmlAttributes
    }: PressableProps,
    ref?: ComponentPropsWithRef<'button'>['ref'],
  ) => {
    // Combine default styles with supplied styles. XCSS does not support deep nested arrays
    let styles: XCSS | Array<XCSS | false | undefined> = [
      xcss({ cursor: isDisabled ? 'not-allowed' : 'pointer' }),
      focusRingStyles,
    ];
    styles = Array.isArray(xcssStyles)
      ? [...styles, ...xcssStyles]
      : [...styles, xcssStyles];

    return (
      <Box
        {...htmlAttributes}
        as="button"
        ref={ref}
        testId={testId}
        type={type}
        backgroundColor={backgroundColor}
        padding={padding}
        paddingBlock={paddingBlock}
        paddingBlockStart={paddingBlockStart}
        paddingBlockEnd={paddingBlockEnd}
        paddingInline={paddingInline}
        paddingInlineStart={paddingInlineStart}
        paddingInlineEnd={paddingInlineEnd}
        // eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
        xcss={styles}
        disabled={isDisabled}
      >
        {children}
      </Box>
    );
  },
);

export default UNSAFE_PRESSABLE;

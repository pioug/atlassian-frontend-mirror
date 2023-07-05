/** @jsx jsx */
import {
  type ComponentPropsWithRef,
  forwardRef,
  type ReactElement,
  type ReactNode,
} from 'react';

import { css, jsx } from '@emotion/react';

import FocusRing from '@atlaskit/focus-ring';

import BaseBox, { type BaseBoxProps } from './internal/base-box';

export type PressableProps = Omit<
  BaseBoxProps<'button'>,
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

const defaultStyles = css({
  cursor: 'pointer',
});

/**
 * __Pressable__
 *
 * A Pressable is a primitive component that renders a `<button>`.
 *
 * - [Examples](https://atlassian.design/components/primitives/pressable/examples)
 * - [Code](https://atlassian.design/components/primitives/pressable/code)
 * - [Usage](https://atlassian.design/components/primitives/pressable/usage)
 */
const Pressable: PressableComponent = forwardRef(
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
      ...htmlAttributes
    }: PressableProps,
    ref?: ComponentPropsWithRef<'button'>['ref'],
  ) => {
    return (
      <FocusRing>
        <BaseBox<'button'>
          {...htmlAttributes}
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
          as="button"
          css={defaultStyles}
          disabled={isDisabled}
        >
          {children}
        </BaseBox>
      </FocusRing>
    );
  },
);

export default Pressable;

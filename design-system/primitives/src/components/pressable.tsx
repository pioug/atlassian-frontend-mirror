import React, {
  type ComponentPropsWithRef,
  forwardRef,
  type ReactNode,
  useCallback,
  useContext,
} from 'react';

import {
  UIAnalyticsEvent,
  usePlatformLeafEventHandler,
} from '@atlaskit/analytics-next';
import noop from '@atlaskit/ds-lib/noop';
import InteractionContext, {
  type InteractionContextType,
} from '@atlaskit/interaction-context';

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
  | 'onClick'
> & {
  /**
   * `children` should be defined to ensure buttons are not empty,
   * because they should have labels.
   */
  children: ReactNode;
  isDisabled?: boolean;
  /**
   * Handler to be called on click. The second argument can be used to track analytics data. See the tutorial in the analytics-next package for details.
   */
  onClick?: (
    e: React.MouseEvent<HTMLButtonElement>,
    analyticsEvent: UIAnalyticsEvent,
  ) => void;
  /**
   * An optional name used to identify the interaction type to press listeners. For example, interaction tracing. For more information,
   * see [UFO integration into Design System components](https://go.atlassian.com/react-ufo-dst-integration).
   */
  interactionName?: string;
  /**
   * An optional component name used to identify this component to press listeners. This can be used if a parent component's name is preferred. For example, interaction tracing. For more information,
   * see [UFO integration into Design System components](https://go.atlassian.com/react-ufo-dst-integration).
   */
  componentName?: string;
  /**
   * Additional information to be included in the `context` of analytics events that come from pressable.
   */
  analyticsContext?: Record<string, any>;
};

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
const UNSAFE_PRESSABLE = forwardRef(
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
      onClick: providedOnClick = noop,
      interactionName,
      componentName,
      analyticsContext,
      ...htmlAttributes
    }: PressableProps,
    ref?: ComponentPropsWithRef<'button'>['ref'],
  ) => {
    const interactionContext = useContext<InteractionContextType | null>(
      InteractionContext,
    );
    const handleClick = useCallback(
      (
        e: React.MouseEvent<HTMLButtonElement>,
        analyticsEvent: UIAnalyticsEvent,
      ) => {
        interactionContext &&
          interactionContext.tracePress(interactionName, e.timeStamp);
        providedOnClick(e, analyticsEvent);
      },
      [providedOnClick, interactionContext, interactionName],
    );

    const onClick = usePlatformLeafEventHandler({
      fn: handleClick,
      action: 'clicked',
      componentName: componentName || 'Pressable',
      packageName: process.env._PACKAGE_NAME_ as string,
      packageVersion: process.env._PACKAGE_VERSION_ as string,
      analyticsData: analyticsContext,
      actionSubject: 'button',
    });

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
        onClick={onClick}
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

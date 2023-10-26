import React, {
  type ComponentPropsWithRef,
  forwardRef,
  type ReactElement,
  type ReactNode,
} from 'react';

import {
  type RouterLinkComponentProps,
  useRouterLink,
} from '@atlaskit/app-provider';

import { type XCSS, xcss } from '../xcss/xcss';

import Box, { type BoxProps } from './box';

export type LinkProps<LinkConfig extends {} = {}> =
  RouterLinkComponentProps<LinkConfig> &
    Omit<
      BoxProps<'a'>,
      // Should not allow custom elements
      'as' | 'children' | 'style'
    > & {
      /**
       * `children` should be defined to ensure links have text
       */
      children: ReactNode;
    };

type LinkComponent = (
  props: LinkProps,
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

const IS_EXTERNAL_LINK_REGEX = /^(?:(http|https):\/\/)/;
const IS_NON_HTTP_BASED = /^(((mailto|tel|sms):)|(#))/;

/**
 * __UNSAFE_LINK__
 *
 * @internal Still under development. Do not use.
 *
 * A Link is a primitive component that renders a `<a>` anchor. It utilizes
 * the configured link component in the AppProvider if set.
 *
 * - [Examples](https://atlassian.design/components/primitives/link/examples)
 * - [Code](https://atlassian.design/components/primitives/link/code)
 * - [Usage](https://atlassian.design/components/primitives/link/usage)
 */
const UNSAFE_LINK: LinkComponent = forwardRef(
  (
    {
      href,
      children,
      backgroundColor,
      padding,
      paddingBlock,
      paddingBlockStart,
      paddingBlockEnd,
      paddingInline,
      paddingInlineStart,
      paddingInlineEnd,
      testId,
      xcss: xcssStyles,
      target,
      rel,
      ...htmlAttributes
    }: LinkProps,
    ref?: ComponentPropsWithRef<'a'>['ref'],
  ) => {
    const RouterLink = useRouterLink();

    // Combine default styles with supplied styles. XCSS does not support deep nested arrays
    const styles: XCSS | Array<XCSS | false | undefined> = Array.isArray(
      xcssStyles,
    )
      ? [focusRingStyles, ...xcssStyles]
      : [focusRingStyles, xcssStyles];

    const isExternal =
      typeof href === 'string' && IS_EXTERNAL_LINK_REGEX.test(href);
    const isNonHttpBased =
      typeof href === 'string' && IS_NON_HTTP_BASED.test(href);

    /**
     * Renders a router link if:
     * - a link component is set in the app provider
     * - it's not an external link (starting with http:// or https://)
     * - it's not a non-HTTP-based link (e.g. emails, phone numbers, hash links etc.)
     */
    const isRouterLink = RouterLink && !isExternal && !isNonHttpBased;

    return (
      <Box
        {...htmlAttributes}
        // TODO: Box doesn't allow `as` components
        // @ts-expect-error
        as={isRouterLink ? RouterLink : 'a'}
        ref={ref}
        testId={testId}
        data-is-router-link={
          testId ? (isRouterLink ? 'true' : 'false') : undefined
        }
        href={typeof href === 'string' ? href : undefined}
        target={isExternal && target === undefined ? '_blank' : target}
        rel={isExternal && rel === undefined ? 'noopener noreferrer' : rel}
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
      >
        {children}
      </Box>
    );
  },
);

export default UNSAFE_LINK;

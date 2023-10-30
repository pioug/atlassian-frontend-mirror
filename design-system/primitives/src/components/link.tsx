import React, { forwardRef, type ReactNode, type Ref } from 'react';

import invariant from 'tiny-invariant';

import {
  type RouterLinkComponentProps,
  useRouterLink,
} from '@atlaskit/app-provider';

import { type XCSS, xcss } from '../xcss/xcss';

import Box, { type BoxProps } from './box';

export type LinkProps<RouterLinkConfig extends Record<string, any> = never> =
  RouterLinkComponentProps<RouterLinkConfig> &
    Omit<
      BoxProps<'a'>,
      | 'href'
      // Should not allow custom elements
      | 'as'
      | 'children'
      | 'style'
    > & {
      /**
       * `children` should be defined to ensure links have text
       */
      children: ReactNode;
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

const IS_EXTERNAL_LINK_REGEX = /^(?:(http|https):\/\/)/;
const IS_NON_HTTP_BASED = /^(((mailto|tel|sms):)|(#))/;

const Link = <RouterLinkConfig extends Record<string, any> = never>(
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
  }: LinkProps<RouterLinkConfig>,
  ref: Ref<HTMLAnchorElement>,
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

  const hrefObjectUsedWithoutRouterLink =
    RouterLink === undefined && typeof href === 'object';

  invariant(
    !hrefObjectUsedWithoutRouterLink,
    `@atlaskit/primitives: Link primitive cannot pass an object to 'href' unless a router link is configured in the AppProvider`,
  );

  return (
    <Box
      // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
      {...htmlAttributes}
      // @ts-expect-error (TODO: Box doesn't allow `as` components)
      as={isRouterLink ? RouterLink : 'a'}
      ref={ref}
      testId={testId}
      data-is-router-link={
        testId ? (isRouterLink ? 'true' : 'false') : undefined
      }
      href={!isRouterLink && typeof href !== 'string' ? undefined : href}
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
};

// Workarounds to support generic types with forwardRef
/**
 * __UNSAFE_LINK__
 *
 * @internal Still under development. Do not use.
 *
 * A Link is a primitive component that renders an `<a>` anchor. It utilizes
 * the configured router link component in the AppProvider if set.
 *
 * - [Examples](https://atlassian.design/components/primitives/link/examples)
 * - [Code](https://atlassian.design/components/primitives/link/code)
 * - [Usage](https://atlassian.design/components/primitives/link/usage)
 */
const UNSAFE_LINK = forwardRef(Link) as <
  RouterLinkConfig extends Record<string, any> = never,
>(
  props: LinkProps<RouterLinkConfig> & {
    ref?: Ref<HTMLAnchorElement>;
  },
) => ReturnType<typeof Link>;

export default UNSAFE_LINK;

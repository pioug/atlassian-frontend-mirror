import React, {
  forwardRef,
  type ReactNode,
  type Ref,
  useCallback,
  useContext,
} from 'react';

import invariant from 'tiny-invariant';

import {
  UIAnalyticsEvent,
  usePlatformLeafEventHandler,
} from '@atlaskit/analytics-next';
import {
  type RouterLinkComponentProps,
  useRouterLink,
} from '@atlaskit/app-provider';
import noop from '@atlaskit/ds-lib/noop';
import InteractionContext, {
  type InteractionContextType,
} from '@atlaskit/interaction-context';

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
      | 'onClick'
    > & {
      /**
       * `children` should be defined to ensure links have text.
       */
      children: ReactNode;
      /**
       * Handler to be called on click. The second argument can be used to track analytics data. See the tutorial in the analytics-next package for details.
       */
      onClick?: (
        e: React.MouseEvent<HTMLAnchorElement>,
        // TODO: Make analyticsEvent required once `@atlaskit/button` is bumped to use the latest version of primitives
        analyticsEvent?: UIAnalyticsEvent,
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
       * Additional information to be included in the `context` of analytics events that come from anchor.
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
    onClick: providedOnClick = noop,
    interactionName,
    componentName,
    analyticsContext,
    ...htmlAttributes
  }: LinkProps<RouterLinkConfig>,
  ref: Ref<HTMLAnchorElement>,
) => {
  const interactionContext = useContext<InteractionContextType | null>(
    InteractionContext,
  );
  const handleClick = useCallback(
    (
      e: React.MouseEvent<HTMLAnchorElement>,
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
    componentName: componentName || 'Anchor',
    packageName: process.env._PACKAGE_NAME_ as string,
    packageVersion: process.env._PACKAGE_VERSION_ as string,
    analyticsData: analyticsContext,
    actionSubject: 'link',
  });

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
   *
   * - a link component is set in the app provider
   * - it's not an external link (starting with `http://` or `https://`)
   * - it's not a non-HTTP-based link (e.g. Emails, phone numbers, hash links etc.).
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
      // TODO: This only tracks events if componentName is supplied, which makes tracking opt-in during
      // the transition period. This will be removed once `@atlaskit/button` is bumped to use the latest
      // version of primitives
      onClick={componentName ? onClick : providedOnClick}
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
 * Link is a primitive for building custom anchor links. It's a wrapper around the HTML `<a>` element that provides a consistent API for handling client-side routing and Atlassian Design System styling.
 *
 * This component is mostly used by other design system components, such as the [link component](/components/link/usage).
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

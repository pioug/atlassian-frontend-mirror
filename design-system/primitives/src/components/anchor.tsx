import React, { forwardRef, type Ref, useCallback, useContext } from 'react';

import { uid } from 'react-uid';
import invariant from 'tiny-invariant';

import { type UIAnalyticsEvent, usePlatformLeafEventHandler } from '@atlaskit/analytics-next';
import { type RouterLinkComponentProps, useRouterLink } from '@atlaskit/app-provider';
import noop from '@atlaskit/ds-lib/noop';
import InteractionContext, { type InteractionContextType } from '@atlaskit/interaction-context';
import VisuallyHidden from '@atlaskit/visually-hidden';

import { type XCSS, xcss } from '../xcss/xcss';

import Box, { type BoxProps } from './box';

export type AnchorProps<RouterLinkConfig extends Record<string, any> = never> =
	RouterLinkComponentProps<RouterLinkConfig> &
		Omit<
			BoxProps<'a'>,
			| 'href'
			// Should not allow custom elements
			| 'as'
			| 'style'
			| 'onClick'
		> & {
			/**
			 * Handler called on click. The second argument can be used to track analytics data. See the tutorial in the analytics-next package for details.
			 */
			onClick?: (e: React.MouseEvent<HTMLAnchorElement>, analyticsEvent: UIAnalyticsEvent) => void;
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

const defaultStyles = xcss({
	textDecoration: 'underline',
});

const focusRingStyles = xcss({
	// Focus styles used when :focus-visible isn't supported
	':focus': baseFocusRingStyles,

	// Remove default focus styles for mouse interactions if :focus-visible is supported
	':focus:not(:focus-visible)': {
		outline: 'none',
	},

	':focus-visible': baseFocusRingStyles,

	'@media screen and (forced-colors: active), screen and (-ms-high-contrast: active)': {
		':focus-visible': {
			outline: '1px solid',
		},
	},
});

const IS_EXTERNAL_LINK_REGEX = /^(?:(http|https):\/\/)/;
const IS_NON_HTTP_BASED = /^(((mailto|tel|sms):)|(#))/;
const OPENS_NEW_WINDOW_LABEL = '(opens new window)';

const AnchorNoRef = <RouterLinkConfig extends Record<string, any> = never>(
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
		onClick: providedOnClick = noop,
		interactionName,
		componentName,
		analyticsContext,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledBy,
		...htmlAttributes
	}: AnchorProps<RouterLinkConfig>,
	ref: Ref<HTMLAnchorElement>,
) => {
	const interactionContext = useContext<InteractionContextType | null>(InteractionContext);
	const handleClick = useCallback(
		(e: React.MouseEvent<HTMLAnchorElement>, analyticsEvent: UIAnalyticsEvent) => {
			interactionContext && interactionContext.tracePress(interactionName, e.timeStamp);
			providedOnClick(e, analyticsEvent);
		},
		[providedOnClick, interactionContext, interactionName],
	);
	// TODO: Use React 18's useId() hook when we update.
	// eslint-disable-next-line @repo/internal/react/disallow-unstable-values
	const opensNewWindowLabelId = uid({ ariaLabelledBy });

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

	// We're type coercing this as Compiled styles in an array isn't supported by the types
	// But the runtime accepts it none-the-wiser. We can remove this entire block and replace
	// it with cx(defaultStyles, focusRingStyles, xcssStyles) when we've moved away from Emotion.
	const styles = (
		Array.isArray(xcssStyles)
			? [defaultStyles, focusRingStyles, ...xcssStyles]
			: [defaultStyles, focusRingStyles, xcssStyles]
	) as XCSS[];

	const isExternal = typeof href === 'string' && IS_EXTERNAL_LINK_REGEX.test(href);
	const isNonHttpBased = typeof href === 'string' && IS_NON_HTTP_BASED.test(href);

	/**
	 * Renders a router link if:
	 *
	 * - a link component is set in the app provider
	 * - it's not an external link (starting with `http://` or `https://`)
	 * - it's not a non-HTTP-based link (e.g. emails, phone numbers, hash links etc.).
	 */
	const isRouterLink = RouterLink && !isExternal && !isNonHttpBased;

	const hrefObjectUsedWithoutRouterLink = RouterLink === undefined && typeof href === 'object';

	invariant(
		!hrefObjectUsedWithoutRouterLink,
		`@atlaskit/primitives: Anchor primitive cannot pass an object to 'href' unless a router link is configured in the AppProvider`,
	);

	return (
		<Box
			// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
			{...htmlAttributes}
			// @ts-expect-error (TODO: Box doesn't allow `as` components)
			as={isRouterLink ? RouterLink : 'a'}
			ref={ref}
			testId={testId}
			data-is-router-link={testId ? (isRouterLink ? 'true' : 'false') : undefined}
			href={!isRouterLink && typeof href !== 'string' ? undefined : href}
			target={target}
			backgroundColor={backgroundColor}
			padding={padding}
			paddingBlock={paddingBlock}
			paddingBlockStart={paddingBlockStart}
			paddingBlockEnd={paddingBlockEnd}
			paddingInline={paddingInline}
			paddingInlineStart={paddingInlineStart}
			paddingInlineEnd={paddingInlineEnd}
			onClick={onClick}
			aria-label={
				ariaLabel && target === '_blank' && !ariaLabelledBy
					? `${ariaLabel} ${OPENS_NEW_WINDOW_LABEL}`
					: ariaLabel
			}
			aria-labelledby={
				ariaLabelledBy && target === '_blank'
					? `${ariaLabelledBy} ${opensNewWindowLabelId}`
					: ariaLabelledBy
			}
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
			xcss={styles}
		>
			{children}
			{target === '_blank' && ((children && !ariaLabel && !ariaLabelledBy) || ariaLabelledBy) && (
				<VisuallyHidden id={opensNewWindowLabelId}>{OPENS_NEW_WINDOW_LABEL}</VisuallyHidden>
			)}
		</Box>
	);
};

// Workarounds to support generic types with forwardRef
/**
 * __Anchor__
 *
 * @internal Still under development. Do not use.
 *
 * Anchor is a primitive for building custom anchor links. It's a wrapper around the HTML `<a>` element that provides a consistent API for handling client-side routing and Atlassian Design System styling.
 *
 * This component is mostly used by other design system components, such as the [link component](/components/link/usage).
 *
 * - [Examples](https://atlassian.design/components/primitives/anchor/examples)
 * - [Code](https://atlassian.design/components/primitives/anchor/code)
 * - [Usage](https://atlassian.design/components/primitives/anchor/usage)
 */
const Anchor = forwardRef(AnchorNoRef) as <RouterLinkConfig extends Record<string, any> = never>(
	props: AnchorProps<RouterLinkConfig> & {
		ref?: Ref<HTMLAnchorElement>;
	},
) => ReturnType<typeof AnchorNoRef>;

export default Anchor;

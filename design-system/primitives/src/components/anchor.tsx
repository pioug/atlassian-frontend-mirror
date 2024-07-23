/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	type ComponentPropsWithoutRef,
	forwardRef,
	type ReactNode,
	type Ref,
	useCallback,
	useContext,
} from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { uid } from 'react-uid';
import invariant from 'tiny-invariant';

import { type UIAnalyticsEvent, usePlatformLeafEventHandler } from '@atlaskit/analytics-next';
import { type RouterLinkComponentProps, useRouterLink } from '@atlaskit/app-provider';
import noop from '@atlaskit/ds-lib/noop';
import InteractionContext, { type InteractionContextType } from '@atlaskit/interaction-context';
import VisuallyHidden from '@atlaskit/visually-hidden';

import {
	type BackgroundColor,
	backgroundColorStylesMap,
	borderColorMap,
	borderWidthMap,
	paddingStylesMap,
	positiveSpaceMap,
	type Space,
} from '../xcss/style-maps.partial';
import { parseXcss } from '../xcss/xcss';

import type { BasePrimitiveProps, StyleProp } from './types';

type BaseAnchorProps = {
	/**
	 * Elements to be rendered inside the Anchor.
	 */
	children?: ReactNode;
	/**
	 * Handler called on click. The second argument provides an Atlaskit UI analytics event that can be fired to a listening channel. See the ['analytics-next' package](https://atlaskit.atlassian.com/packages/analytics/analytics-next) documentation for more information.
	 */
	onClick?: (e: React.MouseEvent<HTMLAnchorElement>, analyticsEvent: UIAnalyticsEvent) => void;
	/**
	 * An optional name used to identify events for [React UFO (Unified Frontend Observability) press interactions](https://developer.atlassian.com/platform/ufo/react-ufo/react-ufo/getting-started/#quick-start--press-interactions). For more information, see [React UFO integration into Design System components](https://go.atlassian.com/react-ufo-dst-integration).
	 */
	interactionName?: string;
	/**
	 * An optional component name used to identify this component in Atlaskit analytics events. This can be used if a parent component's name is preferred over the default 'Anchor'.
	 */
	componentName?: string;
	/**
	 * Additional information to be included in the `context` of Atlaskit analytics events that come from anchor.
	 */
	analyticsContext?: Record<string, any>;
	/**
	 * Token representing background color with a built-in fallback value.
	 */
	backgroundColor?: BackgroundColor;
	/**
	 * Use this to set a label for assistive technology that describes the link as opening in a new window. The default label is "(opens new window)".
	 */
	newWindowLabel?: string;
	/**
	 * Tokens representing CSS shorthand for `paddingBlock` and `paddingInline` together.
	 *
	 * @see paddingBlock
	 * @see paddingInline
	 */
	padding?: Space;
	/**
	 * Tokens representing CSS shorthand `paddingBlock`.
	 *
	 * @see paddingBlockStart
	 * @see paddingBlockEnd
	 */
	paddingBlock?: Space;
	/**
	 * Tokens representing CSS `paddingBlockStart`.
	 */
	paddingBlockStart?: Space;
	/**
	 * Tokens representing CSS `paddingBlockEnd`.
	 */
	paddingBlockEnd?: Space;
	/**
	 * Tokens representing CSS shorthand `paddingInline`.
	 *
	 * @see paddingInlineStart
	 * @see paddingInlineEnd
	 */
	paddingInline?: Space;
	/**
	 * Tokens representing CSS `paddingInlineStart`.
	 */
	paddingInlineStart?: Space;
	/**
	 * Tokens representing CSS `paddingInlineEnd`.
	 */
	paddingInlineEnd?: Space;
	/**
	 * Forwarded ref.
	 */
	ref?: Ref<HTMLAnchorElement>;
};

export type AnchorProps<RouterLinkConfig extends Record<string, any> = never> =
	RouterLinkComponentProps<RouterLinkConfig> &
		Omit<
			ComponentPropsWithoutRef<'a'>,
			// Handled by router link config
			| 'href'
			// Has a custom handler for analytics
			| 'onClick'
			// Declared in StyleProp
			| 'style'
			| 'className'
		> &
		BasePrimitiveProps &
		StyleProp &
		BaseAnchorProps;

// TODO: duplicates FocusRing styles from `@atlaskit/focus-ring`.
const focusRingStyles = css({
	'&:focus, &:focus-visible': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		outlineColor: borderColorMap['color.border.focused'],
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		outlineOffset: positiveSpaceMap['space.025'],
		outlineStyle: 'solid',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		outlineWidth: borderWidthMap['border.width.outline'],
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&:focus:not(:focus-visible)': {
		outline: 'none',
	},
	'@media screen and (forced-colors: active), screen and (-ms-high-contrast: active)': {
		'&:focus-visible': {
			outline: '1px solid',
		},
	},
});

const baseStyles = css({
	boxSizing: 'border-box',
	textDecoration: 'underline',
});

const IS_EXTERNAL_LINK_REGEX = /^(?:(http|https):\/\/)/;
const IS_NON_HTTP_BASED = /^(((mailto|tel|sms):)|(#))/;
// Comma is added here to add a slight pause between announcing the anchor label and "opens in new window"
const OPENS_NEW_WINDOW_LABEL = '(opens new window)';

/**
 * __Anchor__
 *
 * A primitive for building custom anchor links.
 *
 * - [Examples](https://atlassian.design/components/primitives/anchor/examples)
 * - [Code](https://atlassian.design/components/primitives/anchor/code)
 * - [Usage](https://atlassian.design/components/primitives/anchor/usage)
 */
const AnchorNoRef = <RouterLinkConfig extends Record<string, any> = never>(
	{
		href,
		children,
		backgroundColor,
		newWindowLabel,
		padding,
		paddingBlock,
		paddingBlockStart,
		paddingBlockEnd,
		paddingInline,
		paddingInlineStart,
		paddingInlineEnd,
		onClick: providedOnClick = noop,
		interactionName,
		componentName,
		analyticsContext,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledBy,
		style,
		target,
		testId,
		xcss,
		...htmlAttributes
	}: AnchorProps<RouterLinkConfig>,
	ref?: Ref<HTMLAnchorElement>,
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

	// This is to remove className from safeHtmlAttributes
	// @ts-expect-error className doesn't exist in the prop definition but we want to ensure it cannot be applied even if types are bypassed
	const { className: _spreadClass, ...safeHtmlAttributes } = htmlAttributes;
	const resolvedStyles = parseXcss(xcss);

	const RouterLink = useRouterLink();

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

	const Component = isRouterLink ? RouterLink : 'a';

	return (
		<Component
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={style}
			ref={ref}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={resolvedStyles.static}
			// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
			{...safeHtmlAttributes}
			// @ts-expect-error
			href={!isRouterLink && typeof href !== 'string' ? undefined : href}
			target={target}
			onClick={onClick}
			aria-label={
				ariaLabel && target === '_blank' && !ariaLabelledBy
					? //`${ariaLabel} ${OPENS_NEW_WINDOW_LABEL}`
						`${ariaLabel} , ${newWindowLabel ? newWindowLabel : OPENS_NEW_WINDOW_LABEL}`
					: ariaLabel
			}
			aria-labelledby={
				ariaLabelledBy && target === '_blank'
					? `${ariaLabelledBy} ${opensNewWindowLabelId}`
					: ariaLabelledBy
			}
			css={[
				baseStyles,
				focusRingStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				backgroundColor && backgroundColorStylesMap[backgroundColor],
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				padding && paddingStylesMap.padding[padding],
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				paddingBlock && paddingStylesMap.paddingBlock[paddingBlock],
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				paddingBlockStart && paddingStylesMap.paddingBlockStart[paddingBlockStart],
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				paddingBlockEnd && paddingStylesMap.paddingBlockEnd[paddingBlockEnd],
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				paddingInline && paddingStylesMap.paddingInline[paddingInline],
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				paddingInlineStart && paddingStylesMap.paddingInlineStart[paddingInlineStart],
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				paddingInlineEnd && paddingStylesMap.paddingInlineEnd[paddingInlineEnd],
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
				resolvedStyles.emotion,
			]}
			data-testid={testId}
			data-is-router-link={testId ? (isRouterLink ? 'true' : 'false') : undefined}
		>
			{children}
			{target === '_blank' && ((children && !ariaLabel && !ariaLabelledBy) || ariaLabelledBy) && (
				<VisuallyHidden
					id={opensNewWindowLabelId}
				>{`, ${newWindowLabel ? newWindowLabel : OPENS_NEW_WINDOW_LABEL}`}</VisuallyHidden>
			)}
		</Component>
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

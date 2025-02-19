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

import { cx, jsx, cssMap as unboundedCssMap } from '@compiled/react';
import invariant from 'tiny-invariant';

import { type UIAnalyticsEvent, usePlatformLeafEventHandler } from '@atlaskit/analytics-next';
import { type RouterLinkComponentProps, useRouterLink } from '@atlaskit/app-provider';
import noop from '@atlaskit/ds-lib/noop';
import { useId } from '@atlaskit/ds-lib/use-id';
import InteractionContext, { type InteractionContextType } from '@atlaskit/interaction-context';
import VisuallyHidden from '@atlaskit/visually-hidden';

import Focusable from './focusable';
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
	 * Override the default text to signify that a link opens in a new window.
	 * This is appended to the `aria-label` attribute when the `target` prop is set to `_blank`.
	 */
	newWindowLabel?: string;
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

const styles = unboundedCssMap({
	root: {
		boxSizing: 'border-box',
		textDecoration: 'underline',
	},
});

const IS_EXTERNAL_LINK_REGEX = /^(?:(http|https):\/\/)/;
const IS_NON_HTTP_BASED = /^(((mailto|tel|sms):)|(#))/;

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
		newWindowLabel = '(opens new window)',
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

	const opensNewWindowLabelId = useId();

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
		<Focusable
			// @ts-expect-error we don't allow `a` on Focusable for makers as they should use Anchor instead
			as={Component}
			className={xcss}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- TODO: Properly type this and allow pass-through if we can determine the type
			style={style}
			ref={ref}
			// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
			{...safeHtmlAttributes}
			href={!isRouterLink && typeof href !== 'string' ? undefined : href}
			target={target}
			onClick={onClick}
			aria-label={
				ariaLabel && target === '_blank' && !ariaLabelledBy
					? `${ariaLabel} , ${newWindowLabel}`
					: ariaLabel
			}
			aria-labelledby={
				ariaLabelledBy && target === '_blank'
					? `${ariaLabelledBy} ${opensNewWindowLabelId}`
					: ariaLabelledBy
			}
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- TODO: We need to handle pass-through `xcss` => `xcss` here.
			xcss={cx(styles.root, xcss)}
			testId={testId}
			data-is-router-link={testId ? (isRouterLink ? 'true' : 'false') : undefined}
		>
			{children}
			{target === '_blank' && ((children && !ariaLabel && !ariaLabelledBy) || ariaLabelledBy) && (
				<VisuallyHidden id={opensNewWindowLabelId}>{`, ${newWindowLabel}`}</VisuallyHidden>
			)}
		</Focusable>
	);
};

// Workarounds to support generic types with forwardRef
/**
 * __Anchor__
 *
 * Anchor is a primitive for building custom anchor links. It's a wrapper around the HTML `<a>` element that provides a consistent API for handling client-side routing and Atlassian Design System styling.
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

import React, {
	type ComponentPropsWithoutRef,
	type ComponentPropsWithRef,
	forwardRef,
	type ReactNode,
	useCallback,
	useContext,
} from 'react';

import { type UIAnalyticsEvent, usePlatformLeafEventHandler } from '@atlaskit/analytics-next';
import noop from '@atlaskit/ds-lib/noop';
import InteractionContext, { type InteractionContextType } from '@atlaskit/interaction-context';

import { type BackgroundColor, type Space } from '../xcss/style-maps.partial';
import { type XCSS, xcss } from '../xcss/xcss';

import Box from './box';
import type { BasePrimitiveProps, StyleProp } from './types';

type BasePressableProps = {
	/**
	 * Elements to be rendered inside the Box.
	 */
	children?: ReactNode;
	/**
	 * Handler called on click. The second argument provides an Atlaskit UI analytics event that can be fired to a listening channel. See the ['analytics-next' package](https://atlaskit.atlassian.com/packages/analytics/analytics-next) documentation for more information.
	 */
	onClick?: (e: React.MouseEvent<HTMLButtonElement>, analyticsEvent: UIAnalyticsEvent) => void;
	/**
	 * Whether the button is disabled.
	 */
	isDisabled?: boolean;
	/**
	 * An optional name used to identify events for [React UFO (Unified Frontend Observability) press interactions](https://developer.atlassian.com/platform/ufo/react-ufo/react-ufo/getting-started/#quick-start--press-interactions). For more information, see [React UFO integration into Design System components](https://go.atlassian.com/react-ufo-dst-integration).
	 */
	interactionName?: string;
	/**
	 * An optional component name used to identify this component in Atlaskit analytics events. This can be used if a parent component's name is preferred over the default 'Pressable'.
	 */
	componentName?: string;
	/**
	 * Additional information to be included in the `context` of Atlaskit analytics events that come from pressable.
	 */
	analyticsContext?: Record<string, any>;
	/**
	 * Token representing background color with a built-in fallback value.
	 */
	backgroundColor?: BackgroundColor;
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
	ref?: ComponentPropsWithRef<'button'>['ref'];
};

export type PressableProps = Omit<
	ComponentPropsWithoutRef<'button'>,
	// Handled by `isDisabled`
	| 'disabled'
	// Has a custom handler for analytics
	| 'onClick'
	// Declared in StyleProp
	| 'style'
	| 'className'
> &
	BasePrimitiveProps &
	StyleProp &
	BasePressableProps;

// TODO: Duplicated FocusRing styles due to lack of `xcss` support
// and to prevent additional dependency
const baseFocusRingStyles = {
	outlineColor: 'color.border.focused',
	outlineWidth: 'border.width.outline',
	outlineStyle: 'solid',
	outlineOffset: 'space.025',
} as const;

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

/**
 * __Pressable__
 *
 * A primitive for building custom buttons.
 *
 * - [Examples](https://atlassian.design/components/primitives/pressable/examples)
 * - [Code](https://atlassian.design/components/primitives/pressable/code)
 * - [Usage](https://atlassian.design/components/primitives/pressable/usage)
 */
const Pressable = forwardRef(
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
		const interactionContext = useContext<InteractionContextType | null>(InteractionContext);
		const handleClick = useCallback(
			(e: React.MouseEvent<HTMLButtonElement>, analyticsEvent: UIAnalyticsEvent) => {
				interactionContext && interactionContext.tracePress(interactionName, e.timeStamp);
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

		// We're type coercing this as Compiled styles in an array isn't supported by the types
		// But the runtime accepts it none-the-wiser. We can remove this entire block and replace
		// it with cx(defaultStyles, focusRingStyles, xcssStyles) when we've moved away from Emotion.
		styles = (
			Array.isArray(xcssStyles) ? [...styles, ...xcssStyles] : [...styles, xcssStyles]
		) as XCSS[];

		return (
			<Box
				{...htmlAttributes}
				// @ts-expect-error - `as` is not compatible with Box. Pressable will be rewritten to diverge from Box soon.
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

export default Pressable;

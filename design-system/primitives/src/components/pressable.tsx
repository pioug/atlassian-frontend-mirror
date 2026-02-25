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

import { type UIAnalyticsEvent, usePlatformLeafEventHandler } from '@atlaskit/analytics-next';
import noop from '@atlaskit/ds-lib/noop';
import InteractionContext, { type InteractionContextType } from '@atlaskit/interaction-context';

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

type BasePressableProps = {
	/**
	 * Elements to be rendered inside the Pressable.
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
	 * @deprecated Please pass via `props.xcss`, eg. `xcss({ backgroundColor: '…' })` instead and include states such as hover values as well.
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
	ref?: Ref<HTMLButtonElement>;
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

// This duplicates FocusRing styles from `@atlaskit/focus-ring`.
const focusRingStyles = css({
	'&:focus, &:focus-visible': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		outlineColor: borderColorMap['color.border.focused'],
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		outlineOffset: positiveSpaceMap['space.025'],
		outlineStyle: 'solid',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		outlineWidth: borderWidthMap['border.width.focused'],
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&:focus:not(:focus-visible)': {
		outline: 'none',
	},
	'@media screen and (forced-colors: active), screen and (-ms-high-contrast: active)': {
		'&:focus-visible': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			outline: `${borderWidthMap['border.width']} solid`,
		},
	},
});

const baseStyles = css({
	boxSizing: 'border-box',
	appearance: 'none',
	border: 'none',
});
const enabledStyles = css({
	cursor: 'pointer',
});
const disabledStyles = css({
	cursor: 'not-allowed',
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
const Pressable: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<PressableProps> & React.RefAttributes<HTMLButtonElement>
> = forwardRef(
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
			onClick: providedOnClick = noop,
			interactionName,
			componentName,
			analyticsContext,
			style,
			testId,
			xcss,
			...htmlAttributes
		}: PressableProps,
		ref?: Ref<HTMLButtonElement>,
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

		// This is to remove className from safeHtmlAttributes
		// @ts-expect-error className doesn't exist in the prop definition but we want to ensure it cannot be applied even if types are bypassed
		const { className: _spreadClass, ...safeHtmlAttributes } = htmlAttributes;
		const resolvedStyles = parseXcss(xcss);

		return (
			<button
				style={style}
				ref={ref}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={resolvedStyles.static}
				{...safeHtmlAttributes}
				// eslint-disable-next-line react/button-has-type
				type={type}
				onClick={onClick}
				disabled={isDisabled}
				css={[
					baseStyles,
					focusRingStyles,
					isDisabled ? disabledStyles : enabledStyles,
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
					...(resolvedStyles.emotion || []),
				]}
				data-testid={testId}
			>
				{children}
			</button>
		);
	},
);

export default Pressable;

/**
 * @jsxFrag
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef, lazy, Suspense, useCallback, useRef } from 'react';

import { cssMap, cx, jsx, keyframes } from '@compiled/react';

import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { AvatarContext, type AvatarContextProps } from '@atlaskit/avatar';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import { Anchor, Pressable, Text, type TextColor } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import Tooltip, {
	TooltipPrimitive,
	type TooltipPrimitiveProps,
	type TooltipProps,
} from '@atlaskit/tooltip';

import { forwardRefWithGeneric } from '../../components/forward-ref-with-generic';

import { expandableMenuItemIndentation } from './constants';
import { useLevel } from './expandable-menu-item/expandable-menu-item-context';
import {
	useFlyoutMenuOpen,
	useSetFlyoutMenuOpen,
} from './flyout-menu-item/flyout-menu-item-context';
import { COLLAPSE_ELEM_BEFORE } from './menu-item-signals';
import type { MenuItemLinkOrButtonCommonProps, MenuItemOnClick } from './types';

// Using `lazy` so that only consumers who want drag and drop
// need to include code for the drag handle.
const LazyDragHandle = lazy(
	() =>
		import(
			/* webpackChunkName: "@atlaskit-internal_nav4-menu-item-drag-handle" */
			'./drag-handle'
		),
);

const tooltipStyles = cssMap({
	root: {
		// Unique styles for our tooltip
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		// matching the height of standard items
		minHeight: '32px',
		// increased max width from standard tooltip
		maxWidth: '420px',

		// Mostly copied styles from `tooltip/src/tooltip-container.tsx`
		// Could likely use `TooltipContainer` from Tooltip and override styles,
		// but that could lead to some unexpected results as Tooltip is styled
		// using emotion.
		boxSizing: 'border-box',
		paddingBlockStart: token('space.025'),
		paddingInlineEnd: token('space.075'),
		paddingBlockEnd: token('space.025'),
		paddingInlineStart: token('space.075'),
		backgroundColor: token('color.background.neutral.bold'),
		borderRadius: token('border.radius'),
		color: token('color.text.inverse'),
		font: token('font.body.UNSAFE_small'),
		insetBlockStart: token('space.0'),
		insetInlineStart: token('space.0'),
		overflowWrap: 'break-word',
		wordWrap: 'break-word',
	},
});

const MenuItemTooltip = forwardRef<HTMLDivElement, TooltipPrimitiveProps>(function MenuItemTooltip(
	{ children, className, ...rest },
	ref,
) {
	return (
		<TooltipPrimitive
			{...rest}
			// Manually passing on `className` so it gets merged correctly in the build output.
			// The passed classname is mostly used for integration testing (`.Tooltip`)
			// eslint-disable-next-line @atlaskit/design-system/no-unsafe-style-overrides, @atlaskit/ui-styling-standard/no-classname-prop
			className={className}
			// "css" does not "exist" - it gets transformed into "className" by compiled
			css={tooltipStyles.root}
			ref={ref}
		>
			{children}
		</TooltipPrimitive>
	);
});

function isTextClamped(element: HTMLElement): boolean {
	// Checking for vertical height rather than horizontal height.
	// When text is "clamped", it's technically being clamped vertically! 🤯
	return element.scrollHeight > element.clientHeight;
}

const defaultAvatarValues: AvatarContextProps = {
	size: 'small',
};

const elemAfterDisplayVar = '--elem-after-display';
const actionsOnHoverDisplayVar = '--actions-on-hover-display';
const notchColorVar = '--notch-color';

// Note: this is also used in `drag-handle.tsx`
const dragHandleDisplayVar = '--drag-handle-display';

const dragCursorAnimation = keyframes({
	to: {
		cursor: 'grab',
	},
});

/**
 * ## 🤹 `position:relative`
 *
 * We need `position:relative` on an element that takes
 * up the full size of the interactive element so we
 * can correctly use `position:absolute` to place:
 * 1. the notch for links
 * 2. drop indicators for drag and drop
 * 3. a child of button / anchor to stretch it out to
 *    increase it's pressable area.
 *
 * ⛔️ We cannot add `position:relative` _only_ on the
 * button / anchor as that will cause sibling elements
 * to be rendered under the button / anchor when setting
 * a background color on the button / anchor.
 *
 * 📖 Note: `position:relative` elements are painted after
 * elements with `position:static` (the default)
 * https://drafts.csswg.org/css-position-4/#painting-order
 *
 * ⛔️ We cannot add `position:relative` to the container
 * element, as then the `:focus` ring styles on the
 * button / anchor can be cut off by the next sibling if it has
 * has a background color set (eg when selected)
 *
 * ✅ Add `position:relative` to all first level descendants
 * of the container element so that we don't impact DOM ordered
 * paint ordering within the item and the button / anchor focus
 * ring can still bleed over siblings
 *
 * 📖 We could use `> * { position: relative; }` on the container,
 * but that would violate our styling standard.
 */
const topLevelSiblingStyles = cssMap({
	root: {
		position: 'relative',
	},
});

/**
 * All slots on the menu item (eg `elemBefore`) are rendered as siblings
 * of our main button / anchor element and they are visually placed on
 * top of the main button / anchor.
 *
 * 📖 This is done so that we don't nest interactive elements in our markup.
 *
 * ✅ This is great when element in the slot is an interactive element
 * as we don't want the main menu item button / anchor to be triggered
 * when interacting with the element in the slot.
 *
 * ⛔️ When the element in the slot is static content (eg an `<Icon>`) it will
 * prevent the main button / anchor (that is visually behind the element in
 * the slot) from being clicked. The element in the slot is a sibling of our
 * main button / anchor (not a child of it) so clicking on the element in the
 * slot will not bubble up to the button / anchor.
 *
 * 🚀 We set `pointer-events:none` on a slot if it does not contain and interactive
 * element so that static content in a slot does not prevent clicking on the main
 * button / anchor.
 */
const onTopOfButtonOrAnchorStyles = cssMap({
	root: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:not(:has(button,a))': {
			pointerEvents: 'none',
		},
	},
});

/**
 * This is being _internally_ exported so it can be used in other menu item wrapper components, like
 * ExpandableMenuItemTrigger.
 *
 * This selector is used to apply hover styling on the menu item if it contains an open nested popup.
 * It's looking for a popup trigger with `aria-hasexpanded` and `aria-haspopup` attributes. The
 * reason for targeting the _trigger_ instead of the popup itself, is the popup might be rendered
 * outside the menu item, e.g. if rendered in a portal.
 *
 * An alternative solution might involve wrapping it with a popup context and listening to the popup
 * events through it (and applying the hover style when the popup is open). Exploring this has been
 * captured in [BLU-3354](https://jplat.atlassian.net/browse/BLU-3354).
 */
export const nestedOpenPopupCSSSelector = '&:has([aria-expanded="true"][aria-haspopup="true"])';

const containerStyles = cssMap({
	root: {
		boxSizing: 'border-box',
		display: 'grid',
		/**
		 * Slot 1: elemBefore (collapse last)
		 * Slot 2: interactive element content (collapse first)
		 * Slot 3: elemAfter (collapse last) [also for actionsOnHover]
		 * Slot 4: actions (collapse last)
		 */
		gridTemplateColumns: 'minmax(0, auto) 1fr minmax(0, auto) minmax(0, auto)',
		gridTemplateRows: '1fr', // a single row grid
		gridTemplateAreas: '"elem-before interactive elem-after actions"',
		/**
		 * A min-width is set to ensure that the menu items do not completely collapse when deeply nested.
		 * Otherwise, the menu items progressively shrink as they get into deeper levels of expandable menu items, until they
		 * are unusable.
		 */
		minWidth: '72px',
		// Using rem so it scales with browser font size and rem-based spacing/typography
		height: '2rem',
		alignItems: 'center',
		userSelect: 'none',
		borderRadius: token('border.radius'),
		color: token('color.text.subtle'),
		[actionsOnHoverDisplayVar]: 'none',
		[notchColorVar]: 'transparent',
		[elemAfterDisplayVar]: 'flex',
		// Applying :hover styles on the container rather than on
		// just the button / anchor so that we will still trigger the
		// :hover styles when over action buttons
		'&:hover': {
			backgroundColor: token('elevation.surface.hovered'),
		},
		'&:hover, &:focus-within': {
			[actionsOnHoverDisplayVar]: 'flex',
		},
		// If there is a nested open popup, we want to apply hover styling, and display the `actionsOnHover` slot.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
		[nestedOpenPopupCSSSelector]: {
			backgroundColor: token('elevation.surface.hovered'),
			[actionsOnHoverDisplayVar]: 'flex',
		},
	},
	removeElemAfter: {
		[elemAfterDisplayVar]: 'none',
	},
	showHoverActions: {
		[actionsOnHoverDisplayVar]: 'flex',
	},
	removeElemAfterOnHoverOrOpenNestedPopup: {
		// On hover of the menu item, remove the elemAfter
		'&:hover, &:focus-within': {
			[elemAfterDisplayVar]: 'none',
		},
		// If there is a nested open popup, and both `actionsOnHover` and `elemAfter` exist, we want to hide the `elemAfter`.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
		[nestedOpenPopupCSSSelector]: {
			[elemAfterDisplayVar]: 'none',
		},
	},
	selected: {
		backgroundColor: token('color.background.selected'),
		color: token('color.text.selected'),
		[notchColorVar]: token('color.background.selected.bold'),
		'&:hover': {
			color: token('color.text.selected'),
			backgroundColor: token('color.background.selected.hovered'),
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values
		[nestedOpenPopupCSSSelector]: {
			backgroundColor: token('color.background.selected.hovered'),
		},
	},
	disabled: {
		// Setting the color here to allow icons with "currentColor" to inherit the disabled color.
		color: token('color.text.disabled'),
		'&:hover': {
			// Removing the background color that gets applied on hover
			backgroundColor: 'unset',
		},
	},
	hasDescription: {
		/* Standard 32px + another 16px for the description */
		height: '3rem',
	},
	dragging: {
		opacity: 0.4,
	},
});

const buttonOrAnchorStyles = cssMap({
	// This button / anchor is positioned to produce the visual appearance of nested
	// buttons whilst the elements are actually siblings in the DOM structure.
	root: {
		display: 'grid',
		// Extend the button to the full width of container
		gridColumn: '1 / -1',
		// Each grid item is placed on the same row and stacks on top of each other.
		gridRow: '1',
		gridTemplateColumns: 'subgrid',
		gridTemplateRows: 'subgrid',
		paddingInlineEnd: token('space.050'),
		paddingInlineStart: token('space.050'),
		// Notes:
		// - block padding is not strictly needed.
		// - it does cause some issues with "combine" styling on firefox@125; but not
		//   on firefox@137
		paddingBlockStart: token('space.050'),
		paddingBlockEnd: token('space.050'),
		backgroundColor: 'transparent',
		borderRadius: token('border.radius'),
		color: token('color.text.subtle'),
		alignItems: 'center',
		textAlign: 'start',
		// :active styles are applied on the button / anchor rather
		// than on the container so that pressing on actions does not
		// trigger the :active styles on the whole element.
		// We are excluding the disabled state, so we don't respond to
		// presses when disabled.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:active:not(:disabled)': {
			backgroundColor: token('elevation.surface.pressed'),
		},
	},
	selected: {
		color: token('color.text.selected'),
		// We are excluding the disabled state, so we don't respond to
		// presses when disabled.
		// We also need to match the :active selector in the non-selected styles
		// to ensure it doesn't have a higher specificity
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:active:not(:disabled)': {
			backgroundColor: token('color.background.selected.pressed'),
		},
	},
	// Only applying on interactive element as we are not enabling
	// dragging from nested interactive elements
	hasDragIndicator: {
		/**
		 * Opting out of long press actions on iOS as they don't work well with drag and drop.
		 *
		 * If you don't opt out, anchors can get a context menu including a link preview and actions
		 * (eg "open in new tab"). While it's still possible to do drag and drop operations with this
		 * context menu, it's a pain as you need to close the context menu while keeping your dragging
		 * finger depressed, then you can continue with the drag operation.
		 *
		 * TODO: could consider adding this to all menu items for a consistent experience.
		 */
		'-webkit-touch-callout': 'none',
		// change cursor on hover
		[dragHandleDisplayVar]: 'none',
		'&:hover': {
			[dragHandleDisplayVar]: 'flex',
			animationDuration: '0s',
			animationName: dragCursorAnimation,
			// 800ms taken from drag and drop guidelines
			animationDelay: '800ms',
			animationFillMode: 'forwards',
		},
	},
});

const extendButtonOrAnchorStyles = cssMap({
	root: {
		position: 'absolute',
		inset: token('space.0'),
	},
});

const notchStyles = cssMap({
	root: {
		position: 'absolute',
		insetBlockStart: '50%',
		insetInlineStart: token('space.0'),
		width: '2px',
		height: '12px',
		transform: 'translateY(-50%)',
		backgroundColor: `var(${notchColorVar})`,
	},
});

const actionStyles = cssMap({
	root: {
		display: 'flex',
		alignItems: 'center',
		gap: token('space.050'),
		gridArea: 'actions',
		paddingInlineEnd: token('space.050'),
		// Hiding overflowing slot content to prevent content from adjacent slots overlapping when the menu item is constrained to a narrow width.
		overflow: 'hidden',
		'&:focus-within': {
			// To prevent the focus ring from being clipped, we are allowing content to overflow while focus is within the slot.
			overflow: 'initial',
		},
	},
});

const actionsOnHoverStyles = cssMap({
	root: {
		display: `var(${actionsOnHoverDisplayVar})`,
		// When actionsOnHover are displayed, the elemAfter is hidden
		// and these actions are rendered in it's place.
		gridArea: 'elem-after',
		alignItems: 'center',
		gap: token('space.050'),
		paddingInlineEnd: token('space.050'),
		// Hiding overflowing slot content to prevent content from adjacent slots overlapping when the menu item is constrained to a narrow width.
		overflow: 'hidden',
		'&:focus-within': {
			// To prevent the focus ring from being clipped, we are allowing content to overflow while focus is within the slot.
			overflow: 'initial',
		},
	},
});

const textStyles = cssMap({
	root: {
		paddingInlineEnd: token('space.050'),
		paddingInlineStart: token('space.050'),
		display: 'flex',
		flexDirection: 'column',
		gap: token('space.025'),
		// Allowing at least one character to be seen at all times, even when the menu item has been shrunk down
		minWidth: '1ch',
		// Hiding overflowing slot content to prevent content from adjacent slots overlapping when the menu item is constrained to a narrow width.
		overflow: 'hidden',
		'&:focus-within': {
			// To prevent the focus ring from being clipped, we are allowing content to overflow while focus is within the slot.
			overflow: 'initial',
		},
	},
	noElemBeforeIndent: {
		paddingInlineStart: token('space.075'),
	},
});

const elemBeforeStyles = cssMap({
	root: {
		gridArea: 'elem-before',
		display: 'flex',
		flexShrink: 0,
		width: '24px',
		height: '24px',
		alignItems: 'center',
		justifyContent: 'center',
		paddingInlineStart: token('space.050'),
		// Box sizing must be explicit because we set a size AND padding on the same axis
		// Otherwise the resulting size can be inconsistent depending on the global reset used
		boxSizing: 'content-box',
		// Hiding overflowing slot content to prevent content from adjacent slots overlapping when the menu item is constrained to a narrow width.
		overflow: 'hidden',
		'&:focus-within': {
			// To prevent the focus ring from being clipped, we are allowing content to overflow while focus is within the slot.
			overflow: 'initial',
		},
	},
});

const elemAfterStyles = cssMap({
	root: {
		display: `var(${elemAfterDisplayVar})`,
		gridArea: 'elem-after',
		flexShrink: 0,
		height: '24px',
		alignItems: 'center',
		paddingInlineEnd: token('space.050'),
		// Hiding overflowing slot content to prevent content from adjacent slots overlapping when the menu item is constrained to a narrow width.
		overflow: 'hidden',
		'&:focus-within': {
			// To prevent the focus ring from being clipped, we are allowing content to overflow while focus is within the slot.
			overflow: 'initial',
		},
	},
});

/**
 * We are using a wrapping element for our interactive content
 * even though only the `Text` element is the only thing not using `position:absolute`
 *
 * Rationale:
 * - Super clear that everything inside the interactive content should be in a specific slot in the grid
 * - To work around a browser bug in Safari where it does not work well with `position:absolute`
 *   on a subgrid child.
 *   Safari bug: https://bugs.webkit.org/show_bug.cgi?id=292516
 */
const interactiveContentStyles = cssMap({
	root: {
		gridArea: 'interactive',
		// Make content full height
		display: 'flex',
		flexDirection: 'column',
		alignContent: 'center',
	},
});

function getTextColor({
	isDisabled,
	isSelected,
}: {
	isDisabled?: boolean;
	isSelected?: boolean;
}): TextColor {
	if (isDisabled) {
		return 'color.text.disabled';
	}

	if (isSelected) {
		return 'color.text.selected';
	}

	return 'color.text.subtle';
}

/**
 * Includes all props that are used by any menu item, as MenuItembase is the base component for all menu item components.
 *
 * We also include additional `aria` props to support the menu item being a trigger for the FlyoutMenuItem popup and for the
 * expanded content for ExpandableMenuItem.
 */
type MenuItemBaseProps<T extends HTMLAnchorElement | HTMLButtonElement> =
	MenuItemLinkOrButtonCommonProps & {
		/**
		 * ID attribute, passed to the interactive element (anchor/button). This is not publicly exposed, and is currently only
		 * used internally by `ExpandableMenuItemTrigger` for the `aria-labelledby` attribute.
		 */
		id?: string;
		href?: string | Record<string, any>;
		target?: HTMLAnchorElement['target'];
		isDisabled?: boolean;
		isSelected?: boolean;
		// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
		ariaControls?: string;
		// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention, @repo/internal/react/consistent-props-definitions
		ariaExpanded?: boolean;
		// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
		ariaHasPopup?: boolean | 'dialog';
		onClick?: MenuItemOnClick<T>;
	};

/**
 * This is the internal version of the component, to be passed into `forwardRef`.
 *
 * It contains a type argument `<T>`, to specify the type of the interactive element (`button` or `a`).
 * This can be inferred from the type of the `onClick` prop.
 */
const MenuItemBaseNoRef = <T extends HTMLAnchorElement | HTMLButtonElement>(
	{
		id,
		testId,
		actions,
		actionsOnHover,
		children,
		description,
		elemAfter,
		elemBefore,
		href,
		target,
		isDisabled,
		isSelected,
		onClick,
		ariaControls,
		ariaExpanded,
		ariaHasPopup,
		interactionName,
		isContentTooltipDisabled,
		visualContentRef,
		isDragging,
		hasDragIndicator,
		dropIndicator,
	}: MenuItemBaseProps<T>,
	forwardedRef: React.ForwardedRef<T>,
) => {
	const level = useLevel();
	const setFlyoutMenuOpen = useSetFlyoutMenuOpen();
	const isFlyoutMenuOpen = useFlyoutMenuOpen();
	const isLink = typeof href !== 'undefined';
	const labelRef = useRef<T | null>(null);
	const descriptionRef = useRef<T | null>(null);
	const tooltipOnClick = useRef<React.MouseEventHandler<HTMLElement> | null>(null);

	const handleClick = useCallback(
		(event: React.MouseEvent<T>, analyticsEvent: UIAnalyticsEvent) => {
			onClick?.(event, analyticsEvent);
			// Toggle flyout menu open state when inside a flyout context provider
			setFlyoutMenuOpen(!isFlyoutMenuOpen);

			tooltipOnClick.current?.(event);
		},
		[onClick, setFlyoutMenuOpen, isFlyoutMenuOpen],
	);

	/**
	 * Show the tooltip if _either_ label or description is truncated
	 */
	const canTooltipAppear = useCallback((): boolean => {
		if (isContentTooltipDisabled) {
			return false;
		}

		// Show tooltip if _either_ label or description are clamped

		const label = labelRef.current;
		const description = descriptionRef.current;

		if (label && isTextClamped(label)) {
			return true;
		}

		return Boolean(description && isTextClamped(description));
	}, [isContentTooltipDisabled]);

	// By default provide the spacing for `elemBefore` to have good
	// vertical alignment of labels and to give clear indentation between levels
	// in the side navigation (even when items don't use elemBefore).
	const showElemBefore = elemBefore !== COLLAPSE_ELEM_BEFORE;

	const interactiveElemContent = (
		<div css={interactiveContentStyles.root}>
			{/**
			 * We are creating a hidden element to increase the interactive area of our menu items.
			 * This enables users to only need to move their pointers vertically to be able to access
			 * nested menu items.
			 *
			 * 📺 More context: https://www.youtube.com/watch?v=zVFJAwrCQCM
			 *
			 * Notes:
			 *
			 * - We cannot use `::before` on the interactive element itself as you
			 *   cannot drag a `button` element from `::before` in Firefox
			 *   https://bugzilla.mozilla.org/show_bug.cgi?id=1967645
			 * - The hidden element uses `position:absolute` so it won't impact layout
			 *
			 */}
			<div
				css={extendButtonOrAnchorStyles.root}
				// This extends the clickable area of nested menu items to the width
				// of the root level menu items, while being visually indented.
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values
				style={{ insetInlineStart: `calc(-1 * ${level} * ${expandableMenuItemIndentation})` }}
				aria-hidden="true"
			/>
			<div css={[textStyles.root, !showElemBefore && textStyles.noElemBeforeIndent]}>
				<Text
					weight="medium"
					maxLines={1}
					color={getTextColor({ isDisabled, isSelected })}
					ref={labelRef}
				>
					{children}
				</Text>
				{description && (
					<Text
						color={isDisabled ? 'color.text.disabled' : 'color.text.subtle'}
						size="small"
						maxLines={1}
						ref={descriptionRef}
					>
						{description}
					</Text>
				)}
			</div>
			{/**
			 * Both the drop indicator and drag handle use `position:absolute`
			 * Both rely on `position:relative` on a parent for positioning.
			 */}

			{/**
			 * Wrapping `LazyDragHandle` in it's own `Suspense` boundary, so that it's loading won't block
			 * the rendering of the rest of the menu item.
			 * We put the `Suspense` in the conditional branch to avoid putting a `Suspense` in the react
			 * tree for consumers who don't need it
			 */}
			{hasDragIndicator ? (
				<Suspense fallback={null}>
					<LazyDragHandle />
				</Suspense>
			) : null}

			{dropIndicator}
		</div>
	);

	/**
	 *  If the [expandable] menu item is expanded, show hover actions even when *not* hovered.
	 *
	 * Note: we also remove the `elemAfter` when showing `actionsOnHover`
	 */
	const showHoverActionsWhenNotHovered = Boolean(ariaExpanded && actionsOnHover);

	return (
		<AvatarContext.Provider value={defaultAvatarValues}>
			<div
				ref={visualContentRef}
				css={[
					containerStyles.root,
					isSelected && containerStyles.selected,
					isDragging && containerStyles.dragging,
					description && containerStyles.hasDescription,
					// If the menu item has actionsOnHover and is expanded, show hover actions even when not hovered
					showHoverActionsWhenNotHovered && containerStyles.showHoverActions,
					// If the menu item has both actionsOnHover and elemAfter and is expanded, remove elemAfter to make more space for actionsOnHover.
					showHoverActionsWhenNotHovered && elemAfter && containerStyles.removeElemAfter,
					// If the menu item has both actionsOnHover and elemAfter, remove elemAfter to make more space for actionsOnHover, when:
					// - menu item is hovered, or
					// - there is an open nested popup (as we apply hover styles when there is an open nested popup)
					actionsOnHover && elemAfter && containerStyles.removeElemAfterOnHoverOrOpenNestedPopup,
					isDisabled && containerStyles.disabled,
				]}
				data-testid={testId ? `${testId}-container` : undefined}
				data-selected={isSelected}
			>
				<Tooltip
					content={() => (
						<>
							<div>{children}</div>
							{description ? <div>{description}</div> : null}
						</>
					)}
					position="right"
					// NOTE: Types in React 18 have changed and `forwardRef(() => <TooltipPrimitive>)` no longer appears to match 100%
					component={MenuItemTooltip as TooltipProps['component']}
					ignoreTooltipPointerEvents
					hideTooltipOnMouseDown
					// We don't need a duplicate hidden element containing tooltip content
					// as the content of the tooltip matches what is rendered for the menu item.
					isScreenReaderAnnouncementDisabled
					canAppear={canTooltipAppear}
				>
					{(tooltipProps) => {
						// Putting the tooltip onClick into a ref.
						// This way we don't need to create a new `onClick` function on each
						// render (as we would need to merge `tooltipProps.onClick` and our `handleClick`)
						tooltipOnClick.current = tooltipProps.onClick;

						const sharedProps = {
							...tooltipProps,
							'aria-controls': ariaControls,
							'aria-haspopup': ariaHasPopup,
							ref: mergeRefs([forwardedRef, tooltipProps.ref]),
							id,
							testId,
							interactionName,
						};

						return isLink ? (
							<Anchor
								{...sharedProps}
								onClick={handleClick as MenuItemOnClick<HTMLAnchorElement>}
								xcss={cx(
									buttonOrAnchorStyles.root,
									topLevelSiblingStyles.root,
									isSelected && buttonOrAnchorStyles.selected,
									hasDragIndicator && buttonOrAnchorStyles.hasDragIndicator,
								)}
								// Needed to override Anchor style due to a compiled/emotion conflict
								// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
								style={{ textDecoration: 'none' }}
								aria-current={isSelected ? 'page' : undefined}
								href={href}
								target={target}
								/**
								 * For anchors we don't want to have the standard drag and drop behaviour.
								 *
								 * Thinking on the topic:
								 *
								 * - Anchors look visually similar to buttons in the sidenav
								 * - Why should some menu items be natively draggable, while others are not?
								 * - A user cannot know which menu items are "natively" draggable (ie anchors)
								 * - If you wire up an anchor to be draggable using our standard affordances
								 *   it will have a different preview experience to native anchor dragging.
								 *
								 * To promote consistency, all elements need to use the same visual affordances.
								 *
								 * Anchor elements will automatically attach URL information
								 * to the native data store.
								 *
								 * When `hasDragIndicator` is `true` we are expecting consumers to register
								 * the element as draggable through the `draggable()` Pragmatic drag and drop function.
								 * The `draggable()` function will add `draggable="true"` to the element.
								 */
								draggable={hasDragIndicator ? undefined : false}
							>
								{/* Won't be a "grid child" */}
								<div css={notchStyles.root} aria-hidden="true" />
								{interactiveElemContent}
							</Anchor>
						) : (
							<Pressable
								{...sharedProps}
								onClick={handleClick as MenuItemOnClick<HTMLButtonElement>}
								xcss={cx(
									buttonOrAnchorStyles.root,
									topLevelSiblingStyles.root,
									isSelected && buttonOrAnchorStyles.selected,
									hasDragIndicator && buttonOrAnchorStyles.hasDragIndicator,
								)}
								aria-expanded={ariaExpanded}
								isDisabled={isDisabled}
							>
								{interactiveElemContent}
							</Pressable>
						);
					}}
				</Tooltip>
				{showElemBefore && (
					<div
						css={[
							elemBeforeStyles.root,
							topLevelSiblingStyles.root,
							onTopOfButtonOrAnchorStyles.root,
						]}
					>
						{elemBefore}
					</div>
				)}
				{actionsOnHover && <div css={actionsOnHoverStyles.root}>{actionsOnHover}</div>}
				{elemAfter && (
					<div
						css={[
							elemAfterStyles.root,
							topLevelSiblingStyles.root,
							onTopOfButtonOrAnchorStyles.root,
						]}
					>
						{elemAfter}
					</div>
				)}
				{actions && (
					<div
						css={[actionStyles.root, topLevelSiblingStyles.root, onTopOfButtonOrAnchorStyles.root]}
					>
						{actions}
					</div>
				)}
			</div>
		</AvatarContext.Provider>
	);
};

/**
 * __MenuItemBase__
 *
 * The base menu item component used to compose ButtonMenuItem and LinkMenuItem.
 *
 * It contains a type argument `<T>`, to specify the type of the interactive element (`button` or `a`).
 * This can be inferred from the type of the `onClick` prop.
 */
export const MenuItemBase = forwardRefWithGeneric(MenuItemBaseNoRef);

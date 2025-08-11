/**
 * @jsxFrag
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { forwardRef, type ReactNode, useCallback, useId, useRef } from 'react';

import { cssMap, jsx } from '@compiled/react';

import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { IconButton } from '@atlaskit/button/new';
import type { IconProps } from '@atlaskit/icon';
import ChevronDownIcon from '@atlaskit/icon/core/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import { MenuItemBase, nestedOpenPopupCSSSelector } from '../menu-item';
import type { MenuItemCommonProps, MenuItemSlots } from '../types';
import { useScrollMenuItemIntoView } from '../use-scroll-menu-item-into-view';

import {
	useIsExpanded,
	useOnExpansionToggle,
	useSetIsExpanded,
} from './expandable-menu-item-context';

type ExpandableMenuItemIconProps = {
	isExpanded: boolean;
	isHovering: boolean;
	isSelected?: boolean;
	/**
	 * The element to display when the user is not hovering over the icon. If not provided, the chevron icon will be used
	 */
	providedElemBefore?: ReactNode;
	iconProps?: IconProps;
};

// Widening type to `string` to side-step Compiled cssMap typescript warnings with unknown properties
const chevronDisplayCssVar: string = '--expandable-chevron-display';
const providedElemBeforeDisplayCssVar: string = '--expandable-provided-elembefore-display';

const wrapperStyles = cssMap({
	root: {
		/**
		 * By default, we display the chevron icon only.
		 */
		// Using `display: flex` to ensure the chevron icon is center aligned.
		// We can't use `display: contents` as it won't apply the `transform` property.
		[chevronDisplayCssVar]: 'flex',
		[providedElemBeforeDisplayCssVar]: 'none',
	},
	showProvidedElemBefore: {
		/**
		 * If there is a provided `elemBefore`, we display it in the default state instead of the chevron icon.
		 *
		 * We replace it with the chevron icon when:
		 * - The user hovers over the menu item
		 * - The user is focused on the menu item, or any of the interactive elements within the menu item
		 * - The menu item has a nested open popup (e.g. a `More` submenu in the `actions` or `actionsOnHover` slot)
		 */
		[chevronDisplayCssVar]: 'none',
		// We can use `display: contents` here as we don't need to apply the `transform` property on the provided
		// elemBefore - we only apply it to the chevron icon.
		[providedElemBeforeDisplayCssVar]: 'contents',
		/**
		 * We are using `:has(:focus-visible)` to target the menu item when it, or any of its interactive elements, should
		 * actually appear focused. If we just used `:focus-within`, in some browsers it could (incorrectly) stay in the
		 * focus state after being clicked.
		 *
		 * Ideally we want something like `:focus-visible-within`, but that doesn't exist yet - but we can emulate it
		 * with `:has`. See: https://larsmagnus.co/blog/focus-visible-within-the-missing-pseudo-class
		 */
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:hover, &:has(:focus-visible)': {
			[chevronDisplayCssVar]: 'flex',
			[providedElemBeforeDisplayCssVar]: 'none',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values
		[nestedOpenPopupCSSSelector]: {
			[chevronDisplayCssVar]: 'flex',
			[providedElemBeforeDisplayCssVar]: 'none',
		},
	},
});

const iconStyles = cssMap({
	chevron: {
		display: `var(${chevronDisplayCssVar})`,
		// Flip the chevron icon when the direction is right-to-left
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'[dir="rtl"] &': {
			transform: 'scaleX(-1)',
		},
	},
	providedElemBefore: {
		display: `var(${providedElemBeforeDisplayCssVar})`,
	},
	providedElemBeforeSelected: {
		color: token('color.icon.selected'),
	},
});

const ExpandableMenuItemIcon = ({
	iconProps,
	isExpanded,
	isSelected,
	providedElemBefore,
}: Omit<ExpandableMenuItemIconProps, 'isHovering'>): JSX.Element => {
	const ChevronIcon = isExpanded ? ChevronDownIcon : ChevronRightIcon;

	const chevronElem = (
		<ChevronIcon
			{...iconProps}
			label=""
			color={isSelected ? token('color.icon.selected') : undefined}
			size="small"
		/>
	);

	return (
		<>
			<div css={iconStyles.chevron}>{chevronElem}</div>
			{/* If there is no provided elemBefore, not rendering the wrapper either to simplify the DOM */}
			{providedElemBefore && (
				<div
					css={[iconStyles.providedElemBefore, isSelected && iconStyles.providedElemBeforeSelected]}
				>
					{providedElemBefore}
				</div>
			)}
		</>
	);
};

export type ExpandableMenuItemTriggerProps = MenuItemCommonProps &
	// Overriding `MenuItemSlots` that have distinct behaviour in expandable menu items.
	// Using `Omit` prevents the jsdoc from MenuItemSlots also being merged in.
	Omit<MenuItemSlots, 'actionsOnHover' | 'elemBefore'> & {
		// Overriding the `actionsOnHover` prop to add specific JSDOCs for expandable behaviour.
		/**
		 * `ReactNode` to be placed visually after the `children` and will
		 * only be displayed on hover or focus, or when the expandable menu item
		 * is expanded.
		 *
		 * It is intended for additional actions (e.g. IconButtons).
		 *
		 * This `ReactNode` will replace `elemAfter` on hover/focus or when expanded.
		 *
		 * This `ReactNode` will be rendered visually on top of the main
		 * interactive element for the menu item. If this element does not
		 * contain an interactive element (`button` or `a`) then `pointer-events`
		 * will be set to `none` on this slot so that users can click through
		 * this element onto the main interactive element of the menu item.
		 */
		actionsOnHover?: ReactNode;

		// Overriding the `elemBefore` prop to remove the `COLLAPSE_ELEM_BEFORE_TYPE` functionality
		// and to add custom jsdoc
		/**
		 * The element to display before the content of the menu item.
		 *
		 * By default, a chevron icon will be displayed in this slot. If a custom `elemBefore`
		 * is provided, the custom element will replaced by the chevron icon while the user is
		 * hovering or focused on the item.
		 *
		 * `ExpandableMenuItemTrigger` does not respect `COLLAPSE_ELEM_BEFORE` as a chevron
		 * will always be displayed.
		 */
		elemBefore?: ReactNode;

		/**
		 * Indicates that the menu item is selected.
		 */
		isSelected?: boolean;

		/**
		 * If provided, the chevron icon (expand/collapse symbol) will be rendered within a separate
		 * icon button element. Clicking on this icon button will not trigger the `onClick` event. It
		 * will only expand or collapse the expandable.
		 *
		 * If a `href` is not provided, the chevron icon is rendered as part of the element.
		 */
		href?: string;

		// Not using the shared `MenuItemOnClick` type here as we need to support additional arguments (analyticsAttributes)
		/**
		 * Called when the user has clicked on the trigger content.
		 *
		 * __It is not called when the user clicks on the expand/collapse chevron icon button.__
		 * This is to differentiate a click that will only "expand" the menu item _without selecting it_,
		 * from a click to expand _and_ "select" or navigate to the menu item.
		 *
		 * If you need a callback for when the user expands or collapses the expandable, use
		 * `onExpansionToggle` on the `ExpandableMenuItem` component instead.
		 */
		onClick?: (
			event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
			analyticsEvent: UIAnalyticsEvent,
			analyticsAttributes: { isExpanded: boolean },
		) => void;
	};

/**
 * __ExpandableMenuItemTrigger__
 *
 * The trigger component for an `ExpandableMenuItem`. Interacting with it will expand or collapse the expandable.
 */
export const ExpandableMenuItemTrigger = forwardRef<
	HTMLButtonElement | HTMLAnchorElement,
	ExpandableMenuItemTriggerProps
>(
	(
		{
			actions,
			isSelected,
			href,
			elemBefore: providedElemBefore,
			elemAfter,
			actionsOnHover,
			onClick,
			children,
			testId,
			interactionName,
			isContentTooltipDisabled,
			visualContentRef,
			isDragging,
			hasDragIndicator,
			dropIndicator,
		},
		forwardedRef,
	) => {
		const id = useId();
		const onExpansionToggle = useOnExpansionToggle();
		const isExpanded = useIsExpanded();
		const setIsExpanded = useSetIsExpanded();
		const itemRef = useRef<HTMLDivElement>(null);

		const handleIconClick = useCallback(() => {
			onExpansionToggle?.(!isExpanded);
			setIsExpanded(!isExpanded);
		}, [isExpanded, onExpansionToggle, setIsExpanded]);

		const handleMenuContentClick = useCallback(
			(
				event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
				analyticsEvent: UIAnalyticsEvent,
			) => {
				const newValue = !isExpanded;
				onClick?.(event, analyticsEvent, { isExpanded: newValue });
				onExpansionToggle?.(newValue);
				setIsExpanded(newValue);
			},
			[onClick, onExpansionToggle, isExpanded, setIsExpanded],
		);

		const isSelectable = typeof href !== 'undefined';

		useScrollMenuItemIntoView({
			elementRef: itemRef,
			isSelected: Boolean(isSelectable && isSelected),
		});

		// Wrapped in an IconButton if the expandable menu item trigger is selectable
		const elemBefore = isSelectable ? (
			<IconButton
				icon={(iconProps) => (
					<ExpandableMenuItemIcon
						iconProps={iconProps}
						isExpanded={isExpanded}
						isSelected={isSelected}
						providedElemBefore={providedElemBefore}
					/>
				)}
				aria-expanded={isExpanded}
				// We are labelling the icon button using the containing menu item's content, to provide context to
				// screen readers on what will actually be expanded or collapsed. Screen readers will also use the
				// `aria-expanded` attribute to indicate the expanded state of the menu item.
				// We are not using the `aria-label` attribute here as it is not supported by the `IconButton` component.
				aria-labelledby={fg('platform_dst_expandable_menu_item_elembefore_label') ? id : undefined}
				// IconButton requires a label prop, however it will not be used by screen readers as we are setting
				// `aria-labelledby`, which will be used instead.
				label={
					fg('platform_dst_expandable_menu_item_elembefore_label')
						? ''
						: isExpanded
							? 'Collapse'
							: 'Expand'
				}
				appearance="subtle"
				spacing="compact"
				onClick={handleIconClick}
				interactionName={interactionName}
				testId={testId ? `${testId}--elem-before-button` : undefined}
			/>
		) : (
			<ExpandableMenuItemIcon
				isExpanded={isExpanded}
				isSelected={isSelected}
				providedElemBefore={providedElemBefore}
			/>
		);

		// For expandable menu items, we shouldn't wrap in a `li` here. The `li` is instead at a higher level (`ExpandableMenuItem`), grouping the expandable menu item trigger and its content
		return (
			<div
				css={[wrapperStyles.root, providedElemBefore && wrapperStyles.showProvidedElemBefore]}
				ref={itemRef}
			>
				<MenuItemBase
					id={id}
					actions={actions}
					actionsOnHover={actionsOnHover}
					elemBefore={elemBefore}
					ariaExpanded={isExpanded}
					elemAfter={elemAfter}
					href={href}
					isSelected={isSelected}
					onClick={handleMenuContentClick}
					ref={forwardedRef}
					visualContentRef={visualContentRef}
					testId={testId}
					interactionName={interactionName}
					isContentTooltipDisabled={isContentTooltipDisabled}
					isDragging={isDragging}
					hasDragIndicator={hasDragIndicator}
					dropIndicator={dropIndicator}
				>
					{children}
				</MenuItemBase>
			</div>
		);
	},
);

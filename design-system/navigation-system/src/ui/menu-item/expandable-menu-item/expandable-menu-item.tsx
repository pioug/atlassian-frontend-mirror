/**
 * @jsxFrag
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, type ReactNode } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import useControlled from '@atlaskit/ds-lib/use-controlled';

import { MenuListItem } from '../menu-list-item';

import {
	IsExpandedContext,
	OnExpansionToggleContext,
	SetIsExpandedContext,
} from './expandable-menu-item-context';

export type ExpandableMenuItemProps = {
	/**
	 * The controlled expanded state of the menu item. Allows you to control the expanded state of
	 * the menu item externally.
	 *
	 * If you are controlling the state, you should update your state using `onExpansionToggle`.
	 */
	isExpanded?: boolean;
	/**
	 * The default expanded state of the menu item.
	 *
	 * You can use this to set the default expanded state without needing to entirely control the state.
	 */
	isDefaultExpanded?: boolean;
	/**
	 * Called when the user has interacted with the menu item to expand or collapse it.
	 *
	 * It is not called when the `isExpanded` controlled state prop is changed.
	 *
	 * If you are controlling the expanded state, you should use this callback to update your state.
	 */
	onExpansionToggle?: (isExpanded: boolean) => void;
	/**
	 * Should contain `ExpandableMenuItemTrigger` and `ExpandableMenuItemContent`.
	 */
	children: ReactNode;

	/**
	 * A slot to render a drop indicator on an entire menu item (trigger + content).
	 *
	 * This should only be used when the **whole `ExpandableMenuItem` is a drop target**,
	 * and not when only the `ExpandableMenuItemTrigger` is a drop target.
	 */
	dropIndicator?: ReactNode;
};

const relativeStyles = cssMap({
	root: {
		position: 'relative',
	},
});

/**
 * __ExpandableMenuItem__
 *
 * A composable component for nested menu items that can be revealed and hidden by interacting witih the parent menu item.
 *
 * Follows the [disclosure pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/).
 *
 * Should be used with `ExpandableMenuItemTrigger` as the parent menu item, and children menu items should be wrapped in a `ExpandableMenuItemContent`.
 *
 * Usage example:
 * ```jsx
 * <ExpandableMenuItem>
 *   <ExpandableMenuItemTrigger>Parent menu item</ExpandableMenuItemTrigger>
 *   <ExpandableMenuItemContent>
 *     <ButtonMenuItem>Item 1</ButtonMenuItem>
 *     <ButtonMenuItem>Item 2</ButtonMenuItem>
 *   </ExpandableMenuItemContent>
 * </ExpandableMenuItem>
 * ```
 */
export const ExpandableMenuItem = forwardRef<HTMLDivElement, ExpandableMenuItemProps>(
	(
		{
			isExpanded: isExpandedControlled,
			isDefaultExpanded = false,
			onExpansionToggle,
			children,
			dropIndicator,
		},
		forwardedRef,
	) => {
		const [isExpanded, setIsExpanded] = useControlled(
			isExpandedControlled,
			() => isDefaultExpanded,
		);

		return (
			<IsExpandedContext.Provider value={isExpanded}>
				<SetIsExpandedContext.Provider value={setIsExpanded}>
					<OnExpansionToggleContext.Provider value={onExpansionToggle ?? null}>
						{/* Wrapping in a `li` to group all the composable elements together, as part of the disclosure pattern */}
						<MenuListItem ref={forwardedRef}>
							{/* Adding `position:relative` only when it's needed by the drop indicator */}
							<div css={[dropIndicator && relativeStyles.root]}>
								{children}
								{dropIndicator}
							</div>
						</MenuListItem>
					</OnExpansionToggleContext.Provider>
				</SetIsExpandedContext.Provider>
			</IsExpandedContext.Provider>
		);
	},
);

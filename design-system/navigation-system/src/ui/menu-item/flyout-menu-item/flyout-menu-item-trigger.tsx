/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, type ReactNode } from 'react';

import { cssMap, jsx } from '@compiled/react';

import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import { PopupTrigger } from '@atlaskit/popup/experimental';
import { token } from '@atlaskit/tokens';

import { MenuItemBase } from '../menu-item';
import { type COLLAPSE_ELEM_BEFORE_TYPE } from '../menu-item-signals';
import type { MenuItemCommonProps, MenuItemOnClick } from '../types';

const elemAfterStyles = cssMap({
	root: {
		paddingInline: token('space.075'),
		// Flip the chevron icon when the direction is right-to-left
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'[dir="rtl"] &': {
			transform: 'scaleX(-1)',
		},
	},
});

export type FlyoutMenuItemTriggerProps = MenuItemCommonProps & {
	/**
	 * `ReactNode` to be placed visually before the `children`.
	 *
	 * This `ReactNode` will be rendered visually on top of the main
	 * interactive element for the menu item. If this element does not
	 * contain an interactive element (`button` or `a`) then `pointer-events`
	 * will be set to `none` on this slot so that users can click through
	 * this element onto the main interactive element of the menu item.
	 *
	 * If you want to collapse the `elemBefore` so it takes up no space,
	 * then pass in the `COLLAPSE_ELEM_BEFORE` symbol. Keep in mind that
	 * collapsing the `elemBefore` can break visual alignment and
	 * will make it difficult for users to visually distinguish levels
	 * in the side navigation.
	 *
	 * @example
	 *
	 * ```tsx
	 * <FlyoutMenuItemTrigger elemBefore={<HomeIcon label="home" />}>Home</FlyoutMenuItemTrigger>
	 *
	 * // collapse the elemBefore
	 * <FlyoutMenuItemTrigger elemBefore={COLLAPSE_ELEM_BEFORE}>Home</FlyoutMenuItemTrigger>
	 * ```
	 */
	elemBefore?: ReactNode | COLLAPSE_ELEM_BEFORE_TYPE;

	/**
	 * Called when the user has clicked on the trigger.
	 *
	 * If you are controlling the open state of the flyout menu, use this to update your state.
	 */
	onClick?: MenuItemOnClick<HTMLButtonElement>;

	/**
	 * Indicates that the menu item is selected.
	 */
	isSelected?: boolean;
};

/**
 * __FlyoutMenuItemTrigger__
 *
 * The button that toggles the flyout menu.
 */
export const FlyoutMenuItemTrigger = forwardRef<HTMLButtonElement, FlyoutMenuItemTriggerProps>(
	(
		{
			children,
			elemBefore,
			onClick,
			isSelected,
			interactionName,
			testId,
			isContentTooltipDisabled,
			visualContentRef,
			isDragging,
			hasDragIndicator,
			dropIndicator,
		},
		forwardedRef,
	) => (
		<PopupTrigger>
			{({
				ref,
				'aria-controls': ariaControls,
				'aria-expanded': ariaExpanded,
				'aria-haspopup': ariaHasPopup,
			}) => (
				<MenuItemBase
					testId={testId}
					ref={mergeRefs([ref, forwardedRef])}
					visualContentRef={visualContentRef}
					elemBefore={elemBefore}
					elemAfter={
						<div css={elemAfterStyles.root}>
							<ChevronRightIcon label="" color={token('color.icon')} size="small" />
						</div>
					}
					onClick={onClick}
					ariaControls={ariaControls}
					ariaExpanded={ariaExpanded}
					ariaHasPopup={ariaHasPopup}
					interactionName={interactionName}
					isContentTooltipDisabled={isContentTooltipDisabled}
					isSelected={isSelected}
					isDragging={isDragging}
					hasDragIndicator={hasDragIndicator}
					dropIndicator={dropIndicator}
				>
					{children}
				</MenuItemBase>
			)}
		</PopupTrigger>
	),
);

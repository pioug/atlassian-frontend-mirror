/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, type ReactNode, useCallback, useContext } from 'react';

import { cssMap, jsx } from '@compiled/react';

import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import ChevronRightIcon from '@atlaskit/icon/core/chevron-right';
import { fg } from '@atlaskit/platform-feature-flags';
import { PopupTrigger } from '@atlaskit/popup/experimental';
import { token } from '@atlaskit/tokens';

import { MenuItemBase } from '../menu-item';
import { type COLLAPSE_ELEM_BEFORE_TYPE } from '../menu-item-signals';
import type { MenuItemCommonProps, MenuItemOnClick } from '../types';

import { IsOpenContext, OnCloseContext } from './flyout-menu-item-context';

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
};

/**
 * __FlyoutMenuItemTrigger__
 *
 * The button that toggles the flyout menu.
 */
export const FlyoutMenuItemTrigger: React.ForwardRefExoticComponent<
	React.PropsWithoutRef<FlyoutMenuItemTriggerProps> & React.RefAttributes<HTMLButtonElement>
> = forwardRef<HTMLButtonElement, FlyoutMenuItemTriggerProps>(
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
	) => {
		const isOpen = useContext(IsOpenContext);
		const onCloseRef = useContext(OnCloseContext);

		const handleClick = useCallback(
			(event: React.MouseEvent<HTMLButtonElement>, analyticsEvent: UIAnalyticsEvent) => {
				// If the flyout is open and the trigger is clicked, close the flyout and call the onClick
				// handler with the source information set to 'outside-click'.
				if (fg('platform_dst_nav4_flyout_menu_slots_close_button')) {
					if (isOpen && onCloseRef.current) {
						onCloseRef.current(event, 'outside-click');
					}
				}

				onClick?.(event, analyticsEvent);
			},
			[isOpen, onCloseRef, onClick],
		);

		return (
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
								<ChevronRightIcon label="" color="currentColor" size="small" />
							</div>
						}
						onClick={handleClick}
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
		);
	},
);

/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type Ref, useMemo, useRef } from 'react';

import type { RouterLinkComponentProps } from '@atlaskit/app-provider';
import { cssMap, jsx } from '@atlaskit/css';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';

import { forwardRefWithGeneric } from '../../components/forward-ref-with-generic';
import { ListItem } from '../../components/list-item';

import { MenuItemBase } from './menu-item';
import type { MenuItemLinkOrButtonCommonProps, MenuItemOnClick } from './types';
import { useScrollMenuItemIntoView } from './use-scroll-menu-item-into-view';

const listItemStyles = cssMap({
	root: {
		/**
		 * Setting a large scroll margin to prevent _horizontally_ scrolling the selected menu item into view.
		 * `scrollIntoView` will scroll on both axes and does not allow completely opting out of scrolling for a particular axis.
		 *
		 * We have specifically chosen to prevent horizontal scrolling as deeply nested menu items are not a common use case, and
		 * horizontal scrolling can cause the the sidebar to look inconsistent on load.
		 *
		 * We are using a large static value to here to handle all realistic nesting levels. As an alternative we could dynamically
		 * calculate this based on the current nesting level, but it isn't necessary and would be a performance hit.
		 */
		scrollMarginInline: '1000px',
	},
});

export type LinkMenuItemProps<RouterLinkConfig extends Record<string, any> = never> =
	MenuItemLinkOrButtonCommonProps &
		RouterLinkComponentProps<RouterLinkConfig> & {
			/**
			 * The native `target` attribute for the anchor element.
			 */
			target?: HTMLAnchorElement['target'];
			/**
			 * Whether the menu item is selected.
			 */
			isSelected?: boolean;

			/**
			 * Called when the user has clicked on the trigger content.
			 */
			onClick?: MenuItemOnClick<HTMLAnchorElement>;
		};

const LinkMenuItemNoRef = <RouterLinkConfig extends Record<string, any> = never>(
	{
		testId,
		actions,
		children,
		description,
		elemAfter,
		elemBefore,
		href,
		target,
		actionsOnHover,
		isSelected,
		onClick,
		interactionName,
		isContentTooltipDisabled,
		visualContentRef,
		listItemRef,
		isDragging,
		hasDragIndicator,
		dropIndicator,
	}: LinkMenuItemProps<RouterLinkConfig>,
	forwardedRef?: Ref<HTMLAnchorElement>,
) => {
	const itemRef = useRef<HTMLDivElement>(null);

	useScrollMenuItemIntoView({
		elementRef: itemRef,
		isSelected: isSelected ?? false,
	});

	const ref = useMemo(() => {
		return mergeRefs([itemRef, listItemRef ?? null]);
	}, [itemRef, listItemRef]);

	return (
		<ListItem ref={ref} xcss={listItemStyles.root}>
			<MenuItemBase
				testId={testId}
				description={description}
				actions={actions}
				elemAfter={elemAfter}
				// TODO Always use "open in new window" icon when `openInNewWindow` prop is true
				elemBefore={elemBefore}
				href={href}
				target={target}
				actionsOnHover={actionsOnHover}
				isSelected={isSelected}
				onClick={onClick}
				ref={forwardedRef}
				visualContentRef={visualContentRef}
				interactionName={interactionName}
				isContentTooltipDisabled={isContentTooltipDisabled}
				isDragging={isDragging}
				hasDragIndicator={hasDragIndicator}
				dropIndicator={dropIndicator}
			>
				{children}
			</MenuItemBase>
		</ListItem>
	);
};

/**
 * LinkMenuItem
 *
 * A menu item link. It should be used within a `ul`.
 */
export const LinkMenuItem = forwardRefWithGeneric(LinkMenuItemNoRef);

/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { css, jsx } from '@compiled/react';
import { bind } from 'bind-event-listener';

import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { type IconButtonProps } from '@atlaskit/button/new';
import { type NewCoreIconProps } from '@atlaskit/icon';
import SidebarCollapseIcon from '@atlaskit/icon/core/sidebar-collapse';
import SidebarExpandIcon from '@atlaskit/icon/core/sidebar-expand';
import { fg } from '@atlaskit/platform-feature-flags';

import { IconButton } from '../../top-nav-items/themed/migration';

import {
	SideNavToggleButtonAttachRef,
	SideNavToggleButtonSlotContext,
} from './toggle-button-context';
import { useSideNavVisibility } from './use-side-nav-visibility';
import { useToggleSideNav } from './use-toggle-side-nav';

export type SideNavVisibilityChangeAnalyticsAttributes = {
	isSideNavVisible: boolean;
};

const toggleButtonTooltipOptions: IconButtonProps['tooltip'] = {
	// We're disabling pointer events on the tooltip to prevent it from blocking mouse events, so that the side nav flyout stays open
	// when moving the mouse from the top bar to the side nav.
	ignoreTooltipPointerEvents: true,
};

// For duplicate "mouseenter" issue when changing icons (see below)
const silentIconStyles = css({
	// So we don't mess up any flex logic inside of button
	display: 'contents',
	// Don't let movement over icons be relevant for events
	pointerEvents: 'none',
});

/**
 * Wrapper styles to align the toggle button to the end of `TopNavStart`
 * when FHS is expanded.
 */
const fullHeightSidebarExpandedWrapperStyles = css({
	'@media (min-width: 64rem)': {
		marginInlineStart: 'auto',
	},
});

/**
 * __SideNavToggleButton__
 *
 * Button for toggling the side nav. It should be used in the top bar.
 */
export const SideNavToggleButton = ({
	defaultCollapsed = false,
	expandLabel,
	collapseLabel,
	testId,
	interactionName,
	onClick,
	shortcut,
}: {
	/**
	 * @deprecated
	 *
	 * This prop is being replaced by `defaultSideNavCollapsed` on the `Root` element,
	 * and will be removed after `platform_dst_nav4_full_height_sidebar_api_changes` is cleaned up.
	 *
	 * ---
	 *
	 * Whether the side nav should be collapsed by default __on desktop screens__.
	 *
	 * It is always collapsed by default for mobile screens.
	 *
	 * __Note:__ If using this prop, ensure that it is also provided to the `SideNav` slot.
	 * This is to ensure the state is in sync before post-SSR hydration.
	 */
	defaultCollapsed?: boolean;
	/**
	 * The label when the toggle button will expand the side nav.
	 */
	expandLabel: React.ReactNode;
	/**
	 * The label when the toggle button will collapse the side nav.
	 */
	collapseLabel: React.ReactNode;
	/**
	 * A unique string that appears as data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
	 */
	testId?: string;
	/**
	 * An optional name used to identify events for [React UFO (Unified Frontend Observability) press interactions](https://developer.atlassian.com/platform/ufo/react-ufo/react-ufo/getting-started/#quick-start--press-interactions). For more information, see [React UFO integration into Design System components](https://go.atlassian.com/react-ufo-dst-integration).
	 */
	interactionName?: string;
	/**
	 * The callback function that is called when the toggle button is clicked.
	 */
	onClick?: (
		e: React.MouseEvent<HTMLElement>,
		analyticsEvent: UIAnalyticsEvent,
		attributes?: SideNavVisibilityChangeAnalyticsAttributes,
	) => void;
	/**
	 * Display a keyboard shortcut in the tooltip.
	 * Only used if the `platform-dst-tooltip-shortcuts` feature flag is enabled.
	 * Note this does not handle the keyboard shortcut functionality, it only displays the shortcut in the tooltip.
	 */
	shortcut?: string[];
}) => {
	const {
		isExpandedOnDesktop: isSideNavExpandedOnDesktop,
		isExpandedOnMobile: isSideNavExpandedOnMobile,
	} = useSideNavVisibility({ defaultCollapsed });

	// When `platform_dst_nav4_full_height_sidebar_api_changes` is enabled,
	// we default to the desktop state for SSR
	const [isSideNavExpanded, setIsSideNavExpanded] = useState<boolean>(
		fg('platform_dst_nav4_full_height_sidebar_api_changes')
			? isSideNavExpandedOnDesktop
			: !defaultCollapsed,
	);

	const ref = useContext(SideNavToggleButtonAttachRef);
	const elementRef = useRef(null);

	useEffect(() => {
		if (fg('platform_fix_component_state_update_for_suspense')) {
			ref(elementRef.current);
		}
	}, [elementRef, ref]);

	useEffect(() => {
		const { matches } = window.matchMedia('(min-width: 64rem)');
		setIsSideNavExpanded(matches ? isSideNavExpandedOnDesktop : isSideNavExpandedOnMobile);
	}, [isSideNavExpandedOnDesktop, isSideNavExpandedOnMobile]);

	useEffect(() => {
		// When screen size changes, ensure we use the correct visibility state
		const mediaQueryList = window.matchMedia('(min-width: 64rem)');
		return bind(mediaQueryList, {
			type: 'change',
			listener() {
				setIsSideNavExpanded(
					mediaQueryList.matches ? isSideNavExpandedOnDesktop : isSideNavExpandedOnMobile,
				);
			},
		});
	}, [isSideNavExpandedOnDesktop, isSideNavExpandedOnMobile]);

	const toggleVisibility = useToggleSideNav({ trigger: 'toggle-button' });

	const handleClick = useCallback(
		(event: React.MouseEvent<HTMLButtonElement>, analyticsEvent: UIAnalyticsEvent) => {
			onClick?.(event, analyticsEvent, { isSideNavVisible: isSideNavExpanded });

			toggleVisibility();
		},
		[onClick, toggleVisibility, isSideNavExpanded],
	);

	/**
	 * ## Behaviour
	 * It is intentional that collapse icon will be used while the flyout is open.
	 * The icon is tied to the expanded / collapse state, and not the flyout state.
	 *
	 * ## Why a function?
	 * Unfortunately, changing the icon inside an <IconButton> when the user is over
	 * the button will cause the svg element to be replaced, which can trigger a
	 * "mouseenter" event. This is problematic when the user is already over the button,
	 * as it can result in a "mouseenter" event after the user manually entered the button.
	 *
	 * `icon` accepts a function for the `icon` prop (ie a render prop), so we don't need to
	 * memoize it, or pull it out into a new function
	 */
	const icon = (props: NewCoreIconProps) => (
		<span css={silentIconStyles}>
			{isSideNavExpanded ? <SidebarCollapseIcon {...props} /> : <SidebarExpandIcon {...props} />}
		</span>
	);

	const tooltipProps = useMemo(() => {
		if (fg('platform-dst-tooltip-shortcuts')) {
			return {
				...toggleButtonTooltipOptions,
				shortcut,
			};
		}

		return toggleButtonTooltipOptions;
	}, [shortcut]);

	const iconButton = (
		<IconButton
			appearance="subtle"
			label={isSideNavExpanded ? collapseLabel : expandLabel}
			icon={icon}
			onClick={handleClick}
			testId={testId}
			isTooltipDisabled={false}
			interactionName={interactionName}
			ref={fg('platform_fix_component_state_update_for_suspense') ? elementRef : ref}
			tooltip={tooltipProps}
		/>
	);

	const isInsideSlot = useContext(SideNavToggleButtonSlotContext);

	// Checking `isInsideSlot` in case an app isn't using the slot
	// We don't want to break existing non-slot usage with the left margin
	// This check can be removed in the future, after slot is required for a while.
	if (isInsideSlot && fg('navx-full-height-sidebar')) {
		return (
			// Wrapper is to align the button to the end when FHS is expanded
			<div css={isSideNavExpandedOnDesktop && fullHeightSidebarExpandedWrapperStyles}>
				{iconButton}
			</div>
		);
	}

	return iconButton;
};

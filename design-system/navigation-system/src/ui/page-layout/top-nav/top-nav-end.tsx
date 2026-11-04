/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useState } from 'react';

// Compiled supports the inherited container-layout widths outside @atlaskit/css's bounded values.
import { cssMap, cx, jsx } from '@compiled/react';

import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import { useLayoutEffect } from '@atlaskit/ds-lib/use-layout-effect';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';
import { OpenLayerObserverNamespaceProvider } from '@atlaskit/layering/open-layer-observer-namespace-provider';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { Popup } from '@atlaskit/popup/popup';
import { UNSAFE_useMediaQuery as useMediaQuery } from '@atlaskit/primitives/compiled/use-media-query';
import { token } from '@atlaskit/tokens';

import { List } from '../../../components/list';
import { HasCustomThemeContext } from '../../top-nav-items/themed/has-custom-theme-context';
import { IconButton } from '../../top-nav-items/themed/icon-button';
import { openLayerObserverTopNavEndNamespace } from '../constants';
import { useTopNavBreakpoints } from './use-top-nav-breakpoints';
import { useTopNavEndFocus } from './use-top-nav-end-focus';

const containerStyles = cssMap({
	focusScope: {
		// Capture owned React portals without adding a flex item or changing gaps.
		display: 'contents',
	},
	root: {
		gridColumn: 3,
		display: 'flex',
		justifyContent: 'end',
		// Used for SSR to keep space for the dropdown to be rendered into
		minWidth: '32px',
		// Sets a minimum width on the column so that it matches TopNavStart
		// TopNavStart has this so that the search aligns with the side nav
	},
	withPersistentItems: {
		alignItems: 'center',
		// Separate persistent chat from Profile (or the mobile overflow button).
		gap: token('space.100'),
	},
	container: {
		width: 'var(--n_tnSideWidth, auto)',
		minWidth: 'var(--n_tnEndMinWidth, 32px)',
		boxSizing: 'border-box',
		justifySelf: 'end',
		'@media (min-width: 48rem)': {
			minWidth: 'var(--n_tnEndMinWidth, max-content)',
		},
		'@media (min-width: 64rem)': {
			width: 'var(--n_tnSideWidth, max-content)',
			minWidth: 'var(--n_tnEndMinWidth, 330px)',
		},
	},
	viewport: {
		'@media (min-width: 48rem)': {
			/**
			 * We set `minWidth: '32px'` to prevent reflow on mobile when the 'more menu' appears
			 * after SSR hydration.
			 *
			 * We need to override this for desktop size screens to prevent the grid column from
			 * getting crushed, causing the content to overflow and overlap the middle column.
			 *
			 * This is because the `minWidth: '32px'` makes the grid layout think it is okay
			 * to shrink this column to that size, even if the actual content is wider.
			 *
			 * Using `max-content` instead of `min-content` because `min-content` is the width with
			 * text wrapped (if allowed to). This was causing problems with edition awareness buttons.
			 */
			minWidth: 'max-content',
		},
		'@media (min-width: 64rem)': {
			// Intrinsic width of content without wrapping
			// The actual grid column can still be larger
			width: 'max-content',
			// See `TopNavStart` for how the `330px` is derived
			// Jira product logo update, added 30px for CSM logo as the size is larger than the default
			// https://jplat.atlassian.net/browse/BLU-8440
			minWidth: '330px',
			// We want the specified width to be inclusive of padding
			boxSizing: 'border-box',
			// The grid column can be larger than the content
			// So we need to justify the content to the end of the column
			justifySelf: 'end',
		},
	},
});

const listStyles = cssMap({
	root: {
		alignItems: 'center',
		gap: token('space.050'),
		display: 'flex',
	},
	container: {
		// Hide the server-rendered inline actions before hydration on compact navs.
		display: 'var(--n_tnActionsDisplay, none)',
		'@media (min-width: 48rem)': {
			display: 'var(--n_tnActionsDisplay, flex)',
		},
	},
	hideOnSmallViewport: {
		// Hiding on small viewports (needed for SSR)
		// Once JS ticks in on the client, the list won't be rendered.
		display: 'none',
		'@media (min-width: 48rem)': {
			display: 'flex',
		},
	},
	popupContainer: {
		// TODO (AFB-874): Disabling due to failing type check
		// eslint-disable-next-line @atlaskit/platform/expand-spacing-shorthand
		padding: token('space.100'),
	},
});

/**
 * __TopNavEnd__
 *
 * Wrapper for the top navigation actions on the inline-end (right) side of the top navigation.
 *
 * On small viewports, the children will be placed inside a popup, and a button will be rendered to open the popup.
 * This is to prevent the actions from overflowing the top navigation.
 */
export function TopNavEnd({
	children,
	persistentItems,
	label = 'Actions',
	showMoreButtonLabel = 'Show more',
}: {
	/**
	 * The content of the layout area.
	 *
	 * Should contain top nav end item components like `Notifications`, `Help`, `LogIn` etc.
	 */
	children: React.ReactNode;
	/**
	 * Actions at the inline end, after the other actions or their overflow button,
	 * that stay in the top nav at every viewport size outside the overflow popup.
	 * Separated from the other actions by 8px; spacing within those actions remains 4px.
	 * Items stay mounted when the viewport changes. Consumers must ensure
	 * that this content fits on small screens. Supply complete accessible groups
	 * (lists containing list items), and hide each group at its outermost element
	 * so hidden or absent actions do not leave empty lists or spacing behind.
	 * Enabled behind `platform-dst-chat-panel-layout`.
	 */
	persistentItems?: React.ReactNode;
	/**
	 * Provide an accessible label, often used by screen readers.
	 */
	label?: string;
	/**
	 * The label for the show more button.
	 */
	showMoreButtonLabel?: string;
}): JSX.Element {
	const breakpoints = useTopNavBreakpoints();
	const hasContainerBreakpoints = breakpoints != null;
	const hasPersistentItems = fg('platform-dst-chat-panel-layout') && persistentItems != null;
	const [isOpen, setIsOpen] = useState<boolean>(false);
	// Always setting to `false` for the initial render (will flip in an effect for mobile)
	const [isMobileViewport, setIsMobileViewport] = useState<boolean>(false);
	// Note: `query` is a stable value between renders
	const query = useMediaQuery('below.sm', function onChange(event) {
		setIsMobileViewport(event.matches);
		// Container mode closes only when the effective layout changes below.
		// Keep the existing viewport behavior outside the rollout / provider.
		if (fg('platform-dst-chat-panel-layout')) {
			if (!hasContainerBreakpoints) {
				setIsOpen(false);
			}
		} else {
			setIsOpen(false);
		}
	});

	useLayoutEffect(() => {
		// The default is `false`, and desktop will remain as `false` (no re-render).
		// Mobile will flip from `false` to `true`.
		setIsMobileViewport(query?.matches ?? false);
	}, [query]);

	const isMobile = breakpoints?.belowSm ?? isMobileViewport;
	const { actionsRef, triggerRef, onFocusCapture } = useTopNavEndFocus({
		isMobile,
		enabled: fg('platform-dst-chat-panel-layout'),
	});
	useLayoutEffect(() => {
		if (fg('platform-dst-chat-panel-layout') && hasContainerBreakpoints) {
			setIsOpen(false);
		}
	}, [isMobile, hasContainerBreakpoints]);

	// The shared provider also covers the mobile overflow popup itself. Keep the
	// previous content-only namespace coverage when the layout gate is disabled.
	// The observer is not used when the top-layer gate is on, so no provider is needed.
	const actions =
		fg('platform-dst-chat-panel-layout') || fg('platform-dst-top-layer') ? (
			children
		) : (
			<OpenLayerObserverNamespaceProvider namespace={openLayerObserverTopNavEndNamespace}>
				{children}
			</OpenLayerObserverNamespaceProvider>
		);

	const regularActions = isMobile ? (
		<Popup
			isOpen={isOpen}
			onClose={() => setIsOpen(false)}
			// Top-layer popups need a role to register as a popup with the layer observer.
			role={fg('platform-dst-chat-panel-layout') ? 'dialog' : undefined}
			label={fg('platform-dst-chat-panel-layout') ? label : undefined}
			placement="bottom-start"
			shouldRenderToParent
			content={() => (
				<HasCustomThemeContext.Provider value={false}>
					<List ref={actionsRef} xcss={cx(listStyles.root, listStyles.popupContainer)}>
						{actions}
					</List>
				</HasCustomThemeContext.Provider>
			)}
			trigger={(triggerProps) => (
				<IconButton
					{...triggerProps}
					ref={
						fg('platform-dst-chat-panel-layout')
							? mergeRefs([triggerProps.ref, triggerRef])
							: triggerProps.ref
					}
					label={showMoreButtonLabel}
					isSelected={isOpen}
					onClick={() => setIsOpen(!isOpen)}
					icon={ShowMoreHorizontalIcon}
					isTooltipDisabled={false}
				/>
			)}
		/>
	) : (
		<List
			ref={actionsRef}
			xcss={cx(
				listStyles.root,
				fg('platform-dst-chat-panel-layout')
					? listStyles.container
					: listStyles.hideOnSmallViewport,
			)}
		>
			{actions}
		</List>
	);

	const content = (
		<nav
			aria-label={label}
			css={[
				containerStyles.root,
				fg('platform-dst-chat-panel-layout') ? containerStyles.container : containerStyles.viewport,
				hasPersistentItems && containerStyles.withPersistentItems,
			]}
		>
			{fg('platform-dst-chat-panel-layout') ? (
				<div css={containerStyles.focusScope} onFocusCapture={onFocusCapture}>
					{regularActions}
				</div>
			) : (
				regularActions
			)}
			{hasPersistentItems && persistentItems}
		</nav>
	);

	return fg('platform-dst-chat-panel-layout') && !fg('platform-dst-top-layer') ? (
		<OpenLayerObserverNamespaceProvider namespace={openLayerObserverTopNavEndNamespace}>
			{content}
		</OpenLayerObserverNamespaceProvider>
	) : (
		content
	);
}

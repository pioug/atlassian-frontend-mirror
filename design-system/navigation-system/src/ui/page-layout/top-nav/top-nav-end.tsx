/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useState } from 'react';

import { cx, jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { useLayoutEffect } from '@atlaskit/ds-lib/use-layout-effect';
import ShowMoreHorizontalIcon from '@atlaskit/icon/core/show-more-horizontal';
import Popup from '@atlaskit/popup';
import { UNSAFE_useMediaQuery as useMediaQuery } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

import { List } from '../../../components/list';
import { HasCustomThemeContext } from '../../top-nav-items/themed/has-custom-theme-context';
import { IconButton } from '../../top-nav-items/themed/migration';

const containerStyles = cssMap({
	root: {
		gridColumn: 3,
		display: 'flex',
		justifyContent: 'end',
		// Used for SSR to keep space for the dropdown to be rendered into
		minWidth: '32px',
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
		// Sets a minimum width on the column so that it matches TopNavStart
		// TopNavStart has this so that the search aligns with the side nav
		'@media (min-width: 64rem)': {
			// Intrinsic width of content without wrapping
			// The actual grid column can still be larger
			width: 'max-content',
			// See `TopNavStart` for how the `300px` is derived
			minWidth: '300px',
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
	 * Provide an accessible label, often used by screen readers.
	 */
	label?: string;
	/**
	 * The label for the show more button.
	 */
	showMoreButtonLabel?: string;
}) {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	// Always setting to `false` for the initial render (will flip in an effect for mobile)
	const [isMobile, setIsMobile] = useState<boolean>(false);
	// Note: `query` is a stable value between renders
	const query = useMediaQuery('below.sm', function onChange(event) {
		setIsMobile(event.matches);
		// Any time we shift between mobile and desktop
		// We always close the popup
		setIsOpen(false);
	});

	useLayoutEffect(() => {
		// The default is `false`, and desktop will remain as `false` (no re-render).
		// Mobile will flip from `false` to `true`.
		setIsMobile(query?.matches ?? false);
	}, [query]);

	return (
		<nav aria-label={label} css={containerStyles.root}>
			{isMobile ? (
				<Popup
					isOpen={isOpen}
					onClose={() => setIsOpen(false)}
					placement="bottom-start"
					shouldRenderToParent
					content={() => (
						<HasCustomThemeContext.Provider value={false}>
							<List xcss={cx(listStyles.root, listStyles.popupContainer)}>{children}</List>
						</HasCustomThemeContext.Provider>
					)}
					trigger={(triggerProps) => (
						<IconButton
							{...triggerProps}
							label={showMoreButtonLabel}
							isSelected={isOpen}
							onClick={() => setIsOpen(!isOpen)}
							icon={ShowMoreHorizontalIcon}
							isTooltipDisabled={false}
						/>
					)}
				/>
			) : (
				<List xcss={cx(listStyles.root, listStyles.hideOnSmallViewport)}>{children}</List>
			)}
		</nav>
	);
}

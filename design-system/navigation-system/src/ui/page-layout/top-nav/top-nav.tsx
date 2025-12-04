/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useContext, useMemo } from 'react';

import { cssMap, jsx } from '@compiled/react';

import type { StrictXCSSProp } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import { useSkipLink } from '../../../context/skip-links/skip-links-context';
import { useIsFhsEnabled } from '../../fhs-rollout/use-is-fhs-enabled';
import { type CustomTheme } from '../../top-nav-items/themed/get-custom-theme-styles';
import { HasCustomThemeContext } from '../../top-nav-items/themed/has-custom-theme-context';
import { useCustomTheme } from '../../top-nav-items/themed/use-custom-theme';
import {
	bannerMountedVar,
	localSlotLayers,
	topNavMountedVar,
	UNSAFE_topNavVar,
} from '../constants';
import { DangerouslyHoistSlotSizes } from '../hoist-slot-sizes-context';
import { DangerouslyHoistCssVarToDocumentRoot, HoistCssVarToLocalGrid } from '../hoist-utils';
import { useLayoutId } from '../id-utils';
import { useSideNavVisibility } from '../side-nav/use-side-nav-visibility';
import type { CommonSlotProps } from '../types';

/**
 * Styles for the container for the top nav items.
 *
 * The background and border are applied to a different element for z-indexing reasons:
 *
 * - The items sit above the expanded side nav
 * - The background sits below the expanded side nav
 */
const styles = cssMap({
	root: {
		gridArea: 'top-bar',
		display: 'grid',
		// For small viewports the top bar sets the center grid item to take up as much space as possible.
		gridTemplateColumns: 'auto 1fr auto',
		paddingInline: token('space.150'),
		gap: token('space.100'),
		alignItems: 'center',
		backgroundColor: token('elevation.surface'),
		boxSizing: 'border-box',
		borderBlockEnd: `${token('border.width')} solid ${token('color.border')}`,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		height: `var(${topNavMountedVar})`,
		// This sets the sticky point to be just below banner. It's needed to ensure the stick
		// point is exactly where this element is rendered to with no wiggle room. Unfortunately the CSS
		// spec for sticky doesn't support "stick to where I'm initially rendered" so we need to tell it.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		insetBlockStart: `var(${bannerMountedVar}, 0px)`,
		position: 'sticky',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		zIndex: localSlotLayers.topBar,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		' > span[data-ep-placeholder-id="top_navigation_skeleton"]': {
			// TODO: BLU-3336 This is needed as a workaround for the JIRA issue (it places a placeholder span as a direct child of TopNav which breaks the grid layout). Please remove when the proper fix is applied.
			// We get the span that is immediately nested under TopNav and ignore how it affects the layout. We do this so our Grid layout ignores the `span` and applies to it's children.
			// This is only applicable to the JIRA pages that use EntryPoint such as /jira/projects or /jira/software/projects/.../calendar
			display: 'contents',
		},
		// The layout switches at the same breakpoint as when the search bar becomes an icon button.
		'@media (min-width: 48rem)': {
			// Using `1fr` for the left and right columns allows them to stay equal for as long as possible
			// There is another grid layout in `TopNavMiddle` that allows the middle column to grow and shrink in a constrained way
			gridTemplateColumns: '1fr minmax(min-content, max-content) 1fr',
		},
	},
	fullHeightSidebar: {
		// We don't want start padding, because `TopNavStart` has exactly the same width as the side nav. If we had padding it would be misaligned.
		// We can't have end padding if there is no start padding, otherwise the top nav middle items become lopsided. We need to apply the end padding inside of `TopNavEnd` instead.
		// Avoiding use of `paddingInlineStart` and `paddingInlineEnd` separately to workaround Compiled selector ordering bugs.
		// We can safely use them though once we clean up the non-FHS `paddingInline` style (or don't apply it when FHS is enabled)
		paddingInline: token('space.0'),

		// The background and border are now on a sibling element for layering reasons
		backgroundColor: 'none',
		borderBlockEnd: 'none',
		// Pointer events are disabled so the side nav panel splitter remains interactive from behind the top nav items.
		// We re-enable pointer events on the top nav slots.
		pointerEvents: 'none',
		'@media (min-width: 64rem)': {
			gap: token('space.150'),
		},
	},
	fullHeightSidebarExpanded: {
		'@media (min-width: 64rem)': {
			// When the side bar is expanded, the width of the first column is entirely determined by the width of
			// TopNavStart instead of a grid constraint.
			// This simplifies where the width is set, and gives us the ability to animate the grid column width in the future.
			gridTemplateColumns: '0fr minmax(min-content, max-content) 1fr',
		},
		'@media (min-width: 110.5rem)': {
			// On very large screens we instead center the search bar to avoid lopsidedness
			gridTemplateColumns: '1fr minmax(min-content, max-content) 1fr',
		},
	},
});

/**
 * Styles for the visible 'bar' of the top nav, including background and border.
 *
 * This is on a lower z-index than the expanded side nav, and is separate to the top nav items which are above the expanded side nav.
 */
const backgroundStyles = cssMap({
	root: {
		// Occupies the same grid area as the top nav item container (but is below it)
		gridArea: 'top-bar',
		width: '100%',
		height: '100%',
		backgroundColor: token('elevation.surface'),
		boxSizing: 'border-box',
		borderBlockEnd: `${token('border.width')} solid ${token('color.border')}`,
		// Stick point for sticky positioning, relevant on mobile or if the whole page scrolls for some reason
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		insetBlockStart: `var(${bannerMountedVar}, 0px)`,
		position: 'sticky',
		pointerEvents: 'none',
		// By default the background is still above everything
		// This prevents shadows from the side nav and panel from showing above the top nav border.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		zIndex: localSlotLayers.topBar,
	},
	sideNavExpanded: {
		'@media (min-width: 64rem)': {
			// We want the background to appear behind the full height side nav
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			zIndex: localSlotLayers.sideNav,
		},
	},
});

/**
 * The top nav layout area. It will display at the top of the screen, below the banner if one is present.
 */
export function TopNav({
	children,
	xcss,
	height = 48,
	skipLinkLabel = 'Top Bar',
	testId,
	id: providedId,
	UNSAFE_theme,
}: CommonSlotProps & {
	/**
	 * The content of the layout area.
	 * Should include `TopNavStart`, `TopNavMiddle`, and `TopNavEnd`.
	 */
	children: React.ReactNode;
	/**
	 * Bounded style overrides.
	 */
	xcss?: StrictXCSSProp<'backgroundColor', never>;
	/**
	 * Not intended for long term use. This is added to support the migration to the new page layout.
	 * We may replace this prop in a future release.
	 */
	height?: number;
	/**
	 * EXPERIMENTAL - DO NOT USE
	 *
	 * Feature is incomplete and API is subject to change at any time
	 */
	UNSAFE_theme?: CustomTheme;
}) {
	const isFhsEnabled = useIsFhsEnabled();
	const dangerouslyHoistSlotSizes = useContext(DangerouslyHoistSlotSizes);
	const id = useLayoutId({ providedId });
	useSkipLink(id, skipLinkLabel);

	const customTheme = useCustomTheme(UNSAFE_theme);

	/**
	 * With the full height sidebar we have a foreground and background element,
	 * so we need to apply the custom theme styles to the correct element.
	 *
	 * The foreground element should not have a background color,
	 * and the background element doesn't need any of the other styles.
	 */
	const { backgroundStyle, foregroundStyle } = useMemo(() => {
		if (!customTheme.isEnabled) {
			return { backgroundStyle: undefined, foregroundStyle: undefined };
		}

		const { backgroundColor, ...foregroundStyle } = customTheme.style;

		return {
			backgroundStyle: { backgroundColor },
			foregroundStyle,
		};
	}, [customTheme]);

	const { isExpandedOnDesktop } = useSideNavVisibility();

	return (
		<HasCustomThemeContext.Provider value={customTheme.isEnabled}>
			{isFhsEnabled && (
				// The separate element allows top nav items to sit in front of the sidebar, while the background sits behind.
				// It also has a simple story around z-index and positioning.
				<div
					data-layout-slot
					css={[backgroundStyles.root, isExpandedOnDesktop && backgroundStyles.sideNavExpanded]}
					aria-hidden
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
					style={isFhsEnabled ? backgroundStyle : undefined}
				/>
			)}
			<header
				id={id}
				data-layout-slot
				css={[
					styles.root,
					isFhsEnabled && styles.fullHeightSidebar,
					isExpandedOnDesktop && isFhsEnabled && styles.fullHeightSidebarExpanded,
				]}
				className={xcss}
				data-testid={testId}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				style={
					isFhsEnabled ? foregroundStyle : customTheme.isEnabled ? customTheme.style : undefined
				}
			>
				<HoistCssVarToLocalGrid variableName={topNavMountedVar} value={height} />
				{dangerouslyHoistSlotSizes && (
					// ------ START UNSAFE STYLES ------
					// These styles are only needed for the UNSAFE legacy use case for Jira + Confluence.
					// When they aren't needed anymore we can delete them wholesale.
					<DangerouslyHoistCssVarToDocumentRoot variableName={UNSAFE_topNavVar} value={height} />
					// ------ END UNSAFE STYLES ------
				)}
				{children}
			</header>
		</HasCustomThemeContext.Provider>
	);
}

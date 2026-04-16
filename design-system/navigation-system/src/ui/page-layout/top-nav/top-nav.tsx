/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useContext } from 'react';

import { cssMap, jsx } from '@compiled/react';

import type { StrictXCSSProp } from '@atlaskit/css';
import { fg } from '@atlaskit/platform-feature-flags';
import { componentWithFG } from '@atlaskit/platform-feature-flags-react';
import { token } from '@atlaskit/tokens';

import { useSkipLink } from '../../../context/skip-links/use-skip-link';
import { useIsFhsEnabled } from '../../fhs-rollout/use-is-fhs-enabled';
import { type CustomTheme } from '../../top-nav-items/themed/get-custom-theme-styles';
import { HasCustomThemeContext } from '../../top-nav-items/themed/has-custom-theme-context';
import { HasDefaultBackgroundColorContext } from '../../top-nav-items/themed/has-default-background-color-context';
import { useCustomTheme } from '../../top-nav-items/themed/use-custom-theme';
import { useCustomThemeNew } from '../../top-nav-items/themed/use-custom-theme-new';
import {
	bannerMountedVar,
	localSlotLayers,
	sideNavLiveWidthVar,
	topNavMountedVar,
	UNSAFE_topNavVar,
} from '../constants';
import { DangerouslyHoistCssVarToDocumentRoot } from '../dangerously-hoist-css-var-to-document-root';
import { HoistCssVarToLocalGrid } from '../hoist-css-var-to-local-grid';
import { DangerouslyHoistSlotSizes } from '../hoist-slot-sizes-context';
import { useSideNavVisibility } from '../side-nav/use-side-nav-visibility';
import type { CommonSlotProps } from '../types';
import { useLayoutId } from '../use-layout-id';

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
		pointerEvents: 'auto',
		backgroundColor: token('elevation.surface'),
		'@media (min-width: 64rem)': {
			gap: token('space.150'),
		},

		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		zIndex: localSlotLayers.topNavFHS,

		// The border is now on a pseudo element for layering reasons, so we reset the border style from styles.root
		borderBlockEnd: 'none',
		// This pseudo element is used to apply the top nav's bottom border. It is positioned so it does not cover the side nav,
		// to make the sidebar appear full height.
		'&::after': {
			content: '""',
			position: 'absolute',
			// Pin to the bottom of the top nav
			insetBlockEnd: 0,
			// Pin to the right side of the top nav
			insetInlineEnd: 0,
			// Push the element to the right based on the side nav width
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			insetInlineStart: `var(${sideNavLiveWidthVar}, 0px)`,
			borderBlockEndWidth: token('border.width'),
			borderBlockEndStyle: 'solid',
			borderBlockEndColor: token('color.border'),
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
	fullHeightSidebarCustomTheming: {
		'@media (min-width: 64rem)': {
			'&::after': {
				// Hide the top nav bottom borderwhen a custom background color is used
				display: 'none',
			},
		},
	},
});

type TopNavProps = CommonSlotProps & {
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
};

/**
 * The top nav layout area. It will display at the top of the screen, below the banner if one is present.
 */
function TopNavOld({
	children,
	xcss,
	height: heightProp,
	skipLinkLabel = 'Top Bar',
	testId,
	id: providedId,
	UNSAFE_theme,
}: TopNavProps): JSX.Element {
	const isFhsEnabled = useIsFhsEnabled();
	const dangerouslyHoistSlotSizes = useContext(DangerouslyHoistSlotSizes);
	const id = useLayoutId({ providedId });
	useSkipLink(id, skipLinkLabel);

	const hasIncreasedDefaultHeight = isFhsEnabled && fg('platform_dst_nav4_top_nav_increase_height');
	const height = heightProp ?? (hasIncreasedDefaultHeight ? 56 : 48);

	const customTheme = useCustomTheme(UNSAFE_theme);

	const { isExpandedOnDesktop } = useSideNavVisibility();

	return (
		<HasCustomThemeContext.Provider value={customTheme.isEnabled}>
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
				style={customTheme.isEnabled ? customTheme.style : undefined}
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

/**
 * The top nav layout area. It will display at the top of the screen, below the banner if one is present.
 */
function TopNavNew({
	children,
	xcss,
	height: heightProp,
	skipLinkLabel = 'Top Bar',
	testId,
	id: providedId,
	UNSAFE_theme,
}: TopNavProps): JSX.Element {
	const isFhsEnabled = useIsFhsEnabled();
	const dangerouslyHoistSlotSizes = useContext(DangerouslyHoistSlotSizes);
	const id = useLayoutId({ providedId });
	useSkipLink(id, skipLinkLabel);

	const hasIncreasedDefaultHeight = isFhsEnabled && fg('platform_dst_nav4_top_nav_increase_height');
	const height = heightProp ?? (hasIncreasedDefaultHeight ? 56 : 48);

	const customTheme = useCustomThemeNew(UNSAFE_theme);
	const hasDefaultBackground = customTheme.isEnabled ? customTheme.hasDefaultBackground : true;

	const { isExpandedOnDesktop } = useSideNavVisibility();

	return (
		<HasCustomThemeContext.Provider value={customTheme.isEnabled}>
			<HasDefaultBackgroundColorContext.Provider value={hasDefaultBackground}>
				<header
					id={id}
					data-layout-slot
					css={[
						styles.root,
						isFhsEnabled && styles.fullHeightSidebar,
						isExpandedOnDesktop && isFhsEnabled && styles.fullHeightSidebarExpanded,
						customTheme.isEnabled &&
							!hasDefaultBackground &&
							fg('platform_dst_nav4_custom_theming_fhs_1') &&
							styles.fullHeightSidebarCustomTheming,
					]}
					className={xcss}
					data-testid={testId}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
					style={customTheme.isEnabled ? customTheme.style : undefined}
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
			</HasDefaultBackgroundColorContext.Provider>
		</HasCustomThemeContext.Provider>
	);
}

/**
 * The top nav layout area. It will display at the top of the screen, below the banner if one is present.
 */
export const TopNav: (props: TopNavProps) => React.ReactNode = componentWithFG(
	'platform_dst_nav4_custom_theming_fhs_1',
	TopNavNew,
	TopNavOld,
);

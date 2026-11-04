/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { startTransition, useCallback, useContext, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import type { StrictXCSSProp } from '@atlaskit/css';
import type ContainerAtRule from '@atlaskit/css/at-rules/container';
import { componentWithFG } from '@atlaskit/platform-feature-flags-react/component-with-fg';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { token } from '@atlaskit/tokens';

import { useSkipLinkInternal } from '../../../context/skip-links/use-skip-link-internal';
import { type CustomTheme } from '../../top-nav-items/themed/get-custom-theme-styles';
import { HasCustomThemeContext } from '../../top-nav-items/themed/has-custom-theme-context';
import { HasDefaultBackgroundColorContext } from '../../top-nav-items/themed/has-default-background-color-context';
import { useCustomTheme } from '../../top-nav-items/themed/use-custom-theme';
import { useCustomThemeNew } from '../../top-nav-items/themed/use-custom-theme-new';
import {
	UNSAFE_topNavVar,
	type bannerMountedVar,
	type localSlotLayers,
	topNavMountedVar,
} from '../constants';
import { DangerouslyHoistCssVarToDocumentRoot } from '../dangerously-hoist-css-var-to-document-root';
import { HoistCssVarToLocalGrid } from '../hoist-css-var-to-local-grid';
import { DangerouslyHoistSlotSizes } from '../hoist-slot-sizes-context';
import type { CommonSlotProps } from '../types';
import { useLayoutId } from '../use-layout-id';
import { TopNavElementContext } from './top-nav-element-context';
import { useMeasuredTopNavBreakpoints } from './use-measured-top-nav-breakpoints';

/**
 * Styles for the container for the top nav items.
 *
 * The background and border are applied to a different element for z-indexing reasons:
 *
 * - The items sit above the expanded side nav
 * - The background sits below the expanded side nav
 */
const styles = cssMap({
	remProbe: {
		// Observe rem changes independently of the header's pixel width. This
		// out-of-flow measurement has no visual or accessibility-tree content.
		position: 'absolute',
		visibility: 'hidden',
		pointerEvents: 'none',
		width: '1rem',
		height: 0,
	},
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
		height: `var(${'--n_tNvM' satisfies typeof topNavMountedVar})`,
		// This sets the sticky point to be just below banner. It's needed to ensure the stick
		// point is exactly where this element is rendered to with no wiggle room. Unfortunately the CSS
		// spec for sticky doesn't support "stick to where I'm initially rendered" so we need to tell it.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		insetBlockStart: `var(${'--n_bnrM' satisfies typeof bannerMountedVar}, 0px)`,
		position: 'sticky',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
		zIndex: 4 satisfies typeof localSlotLayers.topBar,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		' > span[data-ep-placeholder-id="top_navigation_skeleton"]': {
			// TODO: BLU-3336 This is needed as a workaround for the JIRA issue (it places a placeholder span as a direct child of TopNav which breaks the grid layout). Please remove when the proper fix is applied.
			// We get the span that is immediately nested under TopNav and ignore how it affects the layout. We do this so our Grid layout ignores the `span` and applies to it's children.
			// This is only applicable to the JIRA pages that use EntryPoint such as /jira/projects or /jira/software/projects/.../calendar
			display: 'contents',
		},
	},
	viewportLayout: {
		// The layout switches at the same breakpoint as when the search bar becomes an icon button.
		'@media (min-width: 48rem)': {
			// Using `1fr` for the left and right columns allows them to stay equal for as long as possible
			// There is another grid layout in `TopNavMiddle` that allows the middle column to grow and shrink in a constrained way
			gridTemplateColumns: '1fr minmax(min-content, max-content) 1fr',
		},
	},
	container: {
		containerName: 'navigation-top-nav',
		containerType: 'inline-size',
		minWidth: 0,
		display: 'block',
		// Keep the query content box equal to the measured header width.
		// Padding belongs to the inner grid so CSS and React share the 48rem boundary.
		paddingInline: 0,
	},
	containerLayout: {
		display: 'grid',
		gridTemplateColumns: 'auto minmax(0, 1fr) auto',
		paddingInline: token('space.150'),
		gap: token('space.100'),
		alignItems: 'center',
		boxSizing: 'border-box',
		height: '100%',
		minWidth: 0,
		// Private presentation values inherited by TopNav's slots and logos. Reset
		// every value here so nested TopNavs do not inherit another nav's breakpoint.
		'--n_tnMiddleDisplay': 'flex',
		'--n_tnSideWidth': 'auto',
		// Reserve space for the toggle, app switcher and app icon before Search grows.
		'--n_tnStartMinWidth': 'max-content',
		'--n_tnEndMinWidth': '32px',
		'--n_tnLogoDisplay': 'none',
		'--n_tnIconDisplay': 'flex',
		'--n_tnActionsDisplay': 'none',
		'--n_tnSearchDisplay': 'none',
		'--n_tnSearchWidth': '32px',
		'--n_tnSearchIconDisplay': 'flex',
		// Queries and their named container are local to this component. Unlike
		// viewport queries, these also respond when ChatPanel reduces TopNav's width.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-container-queries
		['@container navigation-top-nav (min-width: 30rem)' satisfies ContainerAtRule]: {
			'--n_tnSearchDisplay': 'grid',
			'--n_tnSearchWidth': '100%',
			'--n_tnSearchIconDisplay': 'none',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-container-queries
		['@container navigation-top-nav (min-width: 48rem)' satisfies ContainerAtRule]: {
			gridTemplateColumns: '1fr minmax(min-content, max-content) 1fr',
			'--n_tnMiddleDisplay': 'grid',
			'--n_tnEndMinWidth': 'max-content',
			'--n_tnActionsDisplay': 'flex',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-container-queries
		['@container navigation-top-nav (min-width: 64rem)' satisfies ContainerAtRule]: {
			'--n_tnSideWidth': 'max-content',
			'--n_tnStartMinWidth': '330px',
			'--n_tnEndMinWidth': '330px',
			'--n_tnLogoDisplay': 'flex',
			'--n_tnIconDisplay': 'none',
		},
		// Preserve the Jira entrypoint placeholder workaround inside the new grid.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		' > span[data-ep-placeholder-id="top_navigation_skeleton"]': {
			display: 'contents',
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
	 * Custom theme for the top navigation. This is a port of Nav 3 functionality, and not recommended for new usage,
	 * as it does not align with our future vision.
	 */
	customTheme?: CustomTheme;
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
	customTheme: customThemeConfig,
}: TopNavProps): JSX.Element {
	const [topNavElement, setTopNavElement] = useState<HTMLElement | null>(null);
	const [remProbe, setRemProbe] = useState<HTMLSpanElement | null>(null);
	// Ref registration must also be non-urgent while navigation is hydrating.
	// Otherwise its ancestor update can force a pending Suspense boundary to fall back.
	const topNavRef = useCallback((element: HTMLElement | null) => {
		startTransition(() => setTopNavElement(element));
	}, []);
	const remProbeRef = useCallback((element: HTMLSpanElement | null) => {
		startTransition(() => setRemProbe(element));
	}, []);
	const breakpoints = useMeasuredTopNavBreakpoints(topNavElement, remProbe);
	const dangerouslyHoistSlotSizes = useContext(DangerouslyHoistSlotSizes);
	const id = useLayoutId({ providedId });
	useSkipLinkInternal({
		id,
		label: skipLinkLabel,
		isHidden: fg('platform_dst_nav4_skip_link_a11y_1'),
	});

	const height = heightProp ?? (fg('platform_dst_ads_appswitcher_improvements') ? 56 : 48);

	const customTheme = useCustomTheme(customThemeConfig);

	return (
		<HasCustomThemeContext.Provider value={customTheme.isEnabled}>
			<header
				ref={fg('platform-dst-chat-panel-layout') ? topNavRef : undefined}
				id={id}
				data-layout-slot
				css={[
					styles.root,
					fg('platform-dst-chat-panel-layout') ? styles.container : styles.viewportLayout,
				]}
				className={xcss}
				data-testid={testId}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				style={customTheme.isEnabled ? customTheme.style : undefined}
			>
				{fg('platform-dst-chat-panel-layout') && (
					<span ref={remProbeRef} css={styles.remProbe} aria-hidden="true" />
				)}
				<HoistCssVarToLocalGrid variableName={topNavMountedVar} value={height} />
				{dangerouslyHoistSlotSizes && (
					// ------ START UNSAFE STYLES ------
					// These styles are only needed for the UNSAFE legacy use case for Jira + Confluence.
					// When they aren't needed anymore we can delete them wholesale.
					<DangerouslyHoistCssVarToDocumentRoot variableName={UNSAFE_topNavVar} value={height} />
					// ------ END UNSAFE STYLES ------
				)}
				{fg('platform-dst-chat-panel-layout') ? (
					<TopNavElementContext.Provider value={breakpoints}>
						<div css={styles.containerLayout}>{children}</div>
					</TopNavElementContext.Provider>
				) : (
					children
				)}
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
	customTheme: customThemeConfig,
}: TopNavProps): JSX.Element {
	const [topNavElement, setTopNavElement] = useState<HTMLElement | null>(null);
	const [remProbe, setRemProbe] = useState<HTMLSpanElement | null>(null);
	// Ref registration must also be non-urgent while navigation is hydrating.
	// Otherwise its ancestor update can force a pending Suspense boundary to fall back.
	const topNavRef = useCallback((element: HTMLElement | null) => {
		startTransition(() => setTopNavElement(element));
	}, []);
	const remProbeRef = useCallback((element: HTMLSpanElement | null) => {
		startTransition(() => setRemProbe(element));
	}, []);
	const breakpoints = useMeasuredTopNavBreakpoints(topNavElement, remProbe);
	const dangerouslyHoistSlotSizes = useContext(DangerouslyHoistSlotSizes);
	const id = useLayoutId({ providedId });
	useSkipLinkInternal({
		id,
		label: skipLinkLabel,
		isHidden: fg('platform_dst_nav4_skip_link_a11y_1'),
	});

	const height = heightProp ?? (fg('platform_dst_ads_appswitcher_improvements') ? 56 : 48);

	const customTheme = useCustomThemeNew(customThemeConfig);
	const hasDefaultBackground = customTheme.isEnabled ? customTheme.hasDefaultBackground : true;

	return (
		<HasCustomThemeContext.Provider value={customTheme.isEnabled}>
			<HasDefaultBackgroundColorContext.Provider value={hasDefaultBackground}>
				<header
					ref={fg('platform-dst-chat-panel-layout') ? topNavRef : undefined}
					id={id}
					data-layout-slot
					css={[
						styles.root,
						fg('platform-dst-chat-panel-layout') ? styles.container : styles.viewportLayout,
					]}
					className={xcss}
					data-testid={testId}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
					style={customTheme.isEnabled ? customTheme.style : undefined}
				>
					{fg('platform-dst-chat-panel-layout') && (
						<span ref={remProbeRef} css={styles.remProbe} aria-hidden="true" />
					)}
					<HoistCssVarToLocalGrid variableName={topNavMountedVar} value={height} />
					{dangerouslyHoistSlotSizes && (
						// ------ START UNSAFE STYLES ------
						// These styles are only needed for the UNSAFE legacy use case for Jira + Confluence.
						// When they aren't needed anymore we can delete them wholesale.
						<DangerouslyHoistCssVarToDocumentRoot variableName={UNSAFE_topNavVar} value={height} />
						// ------ END UNSAFE STYLES ------
					)}
					{fg('platform-dst-chat-panel-layout') ? (
						<TopNavElementContext.Provider value={breakpoints}>
							<div css={styles.containerLayout}>{children}</div>
						</TopNavElementContext.Provider>
					) : (
						children
					)}
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

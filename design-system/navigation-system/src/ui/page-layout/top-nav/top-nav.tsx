/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useContext } from 'react';

import { cssMap, jsx } from '@compiled/react';

import type { StrictXCSSProp } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import { useSkipLink } from '../../../context/skip-links/skip-links-context';
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
import type { CommonSlotProps } from '../types';

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
		borderBlockEnd: `1px solid ${token('color.border')}`,
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
	const dangerouslyHoistSlotSizes = useContext(DangerouslyHoistSlotSizes);
	const id = useLayoutId({ providedId });
	useSkipLink(id, skipLinkLabel);

	const customTheme = useCustomTheme(UNSAFE_theme);

	return (
		<HasCustomThemeContext.Provider value={customTheme.isEnabled}>
			<header
				id={id}
				data-layout-slot
				css={styles.root}
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

/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	type CSSProperties,
	type MutableRefObject,
	type ReactNode,
	useContext,
	useId,
} from 'react';

import { cssMap, jsx, keyframes } from '@compiled/react';

import type ContainerAtRule from '@atlaskit/css/at-rules/container';
import type MediaAboveMd from '@atlaskit/css/at-rules/media-above-md';
import type MediaAboveXl from '@atlaskit/css/at-rules/media-above-xl';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { token } from '@atlaskit/tokens';

import type { mainMinimumWidthVar } from './constants';
import type { LayoutAreaMode } from './layout-area-sizing-context';
import { MainMinWidthContext } from './main-min-width-context';

// The grid uses runtime CSS variables and container sizing outside @atlaskit/css's bounded values.
const localPanelTrackWidthVar = '--p_lclPnlTrackW';
const localPanelResizingVar = '--p_lclPnlRsz';
const localPanelMinWidthVar = '--p_lclPnlMinW';

// One CSS animation holds both the grid and its surface placement until the layout snap.
// Identical keyframes keep the layout static; normal styles take over at 60ms.
const holdPanelTrack = keyframes({
	from: {
		gridTemplateAreas: "'main'",
		gridTemplateColumns: 'minmax(0, 1fr)',
		gridTemplateRows: '1fr',
		'--p_lclPnlEnterArea': 'main',
	},
	to: {
		gridTemplateAreas: "'main'",
		gridTemplateColumns: 'minmax(0, 1fr)',
		gridTemplateRows: '1fr',
		'--p_lclPnlEnterArea': 'main',
	},
});

const styles = cssMap({
	container: {
		containerName: 'local-panel-layout',
		containerType: 'inline-size',
		height: '100%',
		width: '100%',
	},
	// The outer container supplies query and motion widths. A second size container
	// on this grid can leave WebKit's viewport media-query styles stale.
	layout: {
		display: 'grid',
		gridTemplateAreas: `'main'`,
		gridTemplateColumns: 'minmax(0, 1fr)',
		gridTemplateRows: '1fr',
		height: '100%',
		width: '100%',
		overflow: 'auto',
	},
	mainContent: {
		gridArea: 'main',
		overflow: 'auto',
		display: 'flex',
		height: '100%',
		isolation: 'isolate',
	},
	panelUplift: {
		overflow: 'hidden',
		// Cover the reserved track as the surface settles after the main-content snap.
		backgroundColor: token('elevation.surface'),
	},
	unmeasured: {
		// Keep quoted grid syntax in Compiled CSS: React 18 escapes quotes in server-rendered style text.
		'--p_lclPnlSsrInlineAreas': `'main panel'`,
		gridTemplateAreas: `var(--p_lclPnlSsrAreas, 'main')`,
		gridTemplateColumns: 'var(--p_lclPnlSsrColumns, minmax(0, 1fr))',
	},
	unmeasuredWidths: {
		// Retain responsive defaults while closed so exit motion uses the same geometry as SSR.
		'--p_lclPnlSsrPreferredW': 'var(--p_lclPnlCompactW)',
		'--p_lclPnlSsrDefaultW': 'var(--p_lclPnlCompactDefaultW)',
		['@media (min-width: 64rem)' satisfies MediaAboveMd]: {
			'--p_lclPnlSsrPreferredW': 'var(--p_lclPnlTrackW)',
			'--p_lclPnlSsrDefaultW': 'var(--p_lclPnlDefaultW)',
		},
		['@media (min-width: 110.5rem)' satisfies MediaAboveXl]: {
			'--p_lclPnlSsrPreferredW': 'var(--p_lclPnlXlW)',
			'--p_lclPnlSsrDefaultW': 'var(--p_lclPnlXlDefaultW)',
		},
	},
	managedInline: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
		'&&': {
			overflow: 'hidden',
			gridTemplateAreas: `'main panel'`,
			gridTemplateRows: 'auto',
			// Share navigation-system's CSS variable name so both layouts honor the same minimum.
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
			gridTemplateColumns: `minmax(var(${'--n_mainMinW' satisfies typeof mainMinimumWidthVar}, 320px), 1fr) clamp(var(${localPanelMinWidthVar}), var(${localPanelResizingVar}, var(${localPanelTrackWidthVar})), calc(100% - var(${'--n_mainMinW' satisfies typeof mainMinimumWidthVar}, 320px)))`,
		},
	},
	managedOverlay: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
		'&&': {
			overflow: 'hidden',
			gridTemplateAreas: `'main'`,
			gridTemplateColumns: 'minmax(0, 1fr)',
			gridTemplateRows: '1fr',
		},
	},
	entering: {
		'@media (prefers-reduced-motion: no-preference)': {
			// Snap once at 30% of the 200ms entrance, without interpolating the page width.
			animationName: holdPanelTrack,
			animationDuration: `calc(${token('motion.duration.medium')} * 0.3)`,
		},
	},
	panelClosed: {
		// The layout can remain mounted without a panel. Reserve a track only while open.
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
		'&&': {
			gridTemplateAreas: `'main'`,
			gridTemplateColumns: 'minmax(0, 1fr)',
			gridTemplateRows: '1fr',
		},
	},
});

type PanelLayoutShellProps = {
	/**
	 * Main content rendered alongside the local panel.
	 */
	children: ReactNode;
	/**
	 * Panel content or surface supplied by the caller.
	 */
	panel: ReactNode;
	/**
	 * Whether the local panel is open.
	 */
	isPanelOpen: boolean;
	/**
	 * Effective panel track width in pixels.
	 */
	panelWidth: number;
	compactPanelWidth: number;
	xlPanelWidth: number;
	xlDefaultPanelWidth: number;
	/**
	 * Mount-time defaults determine the overlay cap independently of saved widths.
	 */
	defaultPanelWidth: number;
	compactDefaultPanelWidth: number;
	/**
	 * Minimum panel width in pixels.
	 */
	panelMinWidth?: number;
	/**
	 * Allocated placement. Before measurement, CSS reserves a track when both minimums fit the host.
	 */
	mode?: LayoutAreaMode;
	/**
	 * Shared with the panel's resize controls so imperative resizing also updates the grid track.
	 */
	layoutRef?: MutableRefObject<HTMLDivElement | null>;
	/**
	 * Enables coordinated panel motion and clips the sliding surface.
	 */
	isMotionEnabled?: boolean;
	testId?: string;
};

/**
 * Grid and scrolling for Main and its local panel. Use inside navigation's Root and Main.
 */
export function PanelLayoutShell({
	children,
	panel,
	isPanelOpen,
	panelWidth,
	compactPanelWidth,
	xlPanelWidth,
	xlDefaultPanelWidth,
	defaultPanelWidth,
	compactDefaultPanelWidth,
	panelMinWidth = 320,
	mode,
	layoutRef,
	isMotionEnabled = false,
	testId,
}: PanelLayoutShellProps): JSX.Element {
	const mainMinWidth = useContext(MainMinWidthContext);
	const id = `local-panel-${useId().replace(/[^a-zA-Z0-9_-]/g, '_')}`;
	// CSS query conditions cannot read custom properties. Only the numeric minimums and
	// instance selector are generated here; this rule is removed after the first measurement,
	// so live resizing never rewrites stylesheet text. The named container is local to this shell.
	const inlineQuery =
		`@container local-panel-layout (min-width: ${mainMinWidth + panelMinWidth}px)` satisfies ContainerAtRule;
	return (
		<div css={styles.container}>
			{mode === undefined && isMotionEnabled && fg('platform-dst-chat-panel-layout') && (
				// Keep the inline motion cap available during exit, after the open-only track rule is removed.
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles -- Instance-scoped query matches the SSR inline allocation, including caller-defined minimums.
				<style>{`${inlineQuery} {
					#${id} { --p_lclPnlMotionMaxW: calc(100cqw - ${mainMinWidth}px); }
				}`}</style>
			)}
			{mode === undefined && isPanelOpen && (
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-global-styles -- Instance-scoped SSR query supports caller-defined minimums; CSS variables are not allowed in query conditions.
				<style>{`${inlineQuery} {
					#${id} {
						--p_lclPnlSsrAreas: var(--p_lclPnlSsrInlineAreas);
						--p_lclPnlSsrColumns: minmax(0, 1fr) min(var(--p_lclPnlSsrPreferredW), calc(100% - ${mainMinWidth}px));
						--p_lclPnlSsrArea: panel;
						--p_lclPnlSsrWidth: 100%;
						--p_lclPnlSsrBackground: ${token('elevation.surface')};
						--p_lclPnlSsrShadow: none;
						--p_lclPnlSsrBorder: ${token('border.width')} solid ${token('color.border')};
					}
				}`}</style>
			)}
			<div
				id={id}
				css={[
					styles.layout,
					mode === undefined && styles.unmeasuredWidths,
					mode === undefined && isPanelOpen && styles.unmeasured,
					isMotionEnabled && styles.panelUplift,
					mode === 'inline' && styles.managedInline,
					mode === 'overlay' && styles.managedOverlay,
					!isPanelOpen && styles.panelClosed,
					isPanelOpen && isMotionEnabled && styles.entering,
				]}
				data-testid={testId}
				ref={layoutRef}
				style={
					{
						// These runtime track widths are shared with the panel splitter.
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/ui-styling-standard/no-unsafe-values
						[localPanelTrackWidthVar]: `${panelWidth}px`,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/ui-styling-standard/no-unsafe-values
						[localPanelMinWidthVar]: `${panelMinWidth}px`,
						'--p_lclPnlCompactW': `${compactPanelWidth}px`,
						'--p_lclPnlXlW': `${xlPanelWidth}px`,
						'--p_lclPnlXlDefaultW': `${xlDefaultPanelWidth}px`,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/ui-styling-standard/no-unsafe-values
						'--p_lclPnlDefaultW': `${defaultPanelWidth}px`,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/ui-styling-standard/no-unsafe-values
						'--p_lclPnlCompactDefaultW': `${compactDefaultPanelWidth}px`,
					} as CSSProperties
				}
			>
				<div css={styles.mainContent}>{children}</div>
				{panel}
			</div>
		</div>
	);
}

import React, {
	type Key,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';

import invariant from 'tiny-invariant';

import useStableRef from '@atlaskit/ds-lib/use-stable-ref';
import ExitingPersistence from '@atlaskit/motion/exiting-persistence';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { getPanelLayoutDefaults } from './get-panel-layout-defaults';
import {
	LayoutAreaSizingContext,
	type LayoutAreaMode,
	type LayoutAreaSizingContextValue,
} from './layout-area-sizing-context';
import { LayoutAreaSizingProvider } from './layout-area-sizing-provider';
import { LocalPanelSurface } from './local-panel-surface';
import { PanelLayoutShell } from './panel-layout-shell';
import { useLayoutAreaSizing } from './use-layout-area-sizing';

// Development-only ownership checks are scoped to each coordinator, not the whole page.
const mountedPanelLayouts = new WeakSet<LayoutAreaSizingContextValue>();

export type PanelResizeEnd = {
	initialWidth: number;
	finalWidth: number;
	mode: LayoutAreaMode;
};

export type PanelLayoutProps = {
	/**
	 * Main content. Mount PanelLayout inside navigation's Main, alongside ChatPanel in Root.
	 */
	children: ReactNode;
	/**
	 * Caller-owned panel content; no Panel System provider or renderer is required.
	 */
	panel: ReactNode;
	isPanelOpen: boolean;
	/**
	 * Optional content identity, used to reset scrolling and animate content replacement.
	 */
	panelKey?: Key;
	/**
	 * Controlled preferred width in pixels. Allocation may constrain it without changing the request.
	 */
	panelWidth?: number;
	/**
	 * Initial preferred width in pixels; subsequent changes are ignored.
	 * Defaults to 365, or 400 with chat layout enabled.
	 * After a user resize, one preferred width is retained across inline and overlay modes.
	 * Available space can constrain the rendered width without overwriting that preference.
	 */
	defaultPanelWidth?: number;
	/**
	 * Default at compact viewport sizes. Defaults to 320, or an explicitly supplied defaultPanelWidth.
	 * Used only until a controlled width or user resize supplies a preference.
	 */
	compactDefaultPanelWidth?: number;
	/**
	 * Minimum width in pixels. Defaults to 320; overlays can be smaller in a narrower container.
	 */
	panelMinWidth?: number;
	/**
	 * Optional maximum width in pixels.
	 */
	panelMaxWidth?: number;
	/**
	 * Called after user resizing, with the effective width. Accept this value to control panelWidth.
	 */
	onPanelWidthChange?: (width: number) => void;
	/**
	 * One callback per completed pointer/keyboard resize, for persistence and analytics.
	 */
	onResizeEnd?: (event: PanelResizeEnd) => void;
	/**
	 * Accessible region and splitter labels; pass localized values in products.
	 */
	panelLabel?: string;
	resizeLabel?: string;
	testId?: string;
};

function CoordinatedPanelLayout({
	children,
	panel,
	isPanelOpen,
	panelKey,
	panelWidth,
	defaultPanelWidth,
	compactDefaultPanelWidth,
	panelMinWidth: suppliedMinWidth,
	panelMaxWidth,
	onPanelWidthChange,
	onResizeEnd,
	panelLabel = 'Panel',
	resizeLabel = 'Resize panel',
	testId,
	layoutRef,
}: PanelLayoutProps & { layoutRef: React.MutableRefObject<HTMLDivElement | null> }): JSX.Element {
	const [defaults] = useState(getPanelLayoutDefaults);
	const panelMinWidth = suppliedMinWidth ?? defaults.panelMinWidth;
	const coordinator = useContext(LayoutAreaSizingContext);
	useEffect(() => {
		if (process.env.NODE_ENV !== 'production' && coordinator) {
			invariant(
				!mountedPanelLayouts.has(coordinator),
				'Only one PanelLayout may be mounted per navigation Root/sizing coordinator, including closed hosts and LayoutWithPanel. Reuse the host to switch panel content.',
			);
			mountedPanelLayouts.add(coordinator);
			return () => {
				mountedPanelLayouts.delete(coordinator);
			};
		}
	}, [coordinator]);

	const [defaultWidth] = useState(defaultPanelWidth ?? panelWidth ?? defaults.panelWidth);
	const [compactWidth] = useState(
		compactDefaultPanelWidth ?? defaultPanelWidth ?? panelWidth ?? defaults.compactPanelWidth,
	);
	// Use the controlled request before measurement too, without changing the mount-time default.
	const fallbackWidth = Math.max(
		panelMinWidth,
		Math.min(panelWidth ?? defaultWidth, panelMaxWidth ?? Infinity),
	);
	const { state, prepareResize, getResizeBounds, startResize, resize, completeResize } =
		useLayoutAreaSizing({
			area: 'panel',
			config: {
				isOpen: isPanelOpen,
				requestedWidth: panelWidth,
				defaultWidth,
				compactDefaultWidth: compactWidth,
				minWidth: panelMinWidth,
				maxWidth: panelMaxWidth,
			},
		});
	// Host callback identity is unrelated to sizing. Keep drag bindings stable while
	// still delivering completions to the latest product-owned state and analytics.
	const onWidthChangeRef = useStableRef(onPanelWidthChange);
	const onResizeEndRef = useStableRef(onResizeEnd);
	const handleWidthChange = useCallback(
		(width: number) => onWidthChangeRef.current?.(width),
		[onWidthChangeRef],
	);
	const handleResizeEnd = useCallback(
		(event: PanelResizeEnd) => onResizeEndRef.current?.(event),
		[onResizeEndRef],
	);
	const isMotionEnabled = fg('platform-dst-motion-uplift-panel');
	const surface = isPanelOpen && (
		<LocalPanelSurface
			key="local-panel"
			contentKey={panelKey}
			defaultWidth={fallbackWidth}
			minWidth={panelMinWidth}
			maxWidth={panelMaxWidth}
			layoutRef={layoutRef}
			managedSizing={state}
			getManagedResizeBounds={getResizeBounds}
			prepareResize={prepareResize}
			onManagedResizeStart={startResize}
			onManagedResize={resize}
			onManagedResizeEnd={completeResize}
			onWidthChange={handleWidthChange}
			onResizeEnd={handleResizeEnd}
			label={panelLabel}
			resizeLabel={resizeLabel}
			testId={testId && `${testId}--panel-slot`}
		>
			{panel}
		</LocalPanelSurface>
	);
	return (
		<PanelLayoutShell
			isPanelOpen={isPanelOpen}
			panelWidth={state?.width ?? fallbackWidth}
			compactPanelWidth={Math.max(
				panelMinWidth,
				Math.min(panelWidth ?? compactWidth, panelMaxWidth ?? Infinity),
			)}
			panelMinWidth={panelMinWidth}
			mode={state?.mode}
			layoutRef={layoutRef}
			shouldClipOverflow={isMotionEnabled}
			testId={testId}
			panel={isMotionEnabled ? <ExitingPersistence>{surface}</ExitingPersistence> : surface}
		>
			{children}
		</PanelLayoutShell>
	);
}

/**
 * A coordinated local panel with caller-owned content and state. Keep this host mounted
 * while closed to retain resized widths. Unmount it to reset its width preferences.
 *
 * Mount only one local-panel host per navigation Root/sizing coordinator, including
 * closed hosts and panel-system's LayoutWithPanel. Switch content through the same host;
 * separate Roots may each own a local panel.
 *
 * With chat layout enabled it shares Root's sizing coordinator. Otherwise it measures
 * its own Main region, leaving existing navigation/chat behavior unchanged.
 * Local-panel placement and resize constraints use this layout in both cases; disabling
 * the chat-layout gate does not restore the previous panel-system layout engine.
 */
export function PanelLayout(props: PanelLayoutProps): JSX.Element {
	const parentSizing = useContext(LayoutAreaSizingContext);
	const layoutRef = useRef<HTMLDivElement | null>(null);
	const content = (
		<CoordinatedPanelLayout
			layoutRef={layoutRef}
			panel={props.panel}
			isPanelOpen={props.isPanelOpen}
			panelKey={props.panelKey}
			panelWidth={props.panelWidth}
			defaultPanelWidth={props.defaultPanelWidth}
			compactDefaultPanelWidth={props.compactDefaultPanelWidth}
			panelMinWidth={props.panelMinWidth}
			panelMaxWidth={props.panelMaxWidth}
			onPanelWidthChange={props.onPanelWidthChange}
			onResizeEnd={props.onResizeEnd}
			panelLabel={props.panelLabel}
			resizeLabel={props.resizeLabel}
			testId={props.testId}
		>
			{props.children}
		</CoordinatedPanelLayout>
	);
	return parentSizing ? (
		content
	) : (
		<LayoutAreaSizingProvider layoutRef={layoutRef}>{content}</LayoutAreaSizingProvider>
	);
}

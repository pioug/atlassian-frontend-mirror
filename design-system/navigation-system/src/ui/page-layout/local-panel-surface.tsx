/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import {
	type CSSProperties,
	type Key,
	type MutableRefObject,
	type ReactNode,
	useCallback,
	useContext,
	useMemo,
	useRef,
} from 'react';

import { cssMap, jsx } from '@compiled/react';

import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import { useLayoutEffect } from '@atlaskit/ds-lib/use-layout-effect';
import useStableRef from '@atlaskit/ds-lib/use-stable-ref';
import { useMotion } from '@atlaskit/motion/entering/use-motion';
import ExitingPersistence from '@atlaskit/motion/exiting-persistence';
import { fg } from '@atlaskit/platform-feature-flags/fg';
import { token } from '@atlaskit/tokens';

import { type contentHeightWhenFixed, localPanelWidthVar } from './constants';
import { DangerouslyHoistSlotSizes } from './hoist-slot-sizes-context';
import type { LayoutAreaMode, LayoutAreaState } from './layout-area-sizing-context';
import type { PanelResizeEnd } from './panel-layout';
import { PanelSplitter } from './panel-splitter/panel-splitter';
import { PanelSplitterProvider } from './panel-splitter/provider';
import type { ResizeBounds } from './panel-splitter/types';

const localPanelVar = '--p_lclPnlW';
const panelSplitterResizingVar = '--p_lclPnlRsz';
const localPanelSplitterId = Symbol('LocalPanel PanelSplitter');

// Compiled preserves the existing container-relative widths and discrete motion styles.
/* eslint-disable @compiled/shorthand-property-sorting -- Content motion overrides only the animation delay. */
const styles = cssMap({
	panelWrapper: {
		position: 'sticky',
		backgroundColor: token('elevation.surface.overlay'),
		boxSizing: 'border-box',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		height:
			'calc(100vh - var(--n_bnrM, 0px) - var(--n_tNvM, 0px))' satisfies typeof contentHeightWhenFixed,
		// Main already accounts for the banner and TopNav. Keep this sticky origin
		// unchanged when the sizing coordinator activates.
		insetBlockStart: '0px',

		justifySelf: 'end',
		gridArea: 'main',
		/**
		 * For mobile viewports, the panel will try to take the minimum width, but no larger than 90% of the screen width.
		 *
		 * The minimum width is derived from the default width of the panel.
		 *
		 * This ensures the panel:
		 *
		 * - only shrinks below its minimum width if the viewport is too small
		 * - is not forced to grow if it is smaller than `400px`
		 */
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
		width: `min(90%, var(${panelSplitterResizingVar}, var(${localPanelVar})))`,
	},
	managedInline: {
		gridArea: 'panel',
		backgroundColor: token('elevation.surface'),
		insetBlockStart: '0px',
		width: `var(${panelSplitterResizingVar}, var(${localPanelVar}))`,
	},
	unmeasured: {
		// The shell's local container query keeps the surface and reserved track in sync during SSR.
		gridArea: 'var(--p_lclPnlSsrArea, main)',
		width: 'var(--p_lclPnlSsrWidth, min(90%, var(--p_lclPnlSsrPreferredW)))',
		backgroundColor: `var(--p_lclPnlSsrBackground, ${token('elevation.surface.overlay')})`,
		boxShadow: `var(--p_lclPnlSsrShadow, ${token('elevation.shadow.overlay')})`,
		borderInlineStart: 'var(--p_lclPnlSsrBorder, none)',
	},
	managedOverlay: {
		gridArea: 'main',
		backgroundColor: token('elevation.surface.overlay'),
		width: `var(${panelSplitterResizingVar}, var(${localPanelVar}))`,
	},
	panelScrollContainer: {
		overflow: 'auto',
		height: '100%',
	},
	border: {
		// We use a shadow when the panel is an overlay
		boxShadow: token('elevation.shadow.overlay'),
		// Not required, but declaring explicitly because we really don't want a border at small sizes
		// Previously we had a transparent border to maintain width, but this unintentionally acted as padding
		borderInlineStart: 'none',
	},
	managedInlineBorder: {
		boxShadow: 'initial',
		borderInlineStart: `${token('border.width')} solid ${token('color.border')}`,
	},
	entering: {
		'@media (prefers-reduced-motion: no-preference)': {
			animation: token('motion.panel.enter.right'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
			"[dir='rtl'] &": {
				animation: token('motion.panel.enter.left'),
			},
			transitionProperty: 'position',
			transitionDuration: token('motion.duration.instant'),
			transitionDelay: token('motion.duration.short'),
			transitionBehavior: 'allow-discrete',
			'@starting-style': {
				position: 'fixed',
			},
		},
	},
	exiting: {
		'@media (prefers-reduced-motion: no-preference)': {
			animation: token('motion.panel.exit.right'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
			"[dir='rtl'] &": {
				animation: token('motion.panel.exit.left'),
			},
			position: 'fixed',
		},
	},
	contentEntering: {
		animation: token('motion.panel.content.enter'),
	},
	contentExiting: {
		animation: token('motion.panel.content.exit'),
	},
	contentChangeContainer: { height: '100%' },
});

const contentEnteringDelayStyles = cssMap({
	root: { animationDelay: token('motion.duration.xshort') },
});
/* eslint-enable @compiled/shorthand-property-sorting */

const PanelContentMotion = ({ children }: { children: React.ReactNode }): JSX.Element => {
	const { state, ref } = useMotion<HTMLDivElement>();

	return (
		<div
			css={[
				styles.contentChangeContainer,
				state === 'entering' && styles.contentEntering,
				state === 'exiting' && styles.contentExiting,
			]}
			ref={ref}
		>
			{children}
		</div>
	);
};

type LocalPanelSurfaceProps = {
	children: ReactNode;
	contentKey?: Key;
	label: string;
	resizeLabel: string;
	defaultWidth: number;
	minWidth: number;
	maxWidth?: number;
	testId?: string;
	layoutRef: MutableRefObject<HTMLDivElement | null>;
	managedSizing?: LayoutAreaState;
	getManagedResizeBounds: () => ResizeBounds | undefined;
	prepareResize?: () => Promise<boolean>;
	onManagedResizeStart: (mode: LayoutAreaMode) => void;
	onManagedResize: (mode: LayoutAreaMode, width: number) => void;
	onManagedResizeEnd: (mode: LayoutAreaMode, width: number) => void;
	onWidthChange: (width: number) => void;
	onResizeEnd: (event: PanelResizeEnd) => void;
};

/**
 * Internal surface for PanelLayout. The host supplies content; navigation owns its geometry.
 */
export function LocalPanelSurface({
	children,
	contentKey,
	label,
	resizeLabel,
	defaultWidth,
	minWidth,
	maxWidth,
	testId,
	layoutRef,
	managedSizing,
	getManagedResizeBounds,
	prepareResize,
	onManagedResizeStart,
	onManagedResize,
	onManagedResizeEnd,
	onWidthChange,
	onResizeEnd,
}: LocalPanelSurfaceProps): JSX.Element {
	const ref = useRef<HTMLDivElement | null>(null);
	const dangerouslyHoistSlotSizes = useContext(DangerouslyHoistSlotSizes);
	useLayoutEffect(() => {
		const panel = ref.current;
		if (!dangerouslyHoistSlotSizes || !panel) {
			return;
		}
		// Container-relative CSS owns the initial width, before the sizing runtime loads.
		// Publish geometry directly for external controls; never feed it into saved preferences.
		let previousWidth: number | undefined;
		const publishWidth = (width: number) => {
			if (width !== previousWidth) {
				previousWidth = width;
				panel.ownerDocument.documentElement.style.setProperty(localPanelWidthVar, `${width}px`);
			}
		};
		publishWidth(panel.getBoundingClientRect().width);
		const observer = new ResizeObserver(([entry]) => {
			publishWidth(entry.borderBoxSize?.[0]?.inlineSize ?? panel.getBoundingClientRect().width);
		});
		observer.observe(panel, { box: 'border-box' });
		return () => {
			observer.disconnect();
			panel.ownerDocument.documentElement.style.removeProperty(localPanelWidthVar);
		};
	}, [dangerouslyHoistSlotSizes]);
	const scrollRef = useRef<HTMLDivElement | null>(null);
	useLayoutEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = 0;
		}
	}, [contentKey]);
	const { state, ref: motionRef } = useMotion<HTMLElement>();
	const isMotionUpliftEnabled = fg('platform-dst-motion-uplift-panel');
	const isContentMotionEnabled = fg('platform-dst-motion-uplift-panel-content');
	const mergedRef = useMemo(
		() => (isMotionUpliftEnabled ? mergeRefs([ref, motionRef]) : ref),
		[isMotionUpliftEnabled, motionRef],
	);
	const mode = managedSizing?.mode ?? 'overlay';
	const managedMode = useStableRef(managedSizing?.mode);
	// Resize preparation can load the coordinator after the interaction starts.
	// Read its latest mode instead of the pre-load callback's captured fallback.
	const getMode = useCallback((): LayoutAreaMode => {
		if (managedMode.current) {
			return managedMode.current;
		}
		return ref.current && getComputedStyle(ref.current).gridArea.split('/')[0].trim() === 'panel'
			? 'inline'
			: 'overlay';
	}, [managedMode]);
	const dragMode = useRef<LayoutAreaMode>('overlay');
	const completedResizeModeRef = useRef(mode);
	const renderedWidth =
		managedSizing?.width ?? Math.max(minWidth, Math.min(defaultWidth, maxWidth ?? Infinity));
	// Before the first measurement, CSS caps the surface to its containing region.
	// Resize preparation waits for the coordinator to resolve the same bounds for both inputs.
	const getResizeBounds = useCallback(
		(): ResizeBounds => getManagedResizeBounds() ?? { min: '0px', max: '0px' },
		[getManagedResizeBounds],
	);
	const onCompleteResize = useCallback(
		(width: number) => {
			// Keyboard analytics are debounced; retain the mode that produced this width,
			// rather than the layout mode when the delayed callback eventually runs.
			const mode = getMode();
			completedResizeModeRef.current = mode;
			onManagedResizeEnd(mode, width);
			onWidthChange(width);
		},
		[getMode, onManagedResizeEnd, onWidthChange],
	);
	const onResizeStartInternal = useCallback(() => {
		dragMode.current = getMode();
		onManagedResizeStart(dragMode.current);
	}, [getMode, onManagedResizeStart]);
	const onResizeInternal = useCallback(
		(width: number) => onManagedResize(dragMode.current, width),
		[onManagedResize],
	);
	const handleResizeEnd = useCallback(
		(event: { initialWidth: number; finalWidth: number }) =>
			onResizeEnd({ ...event, mode: completedResizeModeRef.current }),
		[onResizeEnd],
	);
	return (
		<section
			aria-label={label}
			css={[
				isMotionUpliftEnabled && state === 'entering' && styles.entering,
				isMotionUpliftEnabled && state === 'exiting' && styles.exiting,
				styles.panelWrapper,
				styles.border,
				!managedSizing && styles.unmeasured,
				managedSizing?.mode === 'inline' && styles.managedInline,
				managedSizing?.mode === 'overlay' && styles.managedOverlay,
				managedSizing?.mode === 'inline' && styles.managedInlineBorder,
			]}
			data-testid={testId}
			data-layout-with-panel-slot=""
			style={
				{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlaskit/ui-styling-standard/no-imported-style-values
					[localPanelVar]: `${renderedWidth}px`,
				} as CSSProperties
			}
			ref={mergedRef}
		>
			<PanelSplitterProvider
				panelId={localPanelSplitterId}
				panelRef={ref}
				resizingElementRef={layoutRef}
				panelWidth={renderedWidth}
				onCompleteResize={onCompleteResize}
				prepareResize={prepareResize}
				onResizeStartInternal={onResizeStartInternal}
				onResizeInternal={onResizeInternal}
				getResizeBounds={getResizeBounds}
				isEnabled={managedSizing !== undefined || prepareResize !== undefined}
				resizingCssVar={panelSplitterResizingVar}
				position="start"
			>
				{/**
				 * Overflow scroll styles are added here rather than on the `section` container element, so that the panel splitter
				 * component can overflow out of the `Panel` container, to increase the interactive grab area
				 */}
				<div
					ref={scrollRef}
					data-testid={testId && `${testId}--scroll-container`}
					css={[
						styles.panelScrollContainer,
						state === 'entering' && styles.contentEntering,
						isMotionUpliftEnabled && state === 'entering' && contentEnteringDelayStyles.root,
						state === 'exiting' && styles.contentExiting,
					]}
				>
					{isContentMotionEnabled && contentKey !== undefined ? (
						<ExitingPersistence exitThenEnter>
							<PanelContentMotion key={contentKey}>{children}</PanelContentMotion>
						</ExitingPersistence>
					) : (
						children
					)}
					<PanelSplitter
						label={resizeLabel}
						testId={testId && `${testId}--splitter`}
						onResizeEnd={handleResizeEnd}
					/>
				</div>
			</PanelSplitterProvider>
		</section>
	);
}

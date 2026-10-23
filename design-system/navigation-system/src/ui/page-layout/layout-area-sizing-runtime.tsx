import React, { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import { bind } from 'bind-event-listener';

import { calculateLayoutAreaStates } from './calculate-layout-area-states';
import { defaultMainMinWidth } from './constants';
import {
	LayoutAreaSizingContext,
	type LayoutArea,
	type LayoutAreaAllocation,
	type LayoutAreaConfig,
	type LayoutAreaMode,
	type LayoutAreaState,
	type LayoutAreaSizingContextValue,
	type LayoutWidthBound,
	type ResizeSession,
	type StoredLayoutArea,
} from './layout-area-sizing-context';
import { layoutAreaStateContexts } from './layout-area-state-contexts';
import { resolveLayoutWidth } from './resolve-layout-width';
import { useOccupiedLayoutWidth } from './use-occupied-layout-width';

type LayoutDimensions = {
	viewportWidth: number;
	layoutWidth: number;
	isChatPanelOverlay: boolean;
	isSideNavOverlay: boolean;
};

function useStableAreaState(state: LayoutAreaState | undefined): LayoutAreaState | undefined {
	const { mode, width, minWidth } = state ?? {};
	return useMemo(
		() =>
			mode !== undefined && width !== undefined && minWidth !== undefined
				? { mode, width, minWidth }
				: undefined,
		[mode, width, minWidth],
	);
}

export function LayoutAreaSizingRuntime({
	children,
	layoutRef,
	onReady,
	onUpdate,
}: {
	children?: ReactNode;
	layoutRef?: React.RefObject<HTMLDivElement | null>;
	onReady?: (actions: LayoutAreaSizingContextValue | null) => void;
	onUpdate?: (states: Partial<Record<LayoutArea, LayoutAreaState>>) => void;
}): JSX.Element {
	const occupiedWidth = useOccupiedLayoutWidth(layoutRef);
	const [dimensions, setDimensions] = useState<LayoutDimensions | null>(null);
	const [mainMinWidth, setMainMinWidth] = useState<LayoutWidthBound>(defaultMainMinWidth);
	const [areas, setAreas] = useState<Partial<Record<LayoutArea, StoredLayoutArea>>>({});
	const [resizeSession, setResizeSession] = useState<ResizeSession | null>(null);
	const areaStatesRef = React.useRef<Partial<Record<LayoutArea, LayoutAreaAllocation>>>({});
	const configsRef = React.useRef<Partial<Record<LayoutArea, LayoutAreaConfig>>>({});
	const [hasInteraction, setHasInteraction] = useState(false);
	const adoptedConstraints = React.useRef<{
		occupiedWidth: number;
		mainMinWidth: LayoutWidthBound;
	} | null>(null);
	// Preserve the CSS handoff only while its available space is unchanged.
	const isPreservingInitialLayout =
		!hasInteraction &&
		(!adoptedConstraints.current ||
			(adoptedConstraints.current.occupiedWidth === occupiedWidth &&
				adoptedConstraints.current.mainMinWidth === mainMinWidth));
	const [initialStates, setInitialStates] = useState<Partial<Record<LayoutArea, LayoutAreaState>>>(
		{},
	);
	const inputsRef = React.useRef({ dimensions, occupiedWidth, mainMinWidth, areas, resizeSession });
	useEffect(() => {
		inputsRef.current = { dimensions, occupiedWidth, mainMinWidth, areas, resizeSession };
	}, [dimensions, occupiedWidth, mainMinWidth, areas, resizeSession]);
	useEffect(() => {
		if (
			adoptedConstraints.current &&
			(adoptedConstraints.current.occupiedWidth !== occupiedWidth ||
				adoptedConstraints.current.mainMinWidth !== mainMinWidth)
		) {
			setHasInteraction(true);
		}
		setResizeSession(null);
	}, [mainMinWidth, occupiedWidth]);

	useEffect(() => {
		const root = layoutRef?.current;
		let previous: LayoutDimensions | null = null;
		// Match the actual rem-based grid breakpoint, including browser font settings.
		const inlineChatQuery = window.matchMedia('(min-width: 40rem)');
		const inlineSideNavQuery = window.matchMedia('(min-width: 64rem)');
		const updateDimensions = (contentWidth?: number) => {
			const style = root && contentWidth === undefined ? getComputedStyle(root) : null;
			const computedWidth = Number.parseFloat(style?.width ?? '');
			const padding =
				(parseFloat(style?.paddingLeft ?? '') || 0) + (parseFloat(style?.paddingRight ?? '') || 0);
			const border =
				(parseFloat(style?.borderLeftWidth ?? '') || 0) +
				(parseFloat(style?.borderRightWidth ?? '') || 0);
			const layoutWidth =
				contentWidth ??
				(root
					? // Keep fractional CSS pixels, just as ResizeObserver does. Otherwise
						// its initial delivery could be mistaken for a viewport resize.
						Math.max(
							0,
							Number.isFinite(computedWidth)
								? computedWidth - (style?.boxSizing === 'border-box' ? padding + border : 0)
								: root.clientWidth - padding,
						)
					: window.innerWidth);
			const next = {
				viewportWidth: window.innerWidth,
				layoutWidth,
				isChatPanelOverlay: !inlineChatQuery.matches,
				isSideNavOverlay: !inlineSideNavQuery.matches,
			};
			if (
				previous?.viewportWidth === next.viewportWidth &&
				previous.layoutWidth === next.layoutWidth &&
				previous.isChatPanelOverlay === next.isChatPanelOverlay &&
				previous.isSideNavOverlay === next.isSideNavOverlay
			) {
				return;
			}
			if (previous) {
				setHasInteraction(true);
			}
			previous = next;
			setDimensions(next);
			setResizeSession(null);
		};
		updateDimensions();
		const observer = new ResizeObserver((entries) => {
			const entry = entries.find((entry) => entry.target === root);
			if (entry) {
				updateDimensions(entry.contentRect.width);
			}
		});
		if (root) {
			observer.observe(root);
		}
		const unbindResize = bind(window, { type: 'resize', listener: () => updateDimensions() });
		const unbindQuery = bind(inlineChatQuery, {
			type: 'change',
			listener: () => updateDimensions(),
		});
		const unbindSideNavQuery = bind(inlineSideNavQuery, {
			type: 'change',
			listener: () => updateDimensions(),
		});
		return () => {
			observer.disconnect();
			unbindResize();
			unbindQuery();
			unbindSideNavQuery();
		};
	}, [layoutRef]);

	const registerArea = useCallback((area: LayoutArea, config: LayoutAreaConfig) => {
		const previous = configsRef.current[area];
		if (
			adoptedConstraints.current &&
			(!previous ||
				previous.isOpen !== config.isOpen ||
				previous.requestedWidth !== config.requestedWidth ||
				previous.minWidth !== config.minWidth ||
				previous.maxWidth !== config.maxWidth ||
				previous.defaultWidth !== config.defaultWidth ||
				previous.compactDefaultWidth !== config.compactDefaultWidth)
		) {
			setHasInteraction(true);
		}
		configsRef.current[area] = config;
		setResizeSession((current) => {
			// A changed layout/configuration needs a fresh allocation. A controlled
			// acknowledgement for the resized area keeps its siblings fixed.
			return previous &&
				(previous.isOpen === config.isOpen ||
					(area === 'side-nav' && !config.isOpen && current?.area !== 'side-nav')) &&
				previous.minWidth === config.minWidth &&
				previous.maxWidth === config.maxWidth &&
				previous.defaultWidth === config.defaultWidth &&
				previous.compactDefaultWidth === config.compactDefaultWidth &&
				(previous.requestedWidth === config.requestedWidth ||
					(current?.area === area && current.completedWidth === config.requestedWidth) ||
					(area === 'side-nav' && !config.isOpen && current?.area !== 'side-nav'))
				? current
				: null;
		});
		setAreas((current) => {
			const existing = current[area];

			return {
				...current,
				[area]: {
					...existing,
					...config,
					liveResize: config.isOpen ? existing?.liveResize : undefined,
				},
			};
		});
	}, []);

	const unregisterArea = useCallback((area: LayoutArea) => {
		if (adoptedConstraints.current) {
			setHasInteraction(true);
		}
		delete configsRef.current[area];
		setResizeSession(null);
		setAreas((current) => {
			if (!current[area]) {
				return current;
			}
			// Closing uses isOpen: false and retains preferences. Unregistering means
			// the owning component unmounted; a replacement must start with its own defaults.
			const next = { ...current };
			delete next[area];
			return next;
		});
	}, []);

	const captureSiblingWidths = useCallback(
		(area: LayoutArea, mode: LayoutAreaMode = 'inline'): ResizeSession => {
			const baselineWidths: Partial<Record<LayoutArea, number>> = {};
			const overlayModes: ResizeSession['overlayModes'] = {};
			for (const areaName of ['side-nav', 'panel', 'chat-panel'] as const) {
				const state = areaStatesRef.current[areaName];
				if (state) {
					overlayModes[areaName] = state.mode;
				}
				if (state?.mode === 'inline') {
					baselineWidths[areaName] = state.width;
				}
			}
			return { area, baselineWidths, overlayModes: mode === 'overlay' ? overlayModes : undefined };
		},
		[],
	);

	const startResize = useCallback(
		(area: LayoutArea, mode: LayoutAreaMode) => {
			setHasInteraction(true);
			setResizeSession(captureSiblingWidths(area, mode));

			// Start from the effective width, which may already be compressed below the preferred width.
			// Reapplying the preferred width here would move the splitter away from the pointer.
			const renderedState = areaStatesRef.current[area];
			if (renderedState?.mode === mode) {
				setAreas((current) => {
					const existing = current[area];
					return existing
						? {
								...current,
								[area]: {
									...existing,
									liveResize: { mode, width: renderedState.width },
								},
							}
						: current;
				});
			}
		},
		[captureSiblingWidths],
	);

	const resize = useCallback((area: LayoutArea, mode: LayoutAreaMode, width: number) => {
		setAreas((current) => {
			const existing = current[area];
			if (existing?.liveResize?.mode === mode && existing.liveResize.width === width) {
				return current;
			}
			return existing
				? {
						...current,
						[area]: { ...existing, liveResize: { mode, width } },
					}
				: current;
		});
	}, []);

	const completeResize = useCallback(
		(area: LayoutArea, mode: LayoutAreaMode, width: number) => {
			setHasInteraction(true);
			if (mode === 'overlay') {
				const session = inputsRef.current.resizeSession;
				setResizeSession({
					...(session?.area === area && session.overlayModes
						? session
						: captureSiblingWidths(area, mode)),
					completedWidth: width,
				});
			}
			if (mode === 'inline') {
				const inputs = inputsRef.current;
				const session =
					inputs.resizeSession?.area === area && inputs.areas[area]?.liveResize
						? inputs.resizeSession
						: captureSiblingWidths(area);
				const existing = inputs.areas[area];
				if (inputs.dimensions && existing) {
					// Keyboard completion has no preview; calculate it using the accepted
					// request, not the parent's previous controlled width. Pointer completion
					// keeps below-minimum cascade results even though its payload is clamped.
					const completed = existing.liveResize
						? areaStatesRef.current
						: calculateLayoutAreaStates({
								...inputs.dimensions,
								occupiedWidth: inputs.occupiedWidth,
								mainMinWidth: inputs.mainMinWidth,
								areas: { ...inputs.areas, [area]: { ...existing, liveResize: { mode, width } } },
								resizeSession: session,
							});
					const completedWidths: ResizeSession['baselineWidths'] = {};
					for (const name of ['side-nav', 'panel', 'chat-panel'] as const) {
						if (completed[name]?.mode === 'inline') {
							completedWidths[name] = completed[name].width;
						}
					}
					setResizeSession({ ...session, completedWidth: width, completedWidths });
				}
			}
			setAreas((current) => {
				const existing = current[area];
				if (!existing) {
					return current;
				}

				if (mode === 'overlay' && area !== 'panel') {
					return {
						...current,
						[area]: { ...existing, liveResize: undefined, preferredOverlayWidth: width },
					};
				}

				return {
					...current,
					[area]: {
						...existing,
						liveResize: undefined,
						// Local panels have one preference, regardless of the resized mode.
						preferredWidth: width,
					},
				};
			});
		},
		[captureSiblingWidths],
	);

	useEffect(() => {
		// Loading the interaction engine is not a layout event. Adopt the CSS layout
		// without changing widths or modes; subsequent changes to configuration or
		// available space may redistribute it. Content stays mounted during the handoff.
		const root = layoutRef?.current;
		if (onUpdate && root && dimensions && isPreservingInitialLayout) {
			const measured: Partial<Record<LayoutArea, LayoutAreaState>> = {};
			const selectors = {
				'side-nav': ':scope > nav[data-layout-slot]',
				panel: '[data-layout-with-panel-slot]',
				'chat-panel': ':scope > [data-layout-chat-panel]',
			};
			for (const name of ['side-nav', 'panel', 'chat-panel'] as const) {
				const element = root.querySelector<HTMLElement>(selectors[name]);
				const config = areas[name];
				if (!element || !config?.isOpen) {
					continue;
				}
				const style = getComputedStyle(element);
				const mode = style.gridArea.split('/')[0].trim() === name ? 'inline' : 'overlay';
				measured[name] = {
					mode,
					width: element.getBoundingClientRect().width,
					minWidth: resolveLayoutWidth(config.minWidth, dimensions.viewportWidth),
				};
			}
			setInitialStates(measured);
		}
	}, [areas, dimensions, isPreservingInitialLayout, layoutRef, onUpdate]);
	const areaStates = useMemo(() => {
		if (!dimensions) {
			return {};
		}
		const allocated = calculateLayoutAreaStates({
			...dimensions,
			occupiedWidth,
			mainMinWidth,
			areas,
			resizeSession,
			initialModes:
				onUpdate && layoutRef?.current && isPreservingInitialLayout
					? {
							'side-nav': initialStates['side-nav']?.mode,
							panel: initialStates.panel?.mode,
							'chat-panel': initialStates['chat-panel']?.mode,
						}
					: undefined,
		});
		if (onUpdate && layoutRef?.current && isPreservingInitialLayout) {
			for (const name of ['side-nav', 'panel', 'chat-panel'] as const) {
				if (initialStates[name] && allocated[name]) {
					allocated[name] = { ...allocated[name], ...initialStates[name] };
				} else {
					delete allocated[name];
				}
			}
		}
		return allocated;
	}, [
		areas,
		mainMinWidth,
		resizeSession,
		dimensions,
		occupiedWidth,
		isPreservingInitialLayout,
		initialStates,
		layoutRef,
		onUpdate,
	]);
	useEffect(() => {
		if (
			hasInteraction &&
			resizeSession?.area !== 'side-nav' &&
			areas['side-nav']?.isOpen &&
			!areaStates['side-nav'] &&
			dimensions
		) {
			areas['side-nav'].onRequestClose?.();
		}
	}, [areaStates, areas, dimensions, hasInteraction, resizeSession]);

	useEffect(() => {
		areaStatesRef.current = areaStates;
	}, [areaStates]);

	// Read bounds lazily: changing a sibling's capacity must not publish new render
	// state or recreate drag listeners for a region whose own width did not change.
	const getResizeBounds = useCallback<LayoutAreaSizingContextValue['getResizeBounds']>((area) => {
		const bounds = areaStatesRef.current[area]?.resizeBounds;
		return bounds ? { min: `${bounds.min}px`, max: `${bounds.max}px` } : undefined;
	}, []);

	const value = useMemo<LayoutAreaSizingContextValue>(
		() => ({
			getResizeBounds,
			registerArea,
			unregisterArea,
			startResize,
			resize,
			completeResize,
			setMainMinWidth,
		}),
		[completeResize, getResizeBounds, registerArea, resize, startResize, unregisterArea],
	);
	const sideNavState = useStableAreaState(areaStates['side-nav']);
	const panelState = useStableAreaState(areaStates.panel);
	const chatPanelState = useStableAreaState(areaStates['chat-panel']);
	const SideNavStateProvider = layoutAreaStateContexts['side-nav'].Provider;
	const PanelStateProvider = layoutAreaStateContexts.panel.Provider;
	const ChatPanelStateProvider = layoutAreaStateContexts['chat-panel'].Provider;
	useEffect(() => {
		onReady?.(value);
		return () => onReady?.(null);
	}, [onReady, value]);
	useEffect(() => {
		if (!adoptedConstraints.current && (sideNavState || panelState || chatPanelState)) {
			adoptedConstraints.current = { occupiedWidth, mainMinWidth };
		}
		onUpdate?.({ 'side-nav': sideNavState, panel: panelState, 'chat-panel': chatPanelState });
	}, [onUpdate, sideNavState, panelState, chatPanelState, occupiedWidth, mainMinWidth]);

	return (
		<LayoutAreaSizingContext.Provider value={value}>
			<SideNavStateProvider value={sideNavState}>
				<PanelStateProvider value={panelState}>
					<ChatPanelStateProvider value={chatPanelState}>{children}</ChatPanelStateProvider>
				</PanelStateProvider>
			</SideNavStateProvider>
		</LayoutAreaSizingContext.Provider>
	);
}

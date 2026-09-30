import React, { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import { bind } from 'bind-event-listener';

import { calculateLayoutAreaStates } from './calculate-layout-area-states';
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
import { useOccupiedLayoutWidth } from './use-occupied-layout-width';

const defaultMainMinWidth = 320;

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

export function LayoutAreaSizingProvider({
	children,
	layoutRef,
}: {
	children: ReactNode;
	layoutRef?: React.RefObject<HTMLDivElement | null>;
}): JSX.Element {
	const occupiedWidth = useOccupiedLayoutWidth(layoutRef);
	const [dimensions, setDimensions] = useState<LayoutDimensions | null>(null);
	const [mainMinWidth, setMainMinWidth] = useState<LayoutWidthBound>(defaultMainMinWidth);
	const [areas, setAreas] = useState<Partial<Record<LayoutArea, StoredLayoutArea>>>({});
	const [resizeSession, setResizeSession] = useState<ResizeSession | null>(null);
	const areaStatesRef = React.useRef<Partial<Record<LayoutArea, LayoutAreaAllocation>>>({});
	const configsRef = React.useRef<Partial<Record<LayoutArea, LayoutAreaConfig>>>({});
	const openSequence = React.useRef(0);
	useEffect(() => {
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
			const layoutWidth =
				contentWidth ??
				(root
					? Math.max(
							0,
							root.clientWidth -
								(parseFloat(style?.paddingLeft ?? '') || 0) -
								(parseFloat(style?.paddingRight ?? '') || 0),
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
		configsRef.current[area] = config;
		setResizeSession((current) => {
			// A changed layout/configuration needs a fresh allocation. A controlled
			// acknowledgement for the resized area keeps its siblings fixed.
			return previous?.isOpen === config.isOpen &&
				previous.minWidth === config.minWidth &&
				previous.maxWidth === config.maxWidth &&
				previous.defaultWidth === config.defaultWidth &&
				previous.compactDefaultWidth === config.compactDefaultWidth &&
				(previous.requestedWidth === config.requestedWidth || current?.area === area)
				? current
				: null;
		});
		// Allocate once per registration, outside the updater React may replay. Gaps are
		// harmless: only relative ordering of closed-to-open transitions is significant.
		const openedAt = ++openSequence.current;
		setAreas((current) => {
			const existing = current[area];

			return {
				...current,
				[area]: {
					...existing,
					...config,
					liveResize: config.isOpen ? existing?.liveResize : undefined,
					openedAt: config.isOpen && !existing?.isOpen ? openedAt : existing?.openedAt,
				},
			};
		});
	}, []);

	const unregisterArea = useCallback((area: LayoutArea) => {
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

	const freezeSiblingWidths = useCallback((area: LayoutArea) => {
		const baselineWidths: Partial<Record<LayoutArea, number>> = {};
		for (const areaName of ['side-nav', 'panel', 'chat-panel'] as const) {
			const state = areaStatesRef.current[areaName];
			if (state?.mode === 'inline') {
				baselineWidths[areaName] = state.width;
			}
		}
		// Keep the same siblings fixed after completion, including while a controlled
		// consumer rejects or asynchronously accepts the requested width.
		setResizeSession({ area, baselineWidths });
	}, []);

	const startResize = useCallback(
		(area: LayoutArea, mode: LayoutAreaMode) => {
			if (mode !== 'inline') {
				return;
			}
			freezeSiblingWidths(area);

			// Start from the effective width, which may already be compressed below the preferred width.
			// Reapplying the preferred width here would move the splitter away from the pointer.
			const renderedState = areaStatesRef.current[area];
			if (renderedState?.mode === 'inline') {
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
		[freezeSiblingWidths],
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
			if (mode === 'inline') {
				// Keyboard resizing completes without a preceding pointer-drag session.
				freezeSiblingWidths(area);
			}
			setAreas((current) => {
				const existing = current[area];
				if (!existing) {
					return current;
				}

				if (mode === 'overlay') {
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
						preferredInlineWidth: width,
					},
				};
			});
		},
		[freezeSiblingWidths],
	);

	const areaStates = useMemo(
		() =>
			dimensions === null
				? {}
				: calculateLayoutAreaStates({
						...dimensions,
						occupiedWidth,
						mainMinWidth,
						areas,
						resizeSession,
					}),
		[areas, mainMinWidth, resizeSession, dimensions, occupiedWidth],
	);
	useEffect(() => {
		areaStatesRef.current = areaStates;
	}, [areaStates]);

	useEffect(() => {
		if (
			areaStates['side-nav']?.mode !== 'overlay' ||
			areaStates['chat-panel']?.mode !== 'overlay'
		) {
			return;
		}

		const sideNav = areas['side-nav'];
		const chatPanel = areas['chat-panel'];
		if (!sideNav?.isOpen || !chatPanel?.isOpen) {
			return;
		}

		if ((sideNav.openedAt ?? 0) > (chatPanel.openedAt ?? 0)) {
			chatPanel.onRequestClose?.();
		} else {
			sideNav.onRequestClose?.();
		}
	}, [areas, areaStates]);

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

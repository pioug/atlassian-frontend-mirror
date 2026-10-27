import React, {
	type ComponentType,
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';

import { bind, bindAll } from 'bind-event-listener';

import { defaultMainMinWidth } from './constants';
import {
	LayoutAreaSizingContext,
	type LayoutArea,
	type LayoutAreaConfig,
	type LayoutAreaSizingContextValue,
	type LayoutAreaState,
	type LayoutWidthBound,
} from './layout-area-sizing-context';
import type { LayoutAreaSizingRuntime } from './layout-area-sizing-runtime';
import { layoutAreaStateContexts } from './layout-area-state-contexts';
import { useCssLayoutAreaStates } from './use-css-layout-area-states';

/**
 * Stable, synchronous boundary for SSR content. The drag/cascade implementation
 * is a sibling, not a replacement wrapper, so loading it cannot remount the app.
 * CSS handles initial and responsive geometry; only splitter interaction requests
 * the asynchronous chunk. The eager observer reads modes without changing widths.
 */
export function LayoutAreaSizingProvider({
	children,
	layoutRef,
}: {
	children: ReactNode;
	layoutRef?: React.RefObject<HTMLDivElement | null>;
}): JSX.Element {
	const [Runtime, setRuntime] = useState<ComponentType<
		React.ComponentProps<typeof LayoutAreaSizingRuntime>
	> | null>(null);
	const [states, setStates] = useState<Partial<Record<LayoutArea, LayoutAreaState>>>({});
	const actions = useRef<LayoutAreaSizingContextValue | null>(null);
	const configs = useRef<Partial<Record<LayoutArea, LayoutAreaConfig>>>({});
	const [lastOpenedOverlay, setLastOpenedOverlay] = useState<'side-nav' | 'chat-panel' | null>(
		null,
	);
	const [configRevision, setConfigRevision] = useState(0);
	const cssModes = useCssLayoutAreaStates(layoutRef, configRevision, Runtime === null);
	const sideNavMode = states['side-nav']?.mode ?? cssModes['side-nav'];
	const chatPanelMode = states['chat-panel']?.mode ?? cssModes['chat-panel'];

	// Overlay dismissal is available before the sizing chunk loads. Keep the open
	// order here too: replaying registrations into the runtime loses that order.
	useEffect(() => {
		const inlineChatQuery = window.matchMedia('(min-width: 40rem)');
		const dismissOlderOverlay = () => {
			const sideNav = configs.current['side-nav'];
			const chatPanel = configs.current['chat-panel'];
			if (!sideNav?.isOpen || !chatPanel?.isOpen || !lastOpenedOverlay) {
				return;
			}
			// Before allocation, CSS puts both areas in overlay below 40rem. Once
			// sizing is active, also honour overlays caused by custom widths/slots.
			if (inlineChatQuery.matches && (sideNavMode !== 'overlay' || chatPanelMode !== 'overlay')) {
				return;
			}
			const olderOverlay = lastOpenedOverlay === 'side-nav' ? chatPanel : sideNav;
			olderOverlay.onRequestClose?.();
		};
		dismissOlderOverlay();
		return bind(inlineChatQuery, { type: 'change', listener: dismissOlderOverlay });
	}, [chatPanelMode, lastOpenedOverlay, sideNavMode]);

	const splitters = useRef(new Set<HTMLElement>());
	const registerSplitter = useCallback((element: HTMLElement) => {
		splitters.current.add(element);
		return () => {
			splitters.current.delete(element);
		};
	}, []);
	const mainMinWidth = useRef<LayoutWidthBound>(defaultMainMinWidth);
	const loadRef = useRef<() => void>(() => {});
	const ready = useRef(false);
	const waiting = useRef<Array<(ready: boolean) => void>>([]);
	const pending = useRef<Array<(runtime: LayoutAreaSizingContextValue) => void>>([]);
	const prepareResize = useCallback((): Promise<boolean> => {
		if (ready.current) {
			return Promise.resolve(true);
		}
		return new Promise((resolve) => {
			waiting.current.push(resolve);
			loadRef.current();
		});
	}, []);

	useEffect(() => {
		const root = layoutRef?.current;
		if (!root) {
			return;
		}
		let cancelled = false;
		let loading = false;
		const waitingForRuntime = waiting.current;
		const load = () => {
			if (loading) {
				return;
			}
			loading = true;
			void import(
				/* webpackChunkName: "@atlaskit-internal_navigation-layout-sizing" */ './layout-area-sizing-runtime'
			).then(
				({ LayoutAreaSizingRuntime }) => {
					if (!cancelled) {
						setRuntime(() => LayoutAreaSizingRuntime);
					}
				},
				() => {
					loading = false;
					pending.current = [];
					for (const resolve of waitingForRuntime.splice(0)) {
						resolve(false);
					}
				},
			);
		};
		loadRef.current = load;
		const loadForSplitter = (event: Event) => {
			if (!(event.target instanceof Node)) {
				return;
			}
			for (const splitter of splitters.current) {
				if (splitter.contains(event.target)) {
					load();
					return;
				}
			}
		};
		const unbindRoot = bindAll(root, [
			{ type: 'pointerover', listener: loadForSplitter, options: { passive: true } },
			{ type: 'focusin', listener: loadForSplitter },
			{ type: 'pointerdown', listener: loadForSplitter, options: { passive: true } },
		]);
		return () => {
			cancelled = true;
			ready.current = false;
			pending.current = [];
			for (const resolve of waitingForRuntime.splice(0)) {
				resolve(false);
			}
			loadRef.current = () => {};
			unbindRoot();
		};
	}, [layoutRef]);

	const onReady = useCallback((runtime: LayoutAreaSizingContextValue | null) => {
		actions.current = runtime;
		if (runtime) {
			runtime.setMainMinWidth(mainMinWidth.current);
			for (const area of ['side-nav', 'panel', 'chat-panel'] as const) {
				const config = configs.current[area];
				if (config) {
					runtime.registerArea(area, config);
				}
			}
		}
	}, []);
	const onUpdate = useCallback((next: Partial<Record<LayoutArea, LayoutAreaState>>) => {
		setStates(next);
		const runtime = actions.current;
		if (runtime && Object.values(next).some(Boolean)) {
			ready.current = true;
			for (const action of pending.current.splice(0)) {
				action(runtime);
			}
			for (const resolve of waiting.current.splice(0)) {
				resolve(true);
			}
		}
	}, []);
	const dispatch = useCallback((action: (runtime: LayoutAreaSizingContextValue) => void) => {
		if (ready.current && actions.current) {
			action(actions.current);
		} else {
			pending.current.push(action);
			loadRef.current();
		}
	}, []);
	const value = useMemo<LayoutAreaSizingContextValue>(
		() => ({
			prepareResize,
			registerSplitter,
			registerArea: (area, config) => {
				if (area !== 'panel' && config.isOpen && !configs.current[area]?.isOpen) {
					setLastOpenedOverlay(area);
				}
				configs.current[area] = config;
				setConfigRevision((revision) => revision + 1);
				actions.current?.registerArea(area, config);
			},
			unregisterArea: (area) => {
				delete configs.current[area];
				setConfigRevision((revision) => revision + 1);
				actions.current?.unregisterArea(area);
			},
			setMainMinWidth: (width) => {
				if (mainMinWidth.current !== width) {
					setConfigRevision((revision) => revision + 1);
				}
				mainMinWidth.current = width;
				actions.current?.setMainMinWidth(width);
			},
			getResizeBounds: (area) => actions.current?.getResizeBounds(area),
			startResize: (area, mode) => dispatch((runtime) => runtime.startResize(area, mode)),
			resize: (area, mode, width) => dispatch((runtime) => runtime.resize(area, mode, width)),
			completeResize: (area, mode, width) =>
				dispatch((runtime) => runtime.completeResize(area, mode, width)),
		}),
		[dispatch, prepareResize, registerSplitter],
	);
	const SideNavStateProvider = layoutAreaStateContexts['side-nav'].Provider;
	const PanelStateProvider = layoutAreaStateContexts.panel.Provider;
	const ChatPanelStateProvider = layoutAreaStateContexts['chat-panel'].Provider;
	return (
		<LayoutAreaSizingContext.Provider value={value}>
			<SideNavStateProvider value={states['side-nav']}>
				<PanelStateProvider value={states.panel}>
					<ChatPanelStateProvider value={states['chat-panel']}>{children}</ChatPanelStateProvider>
				</PanelStateProvider>
			</SideNavStateProvider>
			{Runtime && <Runtime layoutRef={layoutRef} onReady={onReady} onUpdate={onUpdate} />}
		</LayoutAreaSizingContext.Provider>
	);
}

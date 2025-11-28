import React, { createContext, type ReactNode, useContext, useMemo, useReducer } from 'react';

import type { Panel, PanelAction, PanelSystemState } from './types';

/**
 * Context for accessing the panel manager functions.
 * Provides a stable reference that doesn't cause re-renders on state changes.
 * @internal
 */
export const ManagerContext = createContext<PanelManager | null>(null);

/**
 * Context for accessing the panel system state.
 * Consumers of this context will re-render when state changes.
 * @internal
 */
export const StateContext = createContext<PanelSystemState | null>(null);

/**
 * Panel manager providing action methods for panel operations
 * @internal
 */
export type PanelManager = {
	openPanel: (instanceId: string, entryPoint: any, params?: any) => void;
	closePanel: (instanceId: string) => void;
};

/**
 * Props for the PanelProvider component
 */
export type PanelProviderProps = {
	/**
	 * Child components that will have access to the panel manager
	 */
	children: ReactNode;
	/**
	 * Optional initial state for the panel system
	 */
	initialState?: Partial<PanelSystemState>;
};

/**
 * Pure reducer function handling panel state transitions.
 * Manages PANEL_OPEN and PANEL_CLOSE actions.
 *
 * Note: Panel resizing (width) is handled locally in PanelContainer as UI state,
 * not global application state.
 *
 * TODO: For SSR support, panel widths should be persisted to localStorage
 * so that user preferences are restored across page reloads.
 */
function panelReducer(state: PanelSystemState, action: PanelAction): PanelSystemState {
	switch (action.type) {
		case 'PANEL_OPEN': {
			const { instanceId, entryPoint, params } = action.payload;
			const newPanel: Panel = {
				instanceId,
				entryPoint,
				params: params || {},
			};
			return {
				...state,
				activePanels: [...state.activePanels, newPanel],
			};
		}

		case 'PANEL_CLOSE': {
			const { instanceId } = action.payload;
			return {
				...state,
				activePanels: state.activePanels.filter((p) => p.instanceId !== instanceId),
			};
		}

		default:
			return state;
	}
}

/**
 * PanelProvider component that wraps your application to provide panel management context.
 *
 * Uses split contexts for optimal performance:
 * - ManagerContext: Provides stable panel manager functions (never re-renders consumers)
 * - StateContext: Provides panel state (re-renders consumers when state changes)
 *
 * This design prevents unnecessary re-renders of components that only use the manager.
 *
 * @example
 * ```tsx
 * import { PanelProvider, usePanelManager } from '@atlaskit/panel-system';
 *
 * export function App() {
 *   return (
 *     <PanelProvider>
 *       <YourComponent />
 *     </PanelProvider>
 *   );
 * }
 *
 * function YourComponent() {
 *   const { state, manager } = usePanelManager();
 *   return (
 *     <button onClick={() => manager.openPanel('id-1', entryPoint)}>
 *       Open Panel
 *     </button>
 *   );
 * }
 * ```
 */
export function PanelProvider({ children, initialState }: PanelProviderProps) {
	const [state, dispatch] = useReducer(panelReducer, {
		activePanels: [],
		...initialState,
	});

	// Create stable manager object with memoization
	// This object reference never changes, so ManagerContext consumers never re-render
	const manager = useMemo(() => {
		return {
			openPanel: (instanceId: string, entryPoint: any, params?: any) => {
				dispatch({
					type: 'PANEL_OPEN',
					payload: {
						instanceId,
						entryPoint,
						params,
					},
				});
			},

			closePanel: (instanceId: string) => {
				dispatch({
					type: 'PANEL_CLOSE',
					payload: {
						instanceId,
					},
				});
			},
		};
	}, []);

	return (
		<ManagerContext.Provider value={manager}>
			<StateContext.Provider value={state}>{children}</StateContext.Provider>
		</ManagerContext.Provider>
	);
}

/**
 * Hook to access the panel manager actions from context.
 * Must be called within a PanelProvider.
 *
 * The manager object is stable and memoized, so using this hook alone
 * won't cause re-renders when state changes.
 *
 * @throws {Error} If called outside of a PanelProvider
 * @internal
 */
export function usePanelActionsInternal(): PanelManager {
	const manager = useContext(ManagerContext);

	if (!manager) {
		throw new Error(
			'usePanelActionsInternal must be used within a <PanelProvider>. ' +
				'Wrap your app with: <PanelProvider><App /></PanelProvider>',
		);
	}

	return manager;
}

/**
 * Hook to access the panel system state from context.
 * Must be called within a PanelProvider.
 *
 * Consumers of this hook will re-render when state changes.
 *
 * @throws {Error} If called outside of a PanelProvider
 * @internal
 */
export function usePanelStateInternal(): PanelSystemState {
	const state = useContext(StateContext);

	if (!state) {
		throw new Error(
			'usePanelStateInternal must be used within a <PanelProvider>. ' +
				'Wrap your app with: <PanelProvider><App /></PanelProvider>',
		);
	}

	return state;
}

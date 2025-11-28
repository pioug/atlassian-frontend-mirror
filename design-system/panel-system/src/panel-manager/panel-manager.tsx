import { usePanelActionsInternal, usePanelStateInternal } from './panel-provider';
import type { PanelSystemState } from './types';

/**
 * React hook to access the panel manager and state.
 * Must be called within a PanelProvider.
 *
 * **Important:** This hook reads from two separate contexts:
 * - Manager context is stable and never changes
 * - State context updates when panels open/close/resize
 *
 * If you only need the manager (to call openPanel, closePanel, etc.),
 * consider using usePanelActions() instead to avoid unnecessary re-renders.
 *
 * @throws {Error} If called outside of a PanelProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { state, manager } = usePanelManager();
 *   return (
 *     <>
 *       <button onClick={() => manager.openPanel('id-1', entryPoint)}>
 *         Open
 *       </button>
 *       {state.activePanels.map(panel => (
 *         <Panel key={panel.instanceId} panel={panel} />
 *       ))}
 *     </>
 *   );
 * }
 * ```
 */
export function usePanelManager(): {
	state: PanelSystemState;
	manager: ReturnType<typeof usePanelActionsInternal>;
} {
	const manager = usePanelActionsInternal();
	const state = usePanelStateInternal();

	return {
		state,
		manager,
	};
}

/**
 * Convenience hook to access only the panel manager actions.
 * Use this if you don't need the state to avoid unnecessary re-renders.
 *
 * @throws {Error} If called outside of a PanelProvider
 *
 * @example
 * ```tsx
 * function OpenButton() {
 *   const manager = usePanelActions();
 *   // This component won't re-render when panels open/close/resize
 *   return (
 *     <button onClick={() => manager.openPanel('id-1', entryPoint)}>
 *       Open
 *     </button>
 *   );
 * }
 * ```
 */
export const usePanelActions = usePanelActionsInternal;

/**
 * Convenience hook to access only the panel state.
 * Use this if you only need to read the state.
 *
 * @throws {Error} If called outside of a PanelProvider
 *
 * @example
 * ```tsx
 * function PanelList() {
 *   const state = usePanelState();
 *   return (
 *     <>
 *       {state.activePanels.map(panel => (
 *         <Panel key={panel.instanceId} panel={panel} />
 *       ))}
 *     </>
 *   );
 * }
 * ```
 */
export const usePanelState = usePanelStateInternal;

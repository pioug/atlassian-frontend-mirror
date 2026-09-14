import { useScrollbarHarmonisation } from './use-scrollbar-harmonisation';

/**
 * Compatibility adapter for applications that cannot call the hook directly, such as class-based
 * roots. Function components should prefer `useScrollbarHarmonisation`. Both APIs use the shared
 * rollout gate and should be used instead of managing the document attribute directly.
 */
export function ScrollbarHarmonisation(): null {
	useScrollbarHarmonisation();

	return null;
}

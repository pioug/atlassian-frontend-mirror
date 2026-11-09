import type { QuickInsertItem } from '../provider-factory/quick-insert-provider';

/**
 * Compatibility helper for existing package consumers; Editor callers check item.onBeforeSelect directly.
 */
export const runInsertMenuItemCheck = (
	item: QuickInsertItem,
	options: Parameters<NonNullable<QuickInsertItem['onBeforeSelect']>>[0],
	onAllowed: () => void,
): void => {
	if (item.onBeforeSelect?.(options) !== false) {
		onAllowed();
	}
};

import { useCallback } from 'react';

import type { QuickInsertMenuItemProps } from './QuickInsertMenuItem';
import { useQuickInsertContext } from './useQuickInsertContext';

export const useQuickInsertMenuItemSelection = (
	onSelect: QuickInsertMenuItemProps['onSelect'],
	onBeforeSelect?: QuickInsertMenuItemProps['onBeforeSelect'],
): (() => void) => {
	const { editorView, select } = useQuickInsertContext();

	return useCallback(() => {
		if (onBeforeSelect?.() === false) {
			return;
		}
		select((selectionContext) =>
			onSelect({
				editorView,
				insert: selectionContext.insert,
				source: selectionContext.source,
			}),
		);
	}, [editorView, onBeforeSelect, onSelect, select]);
};

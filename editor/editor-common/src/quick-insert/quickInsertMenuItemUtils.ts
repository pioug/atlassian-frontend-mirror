import { useCallback } from 'react';

import type { QuickInsertMenuItemProps } from './QuickInsertMenuItem';
import { useQuickInsertContext } from './useQuickInsertContext';

export const useQuickInsertMenuItemSelection = (
	onSelect: QuickInsertMenuItemProps['onSelect'],
): (() => void) => {
	const { editorView, select } = useQuickInsertContext();

	return useCallback(
		() =>
			select((selectionContext) =>
				onSelect({
					editorView,
					insert: selectionContext.insert,
					source: selectionContext.source,
				}),
			),
		[editorView, onSelect, select],
	);
};

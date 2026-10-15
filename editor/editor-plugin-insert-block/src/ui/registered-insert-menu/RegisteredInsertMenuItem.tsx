import React, { createContext, useCallback, useContext, useMemo } from 'react';

import { INPUT_METHOD } from '@atlaskit/editor-common/analytics/types/enums';
import { insertSelectedItem } from '@atlaskit/editor-common/insert';
import type { QuickInsertSelectionHandler } from '@atlaskit/editor-common/quick-insert/context';
import { QuickInsertProvider } from '@atlaskit/editor-common/quick-insert/provider';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { SurfaceContext, RegisterMenuItem } from '@atlaskit/editor-ui-control-model/types';

// Preview updates must remain live while react-virtualized caches row elements during scrolling.
export const RegisteredInsertMenuPreviewContext: React.Context<string | undefined> = createContext<
	string | undefined
>(undefined);

type Props = {
	editorView: EditorView;
	id: string;
	isOffline: boolean;
	isSelected: boolean;
	menuOpenId: symbol;
	onClose: () => void;
	registration: RegisterMenuItem;
	surfaceContext: SurfaceContext;
};

export const RegisteredInsertMenuItem = ({
	editorView,
	id,
	isOffline,
	isSelected,
	menuOpenId,
	onClose,
	registration,
	surfaceContext,
}: Props): React.JSX.Element => {
	const Component = registration.component ?? React.Fragment;
	const activePreviewItemKey = useContext(RegisteredInsertMenuPreviewContext);
	const isPreviewActive = activePreviewItemKey === registration.key;
	const select = useCallback(
		(selectionHandler: QuickInsertSelectionHandler) => {
			// Close first so a registered item may safely focus the editor or open its picker.
			onClose();
			queueMicrotask(() => {
				const { state } = editorView;
				const insert = (content?: Parameters<typeof insertSelectedItem>[0], options = {}) =>
					insertSelectedItem(content, options)(state, state.tr, state.selection.head);
				const transaction = selectionHandler({ insert, source: INPUT_METHOD.INSERT_MENU });
				if (transaction) {
					editorView.dispatch(transaction);
				}
			});
		},
		[editorView, onClose],
	);
	const contextValue = useMemo(
		() => ({
			editorView,
			isOffline,
			item: { id, isPreviewActive, isSelected },
			menuOpenId,
			select,
			surface: 'toolbar' as const,
			surfaceContext,
		}),
		[editorView, id, isOffline, isPreviewActive, isSelected, menuOpenId, select, surfaceContext],
	);

	return (
		<QuickInsertProvider value={contextValue}>
			<Component>{null}</Component>
		</QuickInsertProvider>
	);
};

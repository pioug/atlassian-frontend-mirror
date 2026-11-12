import React, { useCallback, useSyncExternalStore } from 'react';

import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import { ConfirmationModal } from '../ConfirmationModal';
import type { ConfirmDialogStore } from './confirm-dialog-store';

type ConfirmDialogProps = {
	editorView: EditorView;
	store: ConfirmDialogStore;
	testId?: string;
};

/**
 * Renders the dialog opened with `store.show`. Render it where it outlives the toolbar, e.g. in a
 * plugin `contentComponent`: menus close and the toolbar hides when the dialog takes focus.
 */
export const ConfirmDialog = ({
	editorView,
	store,
	testId,
}: ConfirmDialogProps): React.JSX.Element => {
	const options = useSyncExternalStore(store.subscribe, store.getOptions, store.getOptions);

	const onConfirm = useCallback(
		(isChecked = false) => {
			const command = options?.onConfirm?.(isChecked);
			command?.(editorView.state, editorView.dispatch, editorView);
		},
		[options, editorView],
	);

	const onClose = useCallback(() => {
		store.hide();
		// The dialog takes focus from the editor; restore it so the cursor does not jump.
		if (!editorView.hasFocus()) {
			editorView.focus();
		}
	}, [store, editorView]);

	return (
		<ConfirmationModal testId={testId} options={options} onConfirm={onConfirm} onClose={onClose} />
	);
};

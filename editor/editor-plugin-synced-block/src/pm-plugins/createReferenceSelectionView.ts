import { bind } from 'bind-event-listener';

import { SyncBlockSharedCssClassName } from '@atlaskit/editor-common/sync-block';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

const getSelectedReference = (view: EditorView): Element | null => {
	const selection = view.dom.ownerDocument.getSelection();
	const anchor = selection?.anchorNode;
	const anchorElement = anchor instanceof Element ? anchor : anchor?.parentElement;
	const renderer = anchorElement?.closest(`.${SyncBlockSharedCssClassName.renderer}`);
	if (!renderer || !selection?.focusNode || !renderer.contains(selection.focusNode)) {
		return null;
	}
	const reference = renderer.closest(`.${SyncBlockSharedCssClassName.prefix}`);
	return reference && view.dom.contains(reference) ? reference : null;
};

export const createReferenceSelectionView = (view: EditorView): { destroy: () => void } => {
	const syncReferenceSelection = () => {
		if (!view.editable) {
			return;
		}
		const reference = getSelectedReference(view);
		if (!reference) {
			return;
		}
		const pos = view.posAtDOM(reference, 0);
		const { doc, schema, selection } = view.state;
		if (
			doc.nodeAt(pos)?.type !== schema.nodes.syncBlock ||
			(selection instanceof NodeSelection && selection.from === pos)
		) {
			return;
		}
		// The selectable renderer owns native focus, so PM's observer ignores its selection.
		// Track the containing atom without focusing the editor or clearing highlighted text.
		view.dispatch(view.state.tr.setSelection(NodeSelection.create(doc, pos)));
	};
	const unbind = bind(view.dom.ownerDocument, {
		type: 'selectionchange',
		listener: syncReferenceSelection,
	});
	return { destroy: unbind };
};

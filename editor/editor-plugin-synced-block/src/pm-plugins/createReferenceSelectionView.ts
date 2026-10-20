import { bindAll } from 'bind-event-listener';

import {
	SyncBlockSharedCssClassName,
	SyncBlockLabelSharedCssClassName,
} from '@atlaskit/editor-common/styles/sync-block';
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
	const syncReferenceSelection = (reference: Element | null) => {
		if (!view.editable || !reference) {
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
	const unbind = bindAll(view.dom.ownerDocument, [
		{
			type: 'selectionchange',
			listener: () => syncReferenceSelection(getSelectedReference(view)),
		},
		{
			type: 'click',
			listener: (event) => {
				if (event.button !== 0 || !view.editable) {
					return;
				}
				const target = event.target instanceof Element ? event.target : null;
				const reference = target?.closest(`.${SyncBlockSharedCssClassName.prefix}`);
				if (!reference || !view.dom.contains(reference)) {
					return;
				}
				// Edge clicks never create a native selection inside the renderer.
				syncReferenceSelection(reference);
				if (
					!target?.closest(`.${SyncBlockSharedCssClassName.renderer}`) &&
					!target?.closest(`.${SyncBlockLabelSharedCssClassName.labelClassName}`)
				) {
					view.focus();
				}
			},
		},
	]);
	return { destroy: unbind };
};

import type { EditorView } from '@atlaskit/editor-prosemirror/view';

export function taskItemOnChange(view: EditorView, event: Event): void {
	const { target } = event;
	if (
		!target ||
		!(target instanceof HTMLInputElement) ||
		target.type !== 'checkbox' ||
		target.getAttribute('data-input-type') !== 'lazy-task-item'
	) {
		return;
	}
	const pos = view.posAtDOM(target, 0);
	// Resolve the position in the current document
	const resolvedPos = view.state.doc.resolve(pos);
	// Access the parent node
	const parentNode = resolvedPos?.parent;
	if (parentNode?.type?.name !== 'taskItem') {
		return;
	}
	const parentPos = resolvedPos.before(resolvedPos.depth);

	const tr = view.state.tr.setNodeMarkup(parentPos, null, {
		...parentNode.attrs,
		state: target.checked ? 'DONE' : 'TODO',
	});
	view.dispatch(tr);
}

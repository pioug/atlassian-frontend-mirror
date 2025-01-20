import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

export function taskItemOnChange(view: EditorView, event: Event) {
	const { target } = event;
	if (
		!target ||
		!(target instanceof HTMLInputElement) ||
		target.type !== 'checkbox' ||
		target.getAttribute('data-input-type') !== 'lazy-task-item' ||
		!fg('platform_editor_lazy_task_item_check')
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

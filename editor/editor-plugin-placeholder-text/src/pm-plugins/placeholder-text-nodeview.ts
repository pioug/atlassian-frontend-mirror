import { browser as browserLegacy, getBrowserInfo } from '@atlaskit/editor-common/browser';
import type { getPosHandler } from '@atlaskit/editor-common/react-node-view';
import { ZERO_WIDTH_SPACE } from '@atlaskit/editor-common/whitespace';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { Selection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView, NodeView } from '@atlaskit/editor-prosemirror/view';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

type PmMutationRecord =
	| MutationRecord
	| {
			target: Node;
			type: 'selection';
	  };

const serializePlaceholderNode = (node: PMNode): HTMLElement => {
	const element = document.createElement('span');
	const browser = expValEquals('platform_editor_hydratable_ui', 'isEnabled', true)
		? getBrowserInfo()
		: browserLegacy;

	element.classList.add('pm-placeholder');

	// the inline node api test suite requires the following class name
	element.classList.add('placeholderView-content-wrap');

	element.innerText = ZERO_WIDTH_SPACE;

	const elementChildren = document.createElement('span');
	elementChildren.classList.add('pm-placeholder__text');
	elementChildren.dataset.placeholder = node.attrs.text;

	elementChildren.setAttribute('contenteditable', 'false');

	element.appendChild(elementChildren);
	if (browser.safari) {
		element.appendChild(document.createTextNode(ZERO_WIDTH_SPACE));
	} else {
		element.appendChild(document.createElement('wbr'));
	}

	return element;
};

export class PlaceholderTextNodeView implements NodeView {
	public readonly dom: Node;

	public constructor(
		private readonly node: PMNode,
		private readonly view: EditorView,
		private readonly getPos: getPosHandler,
	) {
		this.dom = serializePlaceholderNode(this.node);
		this.getPos = getPos;
	}

	public stopEvent(e: Event) {
		if (e.type === 'mousedown' && typeof this.getPos === 'function') {
			e.preventDefault();

			const { view } = this;
			const startNodePosition = this.getPos();

			if (typeof startNodePosition !== 'number') {
				return false;
			}

			const tr = view.state.tr;

			tr.setSelection(Selection.near(tr.doc.resolve(startNodePosition)));

			view.dispatch(tr);

			if (!view.hasFocus()) {
				window.requestAnimationFrame(() => {
					view.focus();
				});
			}

			return true;
		}

		return false;
	}

	public ignoreMutation(record: PmMutationRecord) {
		if (typeof this.getPos !== 'function' || record.type !== 'selection') {
			return true;
		}

		const { view, node } = this;
		const placeholderStartPosition = this.getPos();
		if (typeof placeholderStartPosition !== 'number') {
			return false;
		}
		const placeholderEndPosition = placeholderStartPosition + node.nodeSize;
		const selection = view.state.selection;

		// when the selection is set right after the placeholder.
		// we should let ProseMirror deal with this edge-case
		if (selection.from === placeholderEndPosition) {
			return false;
		}

		const isSelectionAtPlaceholder = selection.from === placeholderStartPosition;
		const isSelectionAfterlaceholder = selection.from > placeholderEndPosition;

		if (isSelectionAtPlaceholder || isSelectionAfterlaceholder) {
			const tr = view.state.tr;

			tr.setSelection(Selection.near(tr.doc.resolve(placeholderEndPosition)));

			view.dispatch(tr);
			return true;
		}

		return true;
	}
}

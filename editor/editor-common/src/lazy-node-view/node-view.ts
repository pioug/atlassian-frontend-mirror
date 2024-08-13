import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView, NodeView } from '@atlaskit/editor-prosemirror/view';

/**
 * 🧱 Internal: Editor FE Platform
 *
 * A NodeView that serves as a placeholder until the actual NodeView is loaded.
 */
export class LazyNodeView implements NodeView {
	dom: Node;
	contentDOM?: HTMLElement;
	private node: PMNode;

	constructor(node: PMNode, view: EditorView, getPos: () => number | undefined) {
		this.node = node;

		if (typeof node.type?.spec?.toDOM !== 'function') {
			this.dom = document.createElement('div');
			return;
		}

		const fallback = DOMSerializer.renderSpec(document, node.type.spec.toDOM(node));

		this.dom = fallback.dom;
		this.contentDOM = fallback.contentDOM;

		if (this.dom instanceof HTMLElement) {
			// This attribute is mostly used for debugging purposed
			// It will help us to found out when the node was replaced
			this.dom.setAttribute('data-lazy-node-view', node.type.name);
			// This is used on Libra tests
			// We are using this to make sure all lazy noded were replaced
			// before the test started
			this.dom.setAttribute('data-lazy-node-view-fallback', 'true');
		}
	}

	ignoreMutation(mutation: MutationRecord | { type: 'selection'; target: Element }) {
		if (this.node.type.isTextblock) {
			return false;
		}

		return true;
	}
}

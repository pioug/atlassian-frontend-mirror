import { bind } from 'bind-event-listener';

import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView, NodeView } from '@atlaskit/editor-prosemirror/view';

const ruleNodeViewAttribute = 'data-rule-node-view';

export class RuleNodeView implements NodeView {
	dom: Node;
	private node: PMNode;
	private readonly view: EditorView;
	// when there is only 1 rule node on the page and it is not editable, clicking on it does not focus the editor and Cmd+C/ Ctrl+C shortcut will not work. this mouse down listener adds focus to the editor.
	private readonly handleMousedown = (): void => {
		if (!this.view.hasFocus()) {
			this.view.focus();
		}
	};
	private readonly unbindMousedown: () => void;

	constructor(node: PMNode, view: EditorView) {
		this.node = node;
		this.view = view;
		const dom = this.view.dom.ownerDocument.createElement('div');
		this.dom = dom;

		dom.setAttribute(ruleNodeViewAttribute, '');
		dom.setAttribute('contenteditable', 'inherit');
		this.unbindMousedown = bind(dom, {
			type: 'mousedown',
			listener: this.handleMousedown,
		});
		this.update(node);
	}

	update(node: PMNode): boolean {
		if (node.type !== this.node.type) {
			return false;
		}
		if (this.dom.firstChild && node.sameMarkup(this.node)) {
			this.node = node;
			return true;
		}
		const toDOM = node.type.spec.toDOM;
		if (!toDOM) {
			return false;
		}

		const { dom } = DOMSerializer.renderSpec(this.view.dom.ownerDocument, toDOM(node));
		if (dom instanceof HTMLElement) {
			dom.contentEditable = 'false';
		}
		if (this.dom.firstChild) {
			this.dom.replaceChild(dom, this.dom.firstChild);
		} else {
			this.dom.appendChild(dom);
		}
		this.node = node;
		return true;
	}

	ignoreMutation(): boolean {
		return true;
	}

	destroy(): void {
		this.unbindMousedown();
	}
}

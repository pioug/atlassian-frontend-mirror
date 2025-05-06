import { IntlShape } from 'react-intl-next';

import { DOMSerializer, type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { NodeView } from '@atlaskit/editor-prosemirror/view';

import { decisionItemToDOM } from './decisionItemNodeSpec';

export class DecisionItemVanilla implements NodeView {
	dom: Node;
	public contentDOM?: HTMLElement;
	private hasChildren: boolean | undefined = undefined;

	private updateHasChildren(node: PMNode): boolean {
		const currentlyHasChildren = node.childCount > 0;
		if (currentlyHasChildren !== this.hasChildren) {
			this.hasChildren = currentlyHasChildren;
			this.contentDOM?.toggleAttribute('data-empty', !currentlyHasChildren);
		}
		return this.hasChildren;
	}

	constructor(node: PMNode, intl: IntlShape) {
		const spec = decisionItemToDOM(node, intl);
		const { dom, contentDOM } = DOMSerializer.renderSpec(document, spec);
		this.dom = dom;
		this.contentDOM = contentDOM;
		this.updateHasChildren(node);
	}

	public update(node: PMNode): boolean {
		this.updateHasChildren(node);
		return true;
	}
}

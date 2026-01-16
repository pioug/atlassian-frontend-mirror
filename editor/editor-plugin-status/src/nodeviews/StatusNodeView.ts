import { type IntlShape } from 'react-intl-next';

import { statusMessages as messages } from '@atlaskit/editor-common/messages';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { NodeView } from '@atlaskit/editor-prosemirror/view';

import { statusToDOM } from './statusNodeSpec';

/**
 *
 */
export class StatusNodeView implements NodeView {
	dom: Node;
	domElement: HTMLElement | undefined;
	private box: HTMLElement | null = null;
	private textContainer: HTMLElement | null = null;
	private node: PMNode;
	private intl: IntlShape;

	/**
	 *
	 * @param node
	 * @param intl
	 * @example
	 */
	constructor(node: PMNode, intl: IntlShape) {
		this.node = node;
		this.intl = intl;
		const spec = statusToDOM(node);
		const { dom } = DOMSerializer.renderSpec(document, spec);
		this.dom = dom;
		this.domElement = dom instanceof HTMLElement ? dom : undefined;
		if (this.domElement) {
			this.box = this.domElement.querySelector('.status-lozenge-span');
			this.textContainer = this.domElement.querySelector('.lozenge-text');
		}

		if (!node.attrs.text) {
			this.setPlaceholder();
		}
	}

	private setPlaceholder() {
		if (this.textContainer && this.domElement) {
			this.textContainer.textContent = this.intl.formatMessage(messages.placeholder);
			this.domElement.style.setProperty('opacity', '0.83');
		}
	}

	/**
	 *
	 * @param node
	 * @example
	 */
	update(node: PMNode): boolean {
		if (node.type !== this.node.type) {
			return false;
		}

		if (this.textContainer && node.attrs.text !== this.node.attrs.text) {
			this.textContainer.textContent = node.attrs.text;
		}

		if (node.attrs.color !== this.node.attrs.color) {
			this.box?.setAttribute('data-color', node.attrs.color);
		}

		if (!node.attrs.text) {
			this.setPlaceholder();
		}

		if (node.attrs.text && this.domElement) {
			this.domElement.style.setProperty('opacity', '1');
		}

		this.node = node;

		return true;
	}
}

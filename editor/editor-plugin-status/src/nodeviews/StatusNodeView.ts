import { IntlShape } from 'react-intl-next';

import { statusMessages as messages } from '@atlaskit/editor-common/messages';
import { logException } from '@atlaskit/editor-common/monitoring';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { NodeView } from '@atlaskit/editor-prosemirror/view';

import { statusToDOM } from './statusNodeSpec';

export class StatusNodeView implements NodeView {
	dom: HTMLElement = document.createElement('div');
	private box: HTMLElement | null = null;
	private textContainer: HTMLElement | null = null;
	private node: PMNode;
	private intl: IntlShape;

	private static logError(error: Error) {
		void logException(error, {
			location: 'editor-plugin-status/StatusNodeView',
		});
	}

	constructor(node: PMNode, intl: IntlShape) {
		this.node = node;
		this.intl = intl;

		try {
			const spec = statusToDOM(node);
			const { dom } = DOMSerializer.renderSpec(document, spec);
			if (!(dom instanceof HTMLElement)) {
				throw new Error('DOMSerializer.renderSpec() did not return HTMLElement');
			}
			this.dom = dom;
			this.box = this.dom.querySelector('.status-lozenge-span');
			this.textContainer = this.dom.querySelector('.lozenge-text');

			if (!node.attrs.text) {
				this.setPlaceholder();
			}
		} catch (error) {
			StatusNodeView.logError(
				error instanceof Error ? error : new Error('Unknown error on StatusNodeView constructor'),
			);
			this.renderFallback();
		}
	}

	private setPlaceholder() {
		if (this.textContainer) {
			this.textContainer.textContent = this.intl.formatMessage(messages.placeholder);
			this.dom.style.setProperty('opacity', '0.5');
		}
	}

	private renderFallback() {
		const fallbackElement = document.createElement('span');
		fallbackElement.innerText = this.node.attrs.text;
		this.dom.appendChild(fallbackElement);
	}

	update(node: PMNode) {
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

		if (node.attrs.text) {
			this.dom.style.setProperty('opacity', '1');
		}

		this.node = node;

		return true;
	}
}

import { IntlShape } from 'react-intl-next';

import { logException } from '@atlaskit/editor-common/monitoring';
import { DOMSerializer, type Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { NodeView } from '@atlaskit/editor-prosemirror/view';

import { decisionItemToDOM } from './decisionItemNodeSpec';

export class DecisionItemVanilla implements NodeView {
	public dom: HTMLElement = document.createElement('div');
	public contentDOM?: HTMLElement;
	private hasChildren: boolean | undefined = undefined;

	private logError(error: Error): void {
		void logException(error, {
			location: 'editor-plugin-tasks-and-decisions/DecisionItemVanilla',
		});
	}

	private updateHasChildren(node: PMNode): boolean {
		const currentlyHasChildren = node.childCount > 0;
		if (currentlyHasChildren !== this.hasChildren) {
			this.hasChildren = currentlyHasChildren;
			this.contentDOM?.toggleAttribute('data-empty', !currentlyHasChildren);
		}
		return this.hasChildren;
	}

	constructor(node: PMNode, intl: IntlShape) {
		try {
			const spec = decisionItemToDOM(node, intl);
			const { dom, contentDOM } = DOMSerializer.renderSpec(document, spec);
			if (!(dom instanceof HTMLElement)) {
				throw new Error('DOMSerializer did not return an HTMLElement');
			}
			this.dom = dom;
			this.contentDOM = contentDOM;
			this.updateHasChildren(node);
		} catch (caughtError) {
			const error =
				caughtError instanceof Error
					? caughtError
					: new Error(
							'Unknown error on DecisionItemVanilla Node View constructor - ' + String(caughtError),
						);
			this.logError(error);
			this.renderFallback();
		}
	}

	public update(node: PMNode): boolean {
		this.updateHasChildren(node);
		return true;
	}

	private renderFallback(): void {
		const fallback = document.createElement('div');
		fallback.setAttribute('data-decision-item-fallback', 'true');
		this.dom.appendChild(fallback);
		this.contentDOM = fallback;
	}
}

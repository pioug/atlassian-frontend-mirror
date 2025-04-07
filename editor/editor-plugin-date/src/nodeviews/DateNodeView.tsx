import { UnbindFn, bind } from 'bind-event-listener';
import { IntlShape } from 'react-intl-next';

import { logException } from '@atlaskit/editor-common/monitoring';
import type { getPosHandlerNode } from '@atlaskit/editor-common/types';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { NodeView } from '@atlaskit/editor-prosemirror/view';

import { setDatePickerAt } from '../pm-plugins/actions';

import { dateToDOM } from './dateNodeSpec';

export class DateNodeView implements NodeView {
	private readonly node: PMNode;
	private clickUnBind: UnbindFn | undefined;

	readonly dom: HTMLElement = document.createElement('span');

	private static logError(error: Error) {
		void logException(error, {
			location: 'editor-plugin-date/DateNodeView',
		});
	}

	constructor(node: PMNode, view: EditorView, getPos: getPosHandlerNode, intl: IntlShape) {
		this.node = node;

		try {
			const spec = dateToDOM(node, view.state, getPos, intl);
			const { dom } = DOMSerializer.renderSpec(document, spec);

			if (!(dom instanceof HTMLElement)) {
				throw new Error('DOMSerializer.renderSpec() did not return HTMLElement');
			}

			this.dom = dom;

			this.clickUnBind = bind(this.dom, {
				type: 'click',
				listener: (event) => {
					event.stopImmediatePropagation();
					const { state, dispatch } = view;
					setDatePickerAt(state.selection.from)(state, dispatch);
				},
			});
		} catch (error) {
			DateNodeView.logError(
				error instanceof Error ? error : new Error('Unknown error on DateNodeView constructor'),
			);
			this.renderFallback();
		}
	}
	private renderFallback() {
		const fallbackElement = document.createElement('span');
		fallbackElement.innerText = this.node.attrs.timestamp;
		this.dom.appendChild(fallbackElement);
	}
	destroy() {
		this.clickUnBind && this.clickUnBind();
	}
}

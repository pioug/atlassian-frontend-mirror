import { IntlShape } from 'react-intl-next';

import { logException } from '@atlaskit/editor-common/monitoring';
import type { getPosHandlerNode } from '@atlaskit/editor-common/types';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { Decoration, NodeView } from '@atlaskit/editor-prosemirror/view';

import { setDatePickerAt } from '../pm-plugins/actions';

import { dateToDOM } from './dateNodeSpec';

export class DateNodeView implements NodeView {
	private node: PMNode;
	private readonly intl: IntlShape;
	private readonly view: EditorView;
	private readonly getPos: getPosHandlerNode;

	private parentTaskState: string = '';

	readonly dom: HTMLElement = document.createElement('span');

	constructor(
		node: PMNode,
		view: EditorView,
		getPos: getPosHandlerNode,
		intl: IntlShape,
		decorations: ReadonlyArray<Decoration>,
	) {
		this.node = node;
		this.intl = intl;
		this.view = view;
		this.getPos = getPos;
		this.dom = this.createDOM(node);
		this.parentTaskState = DateNodeView.getParentTaskState(decorations);
	}
	update(node: PMNode, decorations: ReadonlyArray<Decoration>) {
		// we're only interested in two scenarios to trigger a DOM update:
		// 		1. the date value (timestamp) has changed
		// 		2. A wrapping taskitem state (if present) has changed
		// in all other cases, we tell prosemirror to ignore DOM updates
		// if new changes are added to the DOM structure, they will need to be
		// coded here
		const hasDateChanged = node.attrs.timestamp !== this.node.attrs.timestamp;
		const parentTaskState = DateNodeView.getParentTaskState(decorations);
		const parentTaskStateChanged = parentTaskState !== this.parentTaskState;

		// update local state after comparisons ...
		this.parentTaskState = parentTaskState;
		this.node = node;

		const skipProseMirrorDomUpdate = !hasDateChanged && !parentTaskStateChanged;
		return skipProseMirrorDomUpdate;
	}

	private createDOM(node: PMNode): HTMLElement {
		try {
			const spec = dateToDOM(node, this.view.state, this.getPos, this.intl);
			const { dom } = DOMSerializer.renderSpec(document, spec);

			if (!(dom instanceof HTMLElement)) {
				throw new Error('DOMSerializer.renderSpec() did not return HTMLElement');
			}

			// eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
			dom.addEventListener('click', (event) => {
				event.stopImmediatePropagation();
				const { state, dispatch } = this.view;
				setDatePickerAt(state.selection.from)(state, dispatch);
			});

			return dom;
		} catch (error) {
			DateNodeView.logError(
				error instanceof Error ? error : new Error('Unknown error on DateNodeView constructor'),
			);
			return this.renderFallback();
		}
	}

	private renderFallback() {
		const fallbackElement = document.createElement('span');
		fallbackElement.innerText = this.node.attrs.timestamp;
		return fallbackElement;
	}

	private static getParentTaskState(decorations: readonly Decoration[]) {
		const parentTaskDecoration = decorations.find((d) => {
			return d.spec.dataTaskNodeCheckState !== undefined;
		});
		return parentTaskDecoration?.spec?.dataTaskNodeCheckState ?? '';
	}

	private static logError(error: Error) {
		void logException(error, {
			location: 'editor-plugin-date/DateNodeView',
		});
	}
}

import { Listener, UnbindFn, bindAll } from 'bind-event-listener';
import { IntlShape } from 'react-intl-next';

import { SetAttrsStep } from '@atlaskit/adf-schema/steps';
import { tasksAndDecisionsMessages } from '@atlaskit/editor-common/messages';
import { logException } from '@atlaskit/editor-common/monitoring';
import type { ExtractInjectionAPI, getPosHandlerNode } from '@atlaskit/editor-common/types';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { EditorView } from '@atlaskit/editor-prosemirror/view';
import type { NodeView } from '@atlaskit/editor-prosemirror/view';

import { openRequestEditPopupAt } from '../pm-plugins/helpers';
import { TasksAndDecisionsPlugin } from '../tasksAndDecisionsPluginType';
import { TaskAndDecisionsSharedState } from '../types';

import { taskItemToDom } from './taskItemNodeSpec';

interface TaskItemNodeViewOptions {
	api: ExtractInjectionAPI<TasksAndDecisionsPlugin> | undefined;
	placeholder?: string;
	intl: IntlShape;
}

export class TaskItemNodeView implements NodeView {
	dom: HTMLElement = document.createElement('span');
	contentDOM: HTMLElement | undefined;
	private node: PMNode;
	private view: EditorView;
	private getPos: getPosHandlerNode;
	private api: ExtractInjectionAPI<TasksAndDecisionsPlugin> | undefined;
	private readonly intl: IntlShape;
	private objectId?: string;
	private unbindInputDom: UnbindFn | undefined;
	private emptyContent: boolean | undefined;
	private input?: HTMLInputElement;

	private static logError(error: Error) {
		void logException(error, {
			location: 'editor-plugin-date/DateNodeView',
		});
	}

	constructor(
		node: PMNode,
		view: EditorView,
		getPos: getPosHandlerNode,
		{ api, placeholder, intl }: TaskItemNodeViewOptions,
	) {
		this.node = node;
		this.view = view;
		this.getPos = getPos;
		this.intl = intl;
		this.api = api;
		this.view = view;

		try {
			const domPlaceholder =
				placeholder ?? this.intl.formatMessage(tasksAndDecisionsMessages.taskPlaceholder);
			const { dom, contentDOM } = DOMSerializer.renderSpec(
				document,
				taskItemToDom(node, domPlaceholder),
			);
			if (!(dom instanceof HTMLElement)) {
				// It's safe to throw error here because, the code is wrapped in try-catch.
				// However, it should never happen because `DOMSerializer.renderSpec()` should always return HTMLElement.
				throw new Error('DOMSerializer.renderSpec() did not return HTMLElement');
			}

			this.dom = dom;
			this.contentDOM = contentDOM;

			this.input = this.dom.querySelector('input[type="checkbox"]') as HTMLInputElement;
			this.unbindInputDom = bindAll(this.input, [
				{ type: 'click', listener: this.handleOnClick },
				{
					type: 'change',
					listener: this.handleOnChange,
				},
			]);

			this.objectId = this.getObjectAri();
			this.updatePlaceholder(node);
		} catch (error) {
			TaskItemNodeView.logError(
				error instanceof Error ? error : new Error('Unknown error on TaskItemNodeView constructor'),
			);
			this.renderFallback();
		}
	}

	private getContextIdentifierProvider() {
		return this.api?.contextIdentifier?.sharedState.currentState()?.contextIdentifierProvider;
	}

	private getObjectAri() {
		const provider = this.getContextIdentifierProvider();
		if (provider) {
			return provider.objectId;
		}
		return undefined;
	}

	private handleOnClick: Listener<HTMLInputElement, 'click'> = (event) => {
		if (!this.api?.taskDecision?.sharedState.currentState()?.hasEditPermission) {
			event.stopImmediatePropagation();
			event.preventDefault();
			const pos = this.getPos();
			if (typeof pos === 'number') {
				openRequestEditPopupAt(this.view, pos);
			}
			return;
		}
	};

	private handleOnChange: Listener<HTMLInputElement, 'change'> = () => {
		const { tr } = this.view.state;
		const nodePos = (this.getPos as getPosHandlerNode)();
		if (typeof nodePos !== 'number') {
			return;
		}
		const { localId, state } = this.node.attrs;
		const isDone = state === 'DONE';
		const nextState = isDone ? 'TODO' : 'DONE';

		const currentTaskDecisionState: TaskAndDecisionsSharedState | undefined =
			this.api?.taskDecision.sharedState.currentState();

		// logic is inspired from packages/elements/task-decision/src/components/ResourcedTaskItem.tsx
		if (currentTaskDecisionState?.taskDecisionProvider && this.objectId) {
			currentTaskDecisionState?.taskDecisionProvider.toggleTask(
				{ localId, objectAri: this.objectId },
				isDone ? 'DONE' : 'TODO',
			);
		}

		// SetAttrsStep should be used to prevent task updates from being dropped when mapping task ticks
		// from a previous version of the document, such as a published page.
		tr.step(
			new SetAttrsStep(nodePos, {
				state: nextState,
				localId: localId,
			}),
		);
		tr.setMeta('scrollIntoView', false);
		this.view.dispatch(tr);
	};

	private isContentEmpty(node: PMNode) {
		return node.content.childCount === 0;
	}

	private renderFallback() {
		const fallbackElementInput = document.createElement('input');
		fallbackElementInput.setAttribute('type', 'checkbox');
		const fallbackElementText = document.createElement('span');
		fallbackElementText.innerText = this.node.firstChild?.text || '';
		this.dom.appendChild(fallbackElementInput);
		this.dom.appendChild(fallbackElementText);
	}

	// Update the placeholder visibility based on content
	private updatePlaceholder(node: PMNode) {
		const currentIsContentEmpty = this.isContentEmpty(node);
		if (currentIsContentEmpty !== this.emptyContent) {
			this.emptyContent = currentIsContentEmpty;
			this.contentDOM?.toggleAttribute('data-empty', currentIsContentEmpty);
		}
	}

	update(node: PMNode) {
		if (node.type !== this.node.type) {
			return false;
		}
		this.updatePlaceholder(node);
		if (!node.sameMarkup(this.node)) {
			if (node.attrs.state !== this.node.attrs.state) {
				this.dom.setAttribute('data-task-state', node.attrs.state);
				this.dom.setAttribute('state', node.attrs.state);
			}
			this.node = node;
		}
		return true;
	}

	ignoreMutation(mutation: MutationRecord | { type: 'selection'; target: Node }) {
		if (!this.contentDOM) {
			return true;
		}
		return !this.contentDOM.contains(mutation.target) && mutation.type !== 'selection';
	}

	destroy() {
		if (this.unbindInputDom) {
			this.unbindInputDom();
		}
		this.contentDOM = undefined;
		this.input = undefined;
		this.objectId = undefined;
		this.emptyContent = undefined;
		this.api = undefined;
	}
}

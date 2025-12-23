import { type Listener, type UnbindFn, bindAll } from 'bind-event-listener';
import { type IntlShape } from 'react-intl-next';

import { SetAttrsStep } from '@atlaskit/adf-schema/steps';
import { tasksAndDecisionsMessages } from '@atlaskit/editor-common/messages';
import type { ExtractInjectionAPI, getPosHandlerNode } from '@atlaskit/editor-common/types';
import { DOMSerializer } from '@atlaskit/editor-prosemirror/model';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { type EditorView } from '@atlaskit/editor-prosemirror/view';
import type { NodeView } from '@atlaskit/editor-prosemirror/view';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { openRequestEditPopupAt } from '../pm-plugins/helpers';
import type { TasksAndDecisionsPlugin } from '../tasksAndDecisionsPluginType';
import type { TaskAndDecisionsSharedState, TaskItemInfoMeta, TaskItemState } from '../types';

import { taskItemToDom } from './taskItemNodeSpec';
import { isContentEmpty } from './utils';

interface TaskItemNodeViewOptions {
	api: ExtractInjectionAPI<TasksAndDecisionsPlugin> | undefined;
	intl: IntlShape;
	placeholder?: string;
}
export class TaskItemNodeView implements NodeView {
	dom: Node;
	domElement: HTMLElement | undefined;
	contentDOM: HTMLElement | undefined;
	private node: PMNode;
	private view: EditorView;
	private getPos: getPosHandlerNode;
	private api: ExtractInjectionAPI<TasksAndDecisionsPlugin> | undefined;
	private readonly intl: IntlShape;
	private unbindInputDom: UnbindFn | undefined;
	private emptyContent: boolean | undefined;
	private input?: HTMLInputElement;

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
		const domPlaceholder =
			placeholder ?? this.intl.formatMessage(tasksAndDecisionsMessages.taskPlaceholder);
		const { dom, contentDOM } = DOMSerializer.renderSpec(
			document,
			taskItemToDom(node, domPlaceholder, intl),
		);
		this.dom = dom;
		this.contentDOM = contentDOM;
		this.domElement = this.dom instanceof HTMLElement ? this.dom : undefined;
		if (this.domElement) {
			this.input = this.domElement.querySelector('input[type="checkbox"]') as HTMLInputElement;
			this.unbindInputDom = bindAll(this.input, [
				{ type: 'click', listener: this.handleOnClick },
				{
					type: 'change',
					listener: this.handleOnChange,
				},
			]);
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
		const nextState: TaskItemState = isDone ? 'TODO' : 'DONE';

		const currentTaskDecisionState: TaskAndDecisionsSharedState | undefined =
			this.api?.taskDecision.sharedState.currentState();

		// logic is inspired from packages/elements/task-decision/src/components/ResourcedTaskItem.tsx
		const objectAri = this.getObjectAri();
		if (currentTaskDecisionState?.taskDecisionProvider && objectAri) {
			currentTaskDecisionState.taskDecisionProvider.toggleTask({ localId, objectAri }, nextState);
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

		const taskItemInfoMeta: TaskItemInfoMeta = {
			checkState: nextState,
			from: nodePos,
			to: nodePos + this.node.nodeSize,
		};
		tr.setMeta('taskItemInfo', taskItemInfoMeta);

		this.view.dispatch(tr);
	};

	private isContentEmpty(node: PMNode) {
		return node.content.childCount === 0;
	}

	// Update the placeholder visibility based on content
	private updatePlaceholder(node: PMNode) {
		let currentIsContentEmpty = this.isContentEmpty(node);
		if (expValEquals('platform_editor_blocktaskitem_node_tenantid', 'isEnabled', true)) {
			currentIsContentEmpty = isContentEmpty(node);
		}
		if (currentIsContentEmpty !== this.emptyContent) {
			this.emptyContent = currentIsContentEmpty;
			this.contentDOM?.toggleAttribute('data-empty', currentIsContentEmpty);
		}
	}

	update(node: PMNode) {
		if (!expValEquals('platform_editor_prevent_taskitem_remount', 'isEnabled', true)) {
			const isValidUpdate =
				node.type === this.node.type && !!(node.attrs.state === this.node.attrs.state);
			if (!isValidUpdate) {
				return false;
			}
		}

		// Only return false if this is a completely different task
		if (this.node.attrs.localId !== node.attrs.localId) {
			return false;
		}

		if (expValEquals('platform_editor_prevent_taskitem_remount', 'isEnabled', true)) {
			if (node.type !== this.node.type) {
				return false;
			}

			const stateChanged =
				node.type === this.node.type && !!(node.attrs.state !== this.node.attrs.state);

			// Update task checkbox state to match document state.
			// It's possible the state may have changed from a collab edit and not from a checkbox click
			// so we need to update the checkbox to match.
			if (stateChanged && this.input) {
				this.input.checked = node.attrs.state === 'DONE';
			}
		}

		this.updatePlaceholder(node);
		if (this.domElement && !node.sameMarkup(this.node)) {
			this.domElement.setAttribute('data-task-state', node.attrs.state);
			this.domElement.setAttribute('data-task-local-id', node.attrs.localId);
			this.domElement.setAttribute('state', node.attrs.state);
		}
		this.node = node;
		return true;
	}

	ignoreMutation(mutation: MutationRecord | { target: Node; type: 'selection' }) {
		if (!this.contentDOM) {
			return true;
		}
		return !this.contentDOM.contains(mutation.target) && mutation.type !== 'selection';
	}

	destroy(): void {
		if (this.unbindInputDom) {
			this.unbindInputDom();
		}
		this.contentDOM = undefined;
		this.input = undefined;
		this.emptyContent = undefined;
		this.api = undefined;
	}
}

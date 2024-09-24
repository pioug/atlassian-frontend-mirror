import React, { useState } from 'react';

import { useIntl } from 'react-intl-next';

import { SetAttrsStep } from '@atlaskit/adf-schema/steps';
import type { AnalyticsEventPayload, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { tasksAndDecisionsMessages } from '@atlaskit/editor-common/messages';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import ReactNodeView from '@atlaskit/editor-common/react-node-view';
import { type PortalProviderAPI } from '@atlaskit/editor-common/src/portal';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Decoration, EditorView, NodeView } from '@atlaskit/editor-prosemirror/view';
import Heading from '@atlaskit/heading';
import { fg } from '@atlaskit/platform-feature-flags';
import Popup from '@atlaskit/popup';
import { Box, Pressable, Stack, xcss } from '@atlaskit/primitives';

import type { TasksAndDecisionsPlugin } from '../types';
import TaskItem from '../ui/Task';

import { useShowPlaceholder } from './hooks/use-show-placeholder';
type ForwardRef = (node: HTMLElement | null) => void;
type getPosHandler = getPosHandlerNode | boolean;
type getPosHandlerNode = () => number | undefined;
export interface Props {
	providerFactory: ProviderFactory;
}

type TaskItemWrapperProps = {
	localId: string;
	forwardRef: ForwardRef;
	isContentNodeEmpty: boolean;
	providerFactory: ProviderFactory;
	isDone: boolean;
	api: ExtractInjectionAPI<TasksAndDecisionsPlugin> | undefined;
	getPos: () => number | undefined;
	onChange: (taskId: string, isChecked: boolean) => false | undefined;
	editorView: EditorView;
};

const wrapperStyles = xcss({
	display: 'flex',
	flexDirection: 'column',
	maxWidth: '333px',
	paddingTop: 'space.200',
	paddingRight: 'space.300',
	paddingBottom: 'space.200',
	paddingLeft: 'space.300',
});

const wrapperBoxStyles = xcss({
	display: 'flex',
	gap: 'space.050',
});

const dotStyles = xcss({
	margin: 'space.100',
	display: 'inline-block',
	width: '2px',
	height: '2px',
	backgroundColor: 'color.background.accent.blue.bolder',
	borderRadius: '50%',
	transform: 'translateY(2px)',
});

const pressableStyles = xcss({
	color: 'color.text.brand',
	backgroundColor: 'color.background.neutral.subtle',
	':hover': {
		textDecoration: 'underline',
	},
	':active': {
		color: 'color.text.information',
	},
	padding: 'space.0',
});

const TaskItemWrapper = ({
	localId,
	forwardRef,
	isDone,
	onChange,
	providerFactory,
	isContentNodeEmpty,
	api,
	getPos,
	editorView,
}: TaskItemWrapperProps) => {
	const { taskDecisionState } = useSharedPluginState(api, ['taskDecision']);
	const isFocused = Boolean(taskDecisionState?.focusedTaskItemLocalId === localId);
	const [isOpen, setIsOpen] = useState(false);
	const { formatMessage } = useIntl();

	const showPlaceholder = useShowPlaceholder({
		editorView,
		isContentNodeEmpty,
		getPos,
		api,
	});

	const onHandleClick = () => {
		if (fg('editor_request_to_edit_task')) {
			setIsOpen(true);
			const { tr } = editorView.state;
			const nodePos = (getPos as getPosHandlerNode)();

			if (typeof nodePos !== 'number') {
				return;
			}
			tr.setMeta('scrollIntoView', false);

			/**
			 * This is a test implementation to call the request to edit mutation
			 * from within editor when toggling a task where a user has no edit access.
			 *
			 * This will eventially be handled by https://product-fabric.atlassian.net/browse/ED-24773
			 * to connect up the correct user action
			 */
			if (!api?.taskDecision?.sharedState.currentState()?.hasEditPermission) {
				const requestToEdit = api?.taskDecision?.sharedState.currentState()?.requestToEditContent;
				if (requestToEdit) {
					requestToEdit();
				}
			}

			editorView.dispatch(tr);
		}
	};

	if (!fg('editor_request_to_edit_task')) {
		return (
			<TaskItem
				taskId={localId}
				contentRef={forwardRef}
				isDone={isDone}
				onChange={onChange}
				isFocused={isFocused}
				showPlaceholder={showPlaceholder}
				providers={providerFactory}
			/>
		);
	}

	return (
		<Popup
			isOpen={isOpen}
			onClose={() => setIsOpen(false)}
			content={() => (
				<Box xcss={wrapperStyles}>
					<Stack space="space.150">
						<Heading size="xsmall">
							{formatMessage(tasksAndDecisionsMessages.editAccessTitle)}
						</Heading>
						<div>{formatMessage(tasksAndDecisionsMessages.requestToEditDescription)}</div>
						<Box xcss={wrapperBoxStyles}>
							<Box>
								<Pressable xcss={pressableStyles}>
									{formatMessage(tasksAndDecisionsMessages.requestToEdit)}
								</Pressable>
							</Box>
							<Box xcss={dotStyles}></Box>
							<Box>
								<Pressable onClick={() => setIsOpen(false)} xcss={pressableStyles}>
									{formatMessage(tasksAndDecisionsMessages.dismiss)}
								</Pressable>
							</Box>
						</Box>
					</Stack>
				</Box>
			)}
			trigger={(triggerProps) => {
				return (
					<TaskItem
						taskId={localId}
						contentRef={forwardRef}
						inputRef={triggerProps.ref}
						isDone={isDone}
						onChange={onChange}
						onClick={
							api?.editorViewMode?.sharedState.currentState()?.mode === 'view'
								? onHandleClick
								: undefined
						}
						isFocused={isFocused}
						showPlaceholder={showPlaceholder}
						providers={providerFactory}
						disableOnChange={
							!api?.taskDecision?.sharedState.currentState()?.hasEditPermission && true
						}
					/>
				);
			}}
			placement={'bottom-start'}
		/>
	);
};

class Task extends ReactNodeView<Props> {
	private api: ExtractInjectionAPI<TasksAndDecisionsPlugin> | undefined;

	initWithAPI(api: ExtractInjectionAPI<TasksAndDecisionsPlugin> | undefined) {
		this.api = api;
		this.init();
		return this;
	}

	private isContentEmpty(node: PMNode) {
		return node.content.childCount === 0;
	}

	private handleOnChange = (taskId: string, isChecked: boolean) => {
		const { tr } = this.view.state;
		const nodePos = (this.getPos as getPosHandlerNode)();

		if (typeof nodePos !== 'number') {
			return false;
		}

		// SetAttrsStep should be used to prevent task updates from being dropped when mapping task ticks
		// from a previous version of the document, such as a published page.
		tr.step(
			new SetAttrsStep(nodePos, {
				state: isChecked ? 'DONE' : 'TODO',
				localId: taskId,
			}),
		);
		tr.setMeta('scrollIntoView', false);

		/**
		 * This is a test implementation to call the request to edit mutation
		 * from within editor when toggling a task where a user has no edit access.
		 *
		 * This will eventially be handled by https://product-fabric.atlassian.net/browse/ED-24773
		 * to connect up the correct user action
		 */
		if (
			!this.api?.taskDecision?.sharedState.currentState()?.hasEditPermission &&
			fg('editor_request_to_edit_task')
		) {
			const requestToEdit =
				this.api?.taskDecision?.sharedState.currentState()?.requestToEditContent;
			if (requestToEdit) {
				requestToEdit();
			}
		}

		this.view.dispatch(tr);
	};

	/**
	 * Dynamically generates analytics data relating to the parent list.
	 *
	 * Required to be dynamic, as list (in prosemirror model) may have
	 * changed (e.g. item movements, or additional items in list).
	 * This node view will have not rerendered for those changes, so
	 * cannot render the position and listSize into the
	 * AnalyticsContext at initial render time.
	 */
	private addListAnalyticsData = (event: UIAnalyticsEvent) => {
		try {
			const nodePos = (this.getPos as getPosHandlerNode)();
			if (typeof nodePos !== 'number') {
				return false;
			}

			const resolvedPos = this.view.state.doc.resolve(nodePos);
			const position = resolvedPos.index();
			const listSize = resolvedPos.parent.childCount;
			const listLocalId = resolvedPos.parent.attrs.localId;

			event.update((payload: AnalyticsEventPayload) => {
				const { attributes = {}, actionSubject } = payload;
				if (actionSubject !== 'action') {
					// Not action related, ignore
					return payload;
				}
				return {
					...payload,
					attributes: {
						...attributes,
						position,
						listSize,
						listLocalId,
						...(fg('editor_request_to_edit_task') && {
							hasEditPermission:
								this.api?.taskDecision?.sharedState.currentState()?.hasEditPermission,
						}),
					},
				};
			});
		} catch (e) {
			// This can occur if pos is NaN (seen it in some test cases)
			// Act defensively here, and lose some analytics data rather than
			// cause any user facing error.
		}
	};

	createDomRef() {
		const domRef = document.createElement('div');
		domRef.style.listStyleType = 'none';
		return domRef;
	}

	getContentDOM() {
		const dom = document.createElement('div');
		// setting a className prevents PM/Chrome mutation observer from
		// incorrectly deleting nodes
		dom.className = 'task-item';
		return { dom };
	}

	render(props: Props, forwardRef: ForwardRef) {
		const { localId, state } = this.node.attrs;
		const isContentNodeEmpty = this.isContentEmpty(this.node);

		return (
			<AnalyticsListener channel="fabric-elements" onEvent={this.addListAnalyticsData}>
				<TaskItemWrapper
					localId={localId}
					forwardRef={forwardRef}
					isDone={state === 'DONE'}
					onChange={this.handleOnChange}
					isContentNodeEmpty={isContentNodeEmpty}
					providerFactory={props.providerFactory}
					// The getPosHandler type is wrong, there is no `boolean` in the real implementation
					// @ts-expect-error 2322: Type 'getPosHandler' is not assignable to type '() => number | undefined'.
					getPos={this.getPos}
					editorView={this.view}
					api={this.api}
				/>
			</AnalyticsListener>
		);
	}

	viewShouldUpdate(nextNode: PMNode) {
		return (
			(this.isContentEmpty(this.node) && !this.isContentEmpty(nextNode)) ||
			(this.isContentEmpty(nextNode) && !this.isContentEmpty(this.node))
		);
	}

	update(node: PMNode, decorations: readonly Decoration[]) {
		return super.update(
			node,
			decorations,
			undefined,
			(currentNode: PMNode, newNode: PMNode) => !!(currentNode.attrs.state === newNode.attrs.state),
		);
	}

	ignoreMutation(mutation: MutationRecord | { type: 'selection'; target: Element }) {
		if (!this.contentDOM) {
			return true;
		}
		return !this.contentDOM.contains(mutation.target) && mutation.type !== 'selection';
	}
}

export function taskItemNodeViewFactory(
	portalProviderAPI: PortalProviderAPI,
	eventDispatcher: EventDispatcher,
	providerFactory: ProviderFactory,
	api: ExtractInjectionAPI<TasksAndDecisionsPlugin> | undefined,
) {
	return (node: PMNode, view: EditorView, getPos: getPosHandler): NodeView => {
		return new Task(node, view, getPos, portalProviderAPI, eventDispatcher, {
			providerFactory,
		}).initWithAPI(api);
	};
}

import React, { useEffect, useState } from 'react';

import { useIntl } from 'react-intl-next';

import { SetAttrsStep } from '@atlaskit/adf-schema/steps';
import type { AnalyticsEventPayload, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import {
	ACTION,
	ACTION_SUBJECT,
	type EditorAnalyticsAPI,
	EVENT_TYPE,
	MODE,
	PLATFORMS,
	type RequestToEditAEP,
} from '@atlaskit/editor-common/analytics';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { tasksAndDecisionsMessages } from '@atlaskit/editor-common/messages';
import { type PortalProviderAPI } from '@atlaskit/editor-common/portal';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import ReactNodeView from '@atlaskit/editor-common/react-node-view';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { Decoration, EditorView, NodeView } from '@atlaskit/editor-prosemirror/view';
import Heading from '@atlaskit/heading';
import EditorDoneIcon from '@atlaskit/icon/glyph/editor/done';
import { fg } from '@atlaskit/platform-feature-flags';
// Ignored via go/ees005
// eslint-disable-next-line import/no-named-as-default
import Popup from '@atlaskit/popup';
import { Box, Pressable, Stack, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';

import type { TasksAndDecisionsPlugin } from '../tasksAndDecisionsPluginType';
// Ignored via go/ees005
// eslint-disable-next-line import/no-named-as-default
import TaskItem from '../ui/Task';

import { useShowPlaceholder } from './hooks/use-show-placeholder';
type ForwardRef = (node: HTMLElement | null) => void;
type getPosHandler = getPosHandlerNode | boolean;
type getPosHandlerNode = () => number | undefined;
export interface Props {
	placeholder?: string;
	providerFactory: ProviderFactory;
}

type TaskItemWrapperProps = {
	localId: string;
	forwardRef: ForwardRef;
	isContentNodeEmpty: boolean;
	placeholder?: string;
	providerFactory: ProviderFactory;
	isDone: boolean;
	api: ExtractInjectionAPI<TasksAndDecisionsPlugin> | undefined;
	getPos: () => number | undefined;
	onChange: (taskId: string, isChecked: boolean) => false | undefined;
	editorView: EditorView;
};

const TRYING_REQUEST_TIMEOUT = 3000;

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
	color: 'color.text.disabled',
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
	fontSize: '14px',
});

const RequestedMessage = () => {
	const { formatMessage } = useIntl();
	return (
		<>
			{formatMessage(tasksAndDecisionsMessages.requestToEdit)}
			<EditorDoneIcon label="requested-to-edit" primaryColor={token('color.icon.disabled')} />
		</>
	);
};

const RequestToEditButton = ({ onClick }: { onClick?: () => void; isDisabled?: boolean }) => {
	const { formatMessage } = useIntl();
	return (
		<Box>
			<Pressable onClick={onClick} xcss={pressableStyles}>
				{formatMessage(tasksAndDecisionsMessages.requestToEdit)}
			</Pressable>
		</Box>
	);
};

const anaylyticsEventPayload = (
	action: ACTION.REQUEST_TO_EDIT | ACTION.DISMISSED,
): RequestToEditAEP => {
	return {
		action,
		actionSubject: ACTION_SUBJECT.REQUEST_TO_EDIT_POP_UP,
		eventType: EVENT_TYPE.UI,
		attributes: {
			platform: PLATFORMS.WEB,
			mode: MODE.EDITOR,
		},
	};
};

const TaskItemWrapper = ({
	localId,
	forwardRef,
	isDone,
	onChange,
	placeholder,
	providerFactory,
	isContentNodeEmpty,
	api,
	getPos,
	editorView,
}: TaskItemWrapperProps) => {
	const { taskDecisionState } = useSharedPluginState(api, ['taskDecision']);
	const isFocused = Boolean(taskDecisionState?.focusedTaskItemLocalId === localId);
	const [isOpen, setIsOpen] = useState(false);
	const [requested, setRequested] = useState(taskDecisionState?.hasRequestedEditPermission);
	const [tryingRequest, setTryingRequest] = useState(false);
	const { formatMessage } = useIntl();

	useEffect(() => {
		if (fg('editor_request_to_edit_task')) {
			setRequested(taskDecisionState?.hasRequestedEditPermission);
		}
	}, [taskDecisionState?.hasRequestedEditPermission]);

	useEffect(() => {
		if (!tryingRequest && fg('editor_request_to_edit_task')) {
			const timout = setTimeout(() => {
				setTryingRequest(false);
			}, TRYING_REQUEST_TIMEOUT);

			return () => clearTimeout(timout);
		}
	}, [tryingRequest]);

	const showPlaceholder = useShowPlaceholder({
		editorView,
		isContentNodeEmpty,
		getPos,
		api,
	});

	const onHandleEdit = (editorAnalyticsAPI: EditorAnalyticsAPI | undefined) => {
		if (fg('editor_request_to_edit_task')) {
			setTryingRequest(true);
			const { tr } = editorView.state;
			const nodePos = (getPos as getPosHandlerNode)();

			if (typeof nodePos !== 'number') {
				return;
			}

			tr.setMeta('scrollIntoView', false);

			if (!api?.taskDecision?.sharedState.currentState()?.hasEditPermission) {
				const requestToEdit = api?.taskDecision?.sharedState.currentState()?.requestToEditContent;
				if (requestToEdit) {
					requestToEdit();
				}
			}

			editorAnalyticsAPI?.attachAnalyticsEvent(anaylyticsEventPayload(ACTION.REQUEST_TO_EDIT))(tr);
			editorView.dispatch(tr);
		}
	};

	const onHandleDismiss = (editorAnalyticsAPI: EditorAnalyticsAPI | undefined) => {
		editorAnalyticsAPI?.fireAnalyticsEvent(anaylyticsEventPayload(ACTION.DISMISSED));
		setIsOpen(false);
	};

	const onHandleClick = () => {
		if (fg('editor_request_to_edit_task')) {
			setIsOpen(true);
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
				placeholder={placeholder}
				providers={providerFactory}
				api={api}
			/>
		);
	}

	return (
		<Popup
			isOpen={isOpen}
			onClose={() => onHandleDismiss(api?.analytics?.actions)}
			content={() => (
				<Box xcss={wrapperStyles}>
					<Stack space="space.150">
						<Heading size="xsmall">
							{formatMessage(tasksAndDecisionsMessages.editAccessTitle)}
						</Heading>
						<div>{formatMessage(tasksAndDecisionsMessages.requestToEditDescription)}</div>
						<Box xcss={wrapperBoxStyles}>
							{tryingRequest || requested ? (
								<RequestedMessage />
							) : (
								<RequestToEditButton
									onClick={
										api?.editorViewMode?.sharedState.currentState()?.mode === 'view'
											? () => onHandleEdit(api?.analytics?.actions)
											: undefined
									}
								/>
							)}
							<Box xcss={dotStyles}></Box>
							<Box>
								<Pressable
									onClick={() => onHandleDismiss(api?.analytics?.actions)}
									xcss={pressableStyles}
								>
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
						onClick={onHandleClick}
						isFocused={isFocused}
						showPlaceholder={showPlaceholder}
						placeholder={placeholder}
						providers={providerFactory}
						disableOnChange={!api?.taskDecision?.sharedState.currentState()?.hasEditPermission}
						api={api}
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
					placeholder={props.placeholder}
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

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/max-params
export function taskItemNodeViewFactory(
	portalProviderAPI: PortalProviderAPI,
	eventDispatcher: EventDispatcher,
	providerFactory: ProviderFactory,
	api: ExtractInjectionAPI<TasksAndDecisionsPlugin> | undefined,
	placeholder?: string,
) {
	return (node: PMNode, view: EditorView, getPos: getPosHandler): NodeView => {
		return new Task(node, view, getPos, portalProviderAPI, eventDispatcher, {
			placeholder,
			providerFactory,
		}).initWithAPI(api);
	};
}

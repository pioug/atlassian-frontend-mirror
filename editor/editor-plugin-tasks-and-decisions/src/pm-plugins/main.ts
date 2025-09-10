import { type IntlShape } from 'react-intl-next';

import { uuid } from '@atlaskit/adf-schema';
import { SetAttrsStep } from '@atlaskit/adf-schema/steps';
import type { Dispatch, EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { type NodeViewConstructor } from '@atlaskit/editor-common/lazy-node-view';
import { type PortalProviderAPI } from '@atlaskit/editor-common/portal';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { createSelectionClickHandler, GapCursorSelection } from '@atlaskit/editor-common/selection';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { getStepRange } from '@atlaskit/editor-common/utils';
import type { Node as PMNode, Slice } from '@atlaskit/editor-prosemirror/model';
import type {
	EditorState,
	ReadonlyTransaction,
	Transaction,
} from '@atlaskit/editor-prosemirror/state';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import { Decoration, DecorationSet, type EditorView } from '@atlaskit/editor-prosemirror/view';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

import { DecisionItemNodeView } from '../nodeviews/DecisionItemNodeView';
import { taskView } from '../nodeviews/task-node-view';
import type { TasksAndDecisionsPlugin } from '../tasksAndDecisionsPluginType';
import type { TaskDecisionPluginState, TaskItemInfoMeta } from '../types';

import { focusTaskDecision, setProvider, openRequestEditPopup } from './actions';
import {
	focusCheckbox,
	focusCheckboxAndUpdateSelection,
	getTaskItemDataAtPos,
	getTaskItemDataToFocus,
	isInsideTask,
	removeCheckboxFocus,
} from './helpers';
import { stateKey } from './plugin-key';
import { taskItemOnChange } from './taskItemOnChange';
import { ACTIONS, type TaskDecisionPluginAction, type TaskDecisionPluginCommand } from './types';
import { tempTransformSliceToRemoveBlockTaskItem } from './utils/paste';

type ChangedFn = (
	node: PMNode,
	pos: number,
	parent: PMNode | null,
	index: number,
) => boolean | void;
function nodesBetweenChanged(
	tr: Transaction | ReadonlyTransaction,
	f: ChangedFn,
	startPos?: number,
) {
	const stepRange = getStepRange(tr);
	if (!stepRange) {
		return;
	}

	tr.doc.nodesBetween(stepRange.from, stepRange.to, f, startPos);
}

// eslint-disable-next-line jsdoc/require-jsdoc
export function createPlugin(
	portalProviderAPI: PortalProviderAPI,
	eventDispatcher: EventDispatcher,
	dispatch: Dispatch,
	api: ExtractInjectionAPI<TasksAndDecisionsPlugin> | undefined,
	getIntl: () => IntlShape,
	useLongPressSelection: boolean = false,
	hasEditPermission?: boolean,
	hasRequestedEditPermission?: boolean,
	requestToEditContent?: () => void,
	taskPlaceholder?: string,
) {
	return new SafePlugin<TaskDecisionPluginState>({
		props: {
			nodeViews: {
				taskItem: taskView(api, getIntl(), taskPlaceholder),
				decisionItem: ((node) => {
					return new DecisionItemNodeView(node, getIntl());
				}) satisfies NodeViewConstructor,
				...(expValEquals('platform_editor_blocktaskitem_node', 'isEnabled', true)
					? { blockTaskItem: taskView(api, getIntl(), taskPlaceholder) }
					: {}),
			},
			decorations(state) {
				const pluginState = stateKey.getState(state);
				if (pluginState?.decorations) {
					return pluginState.decorations;
				}
				return DecorationSet.empty;
			},
			handleTextInput(view: EditorView, from: number, to: number, text: string) {
				// When a decision item is selected and the user starts typing, the entire node
				// should be replaced with what was just typed. This custom text input handler
				// is needed to implement that behaviour.

				const { state, dispatch } = view;
				const { tr } = state;
				if (
					state.selection instanceof NodeSelection &&
					state.selection.node.type === view.state.schema.nodes.decisionItem
				) {
					state.selection.replace(tr);
					tr.insertText(text);
					if (dispatch) {
						dispatch(tr);
					}
					return true;
				}
				return false;
			},
			handleClickOn: createSelectionClickHandler(
				['decisionItem', 'taskItem'],
				(target) =>
					target.hasAttribute('data-decision-wrapper') ||
					target.getAttribute('aria-label') === 'Decision',
				{ useLongPressSelection },
			),
			handleDOMEvents: {
				// When the page is lazy loaded and task item is not yet available this allows
				// our toDOM implementation to toggle the node state
				change: taskItemOnChange,
			},
			handleKeyDown: (view: EditorView, event: KeyboardEvent) => {
				const { state } = view;
				const { selection, schema } = state;
				const { $from, $to } = selection;
				const parentOffset = $from.parentOffset;
				const isInTaskItem = expValEquals(
					'platform_editor_blocktaskitem_patch_1',
					'isEnabled',
					true,
				)
					? isInsideTask(state)
					: $from.node().type === schema.nodes.taskItem;

				const focusedTaskItemLocalId = stateKey.getState(state).focusedTaskItemLocalId;

				const currentTaskItemData = getTaskItemDataAtPos(view);

				const currentTaskItemFocused = focusedTaskItemLocalId === currentTaskItemData?.localId;

				// if task item checkbox not focused and arrow key is not pressed
				//  then we don't want to handle event.
				if (!['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft'].includes(event.key)) {
					return false;
				}

				// We want to handle arrow up, down and left key only
				//  when selection is inside task item and no text is selected.
				if (
					['ArrowUp', 'ArrowDown', 'ArrowLeft'].includes(event.key) &&
					(!isInTaskItem || $from.pos !== $to.pos)
				) {
					return false;
				}

				// Arrow keys are pressed and shift, ctrl or meta is pressed as well.
				//  along with arrow keys and task item checkbox is focused
				//  then first move focus to view and proceed with default event handling.
				if (event.shiftKey || event.ctrlKey || event.metaKey) {
					currentTaskItemFocused && removeCheckboxFocus(view);
					return false;
				}

				// task item checkbox is already focused
				if (focusedTaskItemLocalId) {
					if (event.key === 'ArrowLeft') {
						// Move focus to view and proceed with default keyboard handler.
						// Which will move cursor to previous position.
						removeCheckboxFocus(view);
						return false;
					}
					if (event.key === 'ArrowRight') {
						// Move focus to view and DON'T proceed with default handler.
						// We have assumed that selection is already before first character of task item.
						removeCheckboxFocus(view);
						return true;
					}

					if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
						const taskItemData = getTaskItemDataToFocus(
							view,
							event.key === 'ArrowUp' ? 'previous' : 'next',
						);
						if (taskItemData) {
							focusCheckboxAndUpdateSelection(view, taskItemData);
							return true;
						} else {
							// If any how checkbox input not found, then move focus to view
							//  and proceed with default keyboard handler.
							removeCheckboxFocus(view);
							return false;
						}
					}
				}
				// If left arrow key is pressed and cursor is at first position in task-item
				//  then focus checkbox and DON'T proceed with default keyboard handler
				if (event.key === 'ArrowLeft' && parentOffset === 0) {
					// here we are not using focusCheckboxAndUpdateSelection() method
					// because it is working incorretly when we are placing is inside the nested items
					focusCheckbox(view, currentTaskItemData);
					return true;
				}

				if (event.key === 'ArrowRight') {
					// If gap cursor is just before task list then focus first task item in list.
					if (
						selection instanceof GapCursorSelection &&
						selection.side === 'left' &&
						$from.nodeAfter?.type === schema.nodes.taskList
					) {
						const taskList = $from.nodeAfter;
						const firstTaskItemNode = taskList.child(0);
						const taskItemPos = $from.pos + 1;
						focusCheckboxAndUpdateSelection(view, {
							pos: taskItemPos,
							localId: firstTaskItemNode.attrs.localId,
						});
						return true;
					}
					// if cursor is at then end of task item text then focus next task item checkbox
					else if (isInTaskItem && $from.node().content.size === parentOffset) {
						const nextTaskItemData = getTaskItemDataToFocus(view, 'next');
						if (nextTaskItemData) {
							focusCheckboxAndUpdateSelection(view, nextTaskItemData);
							return true;
						}
					} else {
						return false;
					}
				}
			},
			transformPasted: (slice: Slice, view: EditorView) => {
				if (Boolean(view?.state?.schema?.nodes?.blockTaskItem)) {
					slice = tempTransformSliceToRemoveBlockTaskItem(slice, view);
				}

				return slice;
			},
		},
		state: {
			init() {
				return {
					insideTaskDecisionItem: false,
					hasEditPermission,
					hasRequestedEditPermission,
					requestToEditContent,
					focusedTaskItemLocalId: null,
					taskDecisionProvider: undefined,
					decorations: DecorationSet.empty,
				};
			},
			apply(tr, pluginState) {
				const metaData: (TaskDecisionPluginAction & TaskDecisionPluginCommand) | undefined =
					tr.getMeta(stateKey);
				const { action, data } = metaData ?? {
					action: null,
					data: null,
				};
				let newPluginState = pluginState;

				// Actions
				switch (action) {
					case ACTIONS.FOCUS_BY_LOCALID:
						newPluginState = focusTaskDecision(newPluginState, {
							action: ACTIONS.FOCUS_BY_LOCALID,
							data,
						});
						break;

					case ACTIONS.SET_PROVIDER:
						newPluginState = setProvider(newPluginState, {
							action: ACTIONS.SET_PROVIDER,
							data,
						});
						break;

					case ACTIONS.OPEN_REQUEST_TO_EDIT_POPUP:
						newPluginState = openRequestEditPopup(newPluginState, {
							action: ACTIONS.OPEN_REQUEST_TO_EDIT_POPUP,
							data,
						});
						break;
				}

				// Commands
				if (metaData && 'hasEditPermission' in metaData) {
					newPluginState = {
						...newPluginState,
						hasEditPermission: metaData.hasEditPermission,
					};
				}

				if (metaData && 'hasRequestedEditPermission' in metaData) {
					newPluginState = {
						...newPluginState,
						hasRequestedEditPermission: metaData.hasRequestedEditPermission,
					};
				}

				const taskItemInfo = tr.getMeta('taskItemInfo') as TaskItemInfoMeta;
				let decorations: DecorationSet = DecorationSet.empty;

				if (taskItemInfo) {
					decorations = DecorationSet.create(tr.doc, [
						Decoration.inline(
							taskItemInfo.from,
							taskItemInfo.to,
							{},
							{
								dataTaskNodeCheckState: taskItemInfo.checkState,
							},
						),
					]);
				} else {
					decorations = newPluginState.decorations?.map(tr.mapping, tr.doc);
				}

				const newState = {
					...newPluginState,
					decorations,
				};

				dispatch(stateKey, newState);
				return newState;
			},
		},
		key: stateKey,
		/*
		 * After each transaction, we search through the document for any decisionList/Item & taskList/Item nodes
		 * that do not have the localId attribute set and generate a random UUID to use. This is to replace a previous
		 * Prosemirror capability where node attributes could be generated dynamically.
		 * See https://discuss.prosemirror.net/t/release-0-23-0-possibly-to-be-1-0-0/959/17 for a discussion of this approach.
		 *
		 * Note: we currently do not handle the edge case where two nodes may have the same localId
		 */
		appendTransaction: (transactions, _oldState, newState) => {
			const tr = newState.tr;
			let modified = false;
			transactions.forEach((transaction) => {
				if (!transaction.docChanged) {
					return;
				}

				// Adds a unique id to a node
				nodesBetweenChanged(transaction, (node, pos) => {
					const { decisionList, decisionItem, taskList, taskItem, blockTaskItem } =
						newState.schema.nodes;
					if (
						!!node.type &&
						(node.type === decisionList ||
							node.type === decisionItem ||
							node.type === taskList ||
							node.type === taskItem ||
							(blockTaskItem && node.type === blockTaskItem))
					) {
						const { localId, ...rest } = node.attrs;
						if (localId === undefined || localId === null || localId === '') {
							tr.step(
								new SetAttrsStep(pos, {
									localId: uuid.generate(),
									...rest,
								}),
							);

							modified = true;
						}
					}
				});
			});

			if (modified) {
				return tr.setMeta('addToHistory', false);
			}
			return;
		},
		view: () => {
			return {
				update: (view: EditorView, prevState: EditorState) => {
					const pluginState = stateKey.getState(view.state);
					const prevPluginState = stateKey.getState(prevState);
					if (pluginState.focusedTaskItemLocalId === prevPluginState.focusedTaskItemLocalId) {
						return;
					}
					const taskItem = getTaskItemDataAtPos(view);
					if (!taskItem) {
						return;
					}
					if (pluginState.focusedTaskItemLocalId === taskItem.localId) {
						const taskElement = view.nodeDOM(taskItem.pos);
						if (taskElement instanceof HTMLElement) {
							taskElement?.querySelector('input')?.focus();
						}
					}
				},
			};
		},
	});
}

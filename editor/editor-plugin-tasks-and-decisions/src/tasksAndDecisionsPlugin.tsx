/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { decisionList, taskItem, taskList } from '@atlaskit/adf-schema';
import { css, jsx } from '@atlaskit/css';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { MAX_INDENTATION_LEVEL } from '@atlaskit/editor-common/indentation';
import { convertToInlineCss } from '@atlaskit/editor-common/lazy-node-view';
import { toolbarInsertBlockMessages as insertBlockMessages } from '@atlaskit/editor-common/messages';
import { IconAction, IconDecision } from '@atlaskit/editor-common/quick-insert';
import { TaskDecisionSharedCssClassName } from '@atlaskit/editor-common/styles';
import type { DOMOutputSpec, Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import type { TaskDecisionProvider } from '@atlaskit/task-decision/types';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

import { decisionItemSpecWithFixedToDOM } from './nodeviews/toDOM-fixes/decisionItem';
import { getCurrentIndentLevel, getTaskItemIndex, isInsideTask } from './pm-plugins/helpers';
// Ignored via go/ees005
// eslint-disable-next-line import/no-named-as-default
import inputRulePlugin from './pm-plugins/input-rules';
import {
	getListTypes,
	insertTaskDecisionAction,
	insertTaskDecisionCommand,
	setProvider,
} from './pm-plugins/insert-commands';
import keymap, { getIndentCommand, getUnindentCommand } from './pm-plugins/keymaps';
import { createPlugin } from './pm-plugins/main';
import { stateKey as taskPluginKey } from './pm-plugins/plugin-key';
import type { TasksAndDecisionsPlugin } from './tasksAndDecisionsPluginType';
import type { TaskDecisionListType } from './types';
import ToolbarDecision from './ui/ToolbarDecision';
import ToolbarTask from './ui/ToolbarTask';

const taskDecisionToolbarGroupStyles = css({
	display: 'flex',
});

type HTMLInputElementAttrs = { type: 'checkbox'; checked?: 'true'; id: string; name: string };

// @nodeSpecException:toDOM patch
export const taskItemSpecWithFixedToDOM = () => {
	if (editorExperiment('platform_editor_exp_lazy_node_views', false)) {
		return taskItem;
	}

	return {
		...taskItem,
		toDOM: (node: PMNode): DOMOutputSpec => {
			const checked = node.attrs.state === 'DONE';
			const inputAttrs: HTMLInputElementAttrs = {
				name: node.attrs.localId,
				id: node.attrs.localId,
				type: 'checkbox',
			};
			if (checked) {
				inputAttrs.checked = 'true';
			}

			const dataAttrs = {
				'data-task-local-id': node.attrs.localId,
				'data-task-state': node.attrs.state,
			};

			return [
				'div',
				{
					class: TaskDecisionSharedCssClassName.TASK_CONTAINER,
					...dataAttrs,
					style: convertToInlineCss({
						listStyleType: 'none',
						lineHeight: '24px',
						minWidth: '48px',
						position: 'relative',
					}),
				},
				[
					'div',
					{
						style: convertToInlineCss({
							display: 'flex',
						}),
					},
					[
						'span',
						{
							contenteditable: 'false',
							style: convertToInlineCss({
								width: '24px',
								height: '24px',
								lineHeight: '24px',
								display: 'grid',
								placeContent: 'center center',
							}),
						},
						[
							'input',
							{
								...inputAttrs,
								'data-input-type': 'lazy-task-item',
								style: convertToInlineCss({
									width: '13px',
									height: '13px',
									margin: '1px 0 0 0',
									padding: 0,
									accentColor: token('color.background.selected.bold'),
								}),
							},
						],
					],
					[
						'div',
						{
							'data-component': 'content',
						},
						[
							'div',
							{
								class: TaskDecisionSharedCssClassName.TASK_ITEM,
								style: convertToInlineCss({
									display: 'block',
									fontSize: '16px',
									fontFamily: token('font.body'),
									color: token('color.text'),
								}),
							},
							0,
						],
					],
				],
			];
		},
	};
};

const addItem =
	(insert: (node: PMNode) => Transaction, listType: TaskDecisionListType, schema: Schema) =>
	({ listLocalId, itemLocalId }: { listLocalId?: string; itemLocalId?: string }) => {
		const { list, item } = getListTypes(listType, schema);
		return insert(
			list.createChecked(
				{ localId: listLocalId },
				item.createChecked({
					localId: itemLocalId,
				}),
			),
		);
	};

export const tasksAndDecisionsPlugin: TasksAndDecisionsPlugin = ({
	config: {
		allowNestedTasks,
		consumeTabs,
		useLongPressSelection,
		hasEditPermission = true,
		hasRequestedEditPermission,
		quickInsertActionDescription,
		requestToEditContent,
		taskDecisionProvider,
		taskPlaceholder,
	} = {},
	api,
}) => {
	const getIdentifierProvider = () =>
		api?.contextIdentifier?.sharedState.currentState()?.contextIdentifierProvider;
	let previousTaskAndDecisionProvider: TaskDecisionProvider | undefined;

	if (taskDecisionProvider) {
		taskDecisionProvider.then((provider) => {
			api?.core.actions.execute(({ tr }) => setProvider(provider)(tr));
		});
	}

	return {
		name: 'taskDecision',
		nodes() {
			return [
				{ name: 'decisionList', node: decisionList },
				{ name: 'decisionItem', node: decisionItemSpecWithFixedToDOM() },
				{
					name: 'taskList',
					node: taskList,
				},
				{ name: 'taskItem', node: taskItemSpecWithFixedToDOM() },
			];
		},

		getSharedState(editorState) {
			if (!editorState) {
				return undefined;
			}

			const pluginState = taskPluginKey.getState(editorState);
			const indentLevel = getCurrentIndentLevel(editorState.selection) || 0;
			const itemIndex = getTaskItemIndex(editorState);

			return {
				focusedTaskItemLocalId: pluginState?.focusedTaskItemLocalId || null,
				isInsideTask: isInsideTask(editorState),
				indentDisabled: itemIndex === 0 || indentLevel >= MAX_INDENTATION_LEVEL,
				outdentDisabled: indentLevel <= 1,
				// hasEditPermission is assumed to be true if pluginState.hasEditPermission is undefined
				// this allows the default plugin state to initialise as true if the extra configuration is not provided
				hasEditPermission:
					pluginState?.hasEditPermission !== undefined ? pluginState?.hasEditPermission : true,
				requestToEditContent: pluginState?.requestToEditContent,
				hasRequestedEditPermission: pluginState?.hasRequestedEditPermission,
				taskDecisionProvider: pluginState?.taskDecisionProvider,
			};
		},

		commands: {
			updateEditPermission:
				(hasEditPermission: boolean | undefined) =>
				({ tr }) =>
					tr.setMeta(taskPluginKey, { hasEditPermission }),
			updateHasRequestedEditPermission:
				(hasRequestedEditPermission: boolean | undefined) =>
				({ tr }) =>
					tr.setMeta(taskPluginKey, { hasRequestedEditPermission }),
		},

		actions: {
			insertTaskDecision: insertTaskDecisionCommand(api?.analytics?.actions, getIdentifierProvider),
			indentTaskList: getIndentCommand(api?.analytics?.actions),
			outdentTaskList: getUnindentCommand(api?.analytics?.actions),
			setProvider: async (providerPromise: Promise<TaskDecisionProvider>) => {
				const provider = await providerPromise;
				// Prevent someone trying to set the exact same provider twice for performance reasons+
				if (
					previousTaskAndDecisionProvider === provider ||
					taskDecisionProvider === providerPromise
				) {
					return false;
				}
				previousTaskAndDecisionProvider = provider;
				return api?.core.actions.execute(({ tr }) => setProvider(provider)(tr)) ?? false;
			},
		},

		pmPlugins() {
			return [
				{
					name: 'tasksAndDecisions',
					plugin: ({ portalProviderAPI, providerFactory, eventDispatcher, dispatch }) => {
						return createPlugin(
							portalProviderAPI,
							eventDispatcher,
							providerFactory,
							dispatch,
							api,
							useLongPressSelection,
							hasEditPermission,
							hasRequestedEditPermission,
							requestToEditContent,
							taskPlaceholder,
						);
					},
				},
				{
					name: 'tasksAndDecisionsInputRule',
					plugin: ({ schema, featureFlags }) =>
						inputRulePlugin(api?.analytics?.actions, getIdentifierProvider)(schema, featureFlags),
				},
				{
					name: 'tasksAndDecisionsKeyMap',
					plugin: ({ schema }) => keymap(schema, api, allowNestedTasks, consumeTabs),
				}, // Needs to be after "save-on-enter"
			];
		},

		secondaryToolbarComponent({ editorView, disabled }) {
			return (
				<div css={taskDecisionToolbarGroupStyles}>
					<ToolbarDecision
						editorView={editorView}
						isDisabled={disabled}
						isReducedSpacing
						editorAPI={api}
					/>
					<ToolbarTask
						editorView={editorView}
						isDisabled={disabled}
						isReducedSpacing
						editorAPI={api}
					/>
				</div>
			);
		},

		pluginsOptions: {
			quickInsert: ({ formatMessage }) => [
				{
					id: 'action',
					title: formatMessage(insertBlockMessages.action),
					description:
						quickInsertActionDescription ?? formatMessage(insertBlockMessages.actionDescription),
					priority: 100,
					keywords: ['checkbox', 'task', 'todo'],
					keyshortcut: '[]',
					icon: () => <IconAction />,
					action(insert, state) {
						return insertTaskDecisionAction(api?.analytics?.actions, getIdentifierProvider)(
							state,
							'taskList',
							INPUT_METHOD.QUICK_INSERT,
							addItem(insert, 'taskList', state.schema),
						);
					},
				},
				{
					id: 'decision',
					title: formatMessage(insertBlockMessages.decision),
					description: formatMessage(insertBlockMessages.decisionDescription),
					priority: 900,
					keyshortcut: '<>',
					icon: () => <IconDecision />,
					action(insert, state) {
						return insertTaskDecisionAction(api?.analytics?.actions, getIdentifierProvider)(
							state,
							'decisionList',
							INPUT_METHOD.QUICK_INSERT,
							addItem(insert, 'decisionList', state.schema),
						);
					},
				},
			],
		},
	};
};

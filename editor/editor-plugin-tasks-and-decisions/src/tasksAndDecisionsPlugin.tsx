/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { decisionList, taskList } from '@atlaskit/adf-schema';
import { css, jsx } from '@atlaskit/css';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import { MAX_INDENTATION_LEVEL } from '@atlaskit/editor-common/indentation';
import { toolbarInsertBlockMessages as insertBlockMessages } from '@atlaskit/editor-common/messages';
import { IconAction, IconDecision } from '@atlaskit/editor-common/quick-insert';
import { ExtractInjectionAPI, UiComponentFactoryParams } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import type { Node as PMNode, Schema } from '@atlaskit/editor-prosemirror/model';
import type { Transaction } from '@atlaskit/editor-prosemirror/state';
import { findDomRefAtPos } from '@atlaskit/editor-prosemirror/utils';
import type { TaskDecisionProvider } from '@atlaskit/task-decision/types';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { taskItemNodeSpec } from './nodeviews/taskItemNodeSpec';
import { decisionItemSpecWithFixedToDOM } from './nodeviews/toDOM-fixes/decisionItem';
import {
	closeRequestEditPopupAt,
	getCurrentIndentLevel,
	getTaskItemIndex,
	isInsideTask,
} from './pm-plugins/helpers';
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
import { RequestToEditPopup } from './ui/Task/RequestToEditPopup';
import ToolbarDecision from './ui/ToolbarDecision';
import ToolbarTask from './ui/ToolbarTask';

const taskDecisionToolbarGroupStyles = css({
	display: 'flex',
});

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

function ContentComponent({
	editorView,
	dispatchAnalyticsEvent,
	popupsMountPoint,
	popupsBoundariesElement,
	popupsScrollableElement,
	dependencyApi,
}: Pick<
	UiComponentFactoryParams,
	| 'editorView'
	| 'dispatchAnalyticsEvent'
	| 'popupsMountPoint'
	| 'popupsBoundariesElement'
	| 'popupsScrollableElement'
> & {
	dependencyApi?: ExtractInjectionAPI<typeof tasksAndDecisionsPlugin>;
}): JSX.Element | null {
	const domAtPos = editorView.domAtPos.bind(editorView);
	const openRequestToEditPopupAt = useSharedPluginStateSelector(
		dependencyApi,
		'taskDecision.openRequestToEditPopupAt',
	);

	const hasEditPermission = useSharedPluginStateSelector(
		dependencyApi,
		'taskDecision.hasEditPermission',
	);

	if (editorExperiment('platform_editor_vanilla_dom', false, { exposure: true })) {
		return null;
	}

	if (hasEditPermission || !openRequestToEditPopupAt) {
		return null;
	}

	// eslint-disable-next-line @atlaskit/editor/no-as-casting
	const element = findDomRefAtPos(openRequestToEditPopupAt, domAtPos) as HTMLElement;

	const handleOnClose = () => {
		closeRequestEditPopupAt(editorView);
		editorView.focus();
	};

	return (
		<RequestToEditPopup
			key={openRequestToEditPopupAt}
			api={dependencyApi}
			editorView={editorView}
			mountTo={popupsMountPoint}
			boundariesElement={popupsBoundariesElement}
			scrollableElement={popupsScrollableElement}
			element={element}
			onClose={handleOnClose}
		/>
	);
}

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
				{ name: 'taskItem', node: taskItemNodeSpec() },
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
				openRequestToEditPopupAt: pluginState?.openRequestToEditPopupAt,
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
					plugin: ({ portalProviderAPI, providerFactory, eventDispatcher, dispatch, getIntl }) => {
						return createPlugin(
							portalProviderAPI,
							eventDispatcher,
							providerFactory,
							dispatch,
							api,
							getIntl,
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

		contentComponent({
			editorView,
			dispatchAnalyticsEvent,
			popupsMountPoint,
			popupsBoundariesElement,
			popupsScrollableElement,
		}) {
			return (
				<ContentComponent
					dependencyApi={api}
					editorView={editorView}
					dispatchAnalyticsEvent={dispatchAnalyticsEvent}
					popupsMountPoint={popupsMountPoint}
					popupsBoundariesElement={popupsBoundariesElement}
					popupsScrollableElement={popupsScrollableElement}
				/>
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

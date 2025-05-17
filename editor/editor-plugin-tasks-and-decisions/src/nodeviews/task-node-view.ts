import { type IntlShape } from 'react-intl-next';

import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { withLazyLoading } from '@atlaskit/editor-common/lazy-node-view';
import { type PortalProviderAPI } from '@atlaskit/editor-common/portal';
import type { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import type { TasksAndDecisionsPlugin } from '../tasksAndDecisionsPluginType';

import { taskItemNodeViewFactory } from './taskItem';
import { TaskItemNodeView } from './TaskItemNodeView';

export const taskView = (
	portalProviderAPI: PortalProviderAPI,
	eventDispatcher: EventDispatcher,
	providerFactory: ProviderFactory,
	api: ExtractInjectionAPI<TasksAndDecisionsPlugin> | undefined,
	intl: IntlShape,
	placeholder?: string,
) => {
	if (editorExperiment('platform_editor_vanilla_dom', true, { exposure: true })) {
		return (node: PMNode, view: EditorView, getPos: () => number | undefined) => {
			return new TaskItemNodeView(node, view, getPos, {
				placeholder,
				api,
				intl,
			});
		};
	}
	if (editorExperiment('platform_editor_exp_lazy_node_views', false)) {
		return taskItemNodeViewFactory(
			portalProviderAPI,
			eventDispatcher,
			providerFactory,
			api,
			intl,
			placeholder,
		);
	}

	return withLazyLoading({
		nodeName: 'taskItem',
		getNodeViewOptions: () => {},
		loader: () => {
			const result = import(
				/* webpackChunkName: "@atlaskit-internal_editor-plugin-tasks-and-decisions_task-item-nodeview" */
				'./taskItem'
			).then(({ taskItemNodeViewFactory }) => {
				return (node: PMNode, view: EditorView, getPos: () => number | undefined) => {
					return taskItemNodeViewFactory(
						portalProviderAPI,
						eventDispatcher,
						providerFactory,
						api,
						intl,
						placeholder,
					)(node, view, getPos);
				};
			});
			return result;
		},
	});
};
